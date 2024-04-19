const express = require("express");

const protectedRoute = require("../middleware/protected");
const {
  addUserDetail,
  updateUserDetail,
  getUserDetail,
} = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/my", protectedRoute, getUserDetail);

userRouter.post("/my", protectedRoute, addUserDetail);

userRouter.put("/my", protectedRoute, updateUserDetail);

module.exports = userRouter;
