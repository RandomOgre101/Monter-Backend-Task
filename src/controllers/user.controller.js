const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schema");
const { responseHandler } = require("../utils/responseHandler");
const { sendEmail } = require("../lib/nodemailer");
const { redisClient } = require("../lib/redis");
const UserDetail = require("../schemas/user-details.schema");
const { default: mongoose } = require("mongoose");

const addUserDetail = async (req, res) => {
  const user = req.user;

  try {
    const { location, age, jobTitle, department, company } = req.body;
    const isUserDetailExist = await UserDetail.findOne({ user: user._id });

    if (isUserDetailExist)
      return responseHandler(res).error(400, "Your details already exist");

    const userDetail = new UserDetail({
      user: user._id,
      location,
      age,
      jobTitle,
      department,
      company,
    });

    await userDetail.save();

    return responseHandler(res).success(200, "User details created", {
      userDetail,
    });
  } catch (error) {
    return responseHandler(res).error(500, error);
  }
};

const updateUserDetail = async (req, res) => {
  const user = req.user;

  try {
    const isUserDetailExist = await UserDetail.findOne({ user: user._id });

    if (!isUserDetailExist)
      return responseHandler(res).error(400, "Your details doesn't exist");

    const userDetail = await UserDetail.findOneAndUpdate(
      { user: user._id },
      req.body,
      { new: true, runValidators: true }
    );

    return responseHandler(res).success(200, "User details updated", {
      userDetail,
    });
  } catch (error) {
    return responseHandler(res).error(500, error);
  }
};

const getUserDetail = async (req, res) => {
  const user = req.user;

  try {
    const userDetail = await UserDetail.findOne({ user: user._id }).populate(
      "user"
    );

    if (!userDetail)
      return responseHandler(res).error(400, "Your details doesn't exist");

    return responseHandler(res).success(200, "User details updated", {
      userDetail,
    });
  } catch (error) {
    return responseHandler(res).error(500, error);
  }
};

module.exports = { addUserDetail, updateUserDetail, getUserDetail };
