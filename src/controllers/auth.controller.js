const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schema");
const { responseHandler } = require("../utils/responseHandler");
const { sendEmail } = require("../lib/nodemailer");
const { redisClient } = require("../lib/redis");

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  console.log(email);

  try {
    const isUserExist = await User.findOne({ email });

    console.log(isUserExist);

    if (isUserExist)
      return responseHandler(res).error(400, "User already exist");

    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const otp = Math.floor(1000 + Math.random() * 9000);

    await redisClient.set(user._id, otp, "EX", 3600);

    await sendEmail(
      email,
      "OTP for login",
      `
    <p>Hello ${name},</p>
    <p>Your OTP for login is ${otp}</p>
    `
    );

    return responseHandler(res).success(200, "User created", { user, token });
  } catch (error) {
    return responseHandler(res).error(500, error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return responseHandler(res).error(400, "User not found");

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid)
      return responseHandler(res).error(400, "Invalid credentials");

    let _user = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign({ user: _user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    if (!user.isEmailVerified)
      return responseHandler(res).success(
        200,
        "User logged in, Please verify your email",
        {
          user: _user,
          token,
        }
      );

    return responseHandler(res).success(200, "User logged in", {
      user: _user,
      token,
    });
  } catch (error) {
    return responseHandler(res).error(500, error);
  }
};

const verifyOtp = async (req, res) => {
  const user = req.user;
  const email = user.email;

  const { otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return responseHandler(res).error(400, "User not found");

    if (user.isEmailVerified)
      return responseHandler(res).error(400, "User already verified");

    const storedOtp = await redisClient.get(user._id);

    if (!otp) return responseHandler(res).error(400, "OTP not found");

    if (storedOtp !== otp)
      return responseHandler(res).error(400, "Invalid OTP");

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { isEmailVerified: true }
    ).select();

    await redisClient.del(user._id);

    return responseHandler(res).success(200, "OTP verified", {
      user: { ...updatedUser, isEmailVerified: true },
    });
  } catch (error) {
    return responseHandler(res).error(500, error);
  }
};

const verifyUser = async (req, res) => {
  return responseHandler(res).success(200, "User verified", req.user);
};

module.exports = { registerUser, loginUser, verifyUser, verifyOtp };
