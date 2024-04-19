const { getBearerToken } = require("../utils/getBearerToken");
const { verifyJwtWithBearer } = require("../utils/verifyJwt");
const { responseHandler } = require("../utils/responseHandler");
const User = require("../schemas/user.schema");
const { TokenExpiredError } = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const protectedRoute = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token)
    return responseHandler(res).error(
      401,
      "You are not logged in! Please login"
    );

  try {
    const decoded = await verifyJwtWithBearer(token);

    const user = await User.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(decoded.user._id),
    });

    if (!user) return responseHandler(res).error(401, "User not found");

    req.user = user;
  } catch (error) {
    req.user = undefined;

    if (error instanceof TokenExpiredError) {
      // JWT is expired
      return responseHandler(res).error(401, "JWT expired");
    } else {
      // console.log({ error });
      return responseHandler(res).error(401, "Invalid JWT");
    }
  }

  next();
};

module.exports = protectedRoute;
