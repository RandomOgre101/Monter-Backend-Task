require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const { responseHandler } = require("./utils/responseHandler");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  responseHandler(res).error(404, "Route not found");
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
