const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  verifyOtp,
} = require("../controllers/auth.controller");
const protectedRoute = require("../middleware/protected");

const authRouter = express.Router();

authRouter.get("/verify", protectedRoute, verifyUser);
authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.post("/verify-otp", protectedRoute, verifyOtp);

module.exports = authRouter;
