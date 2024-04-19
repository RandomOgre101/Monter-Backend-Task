const jwt = require("jsonwebtoken");
const { getBearerToken } = require("./getBearerToken");

const SECRET_KEY = process.env.SECRET_KEY;

const verifyJwtWithRequest = async (req) => {
  try {
    return await jwt.verify(getBearerToken(req), SECRET_KEY);
  } catch (error) {
    if (error instanceof TokenExpiredError) throw new Error("JWT Expired");

    throw new Error(error?.message || error);
  }
};

const verifyJwtWithBearer = async (bearer) => {
  // console.log(bearer);

  try {
    return await jwt.verify(bearer, SECRET_KEY);
  } catch (error) {
    if (error instanceof TokenExpiredError) throw new Error("JWT Expired");

    throw new Error(error?.message || error);
  }
};

module.exports = { verifyJwtWithRequest, verifyJwtWithBearer };
