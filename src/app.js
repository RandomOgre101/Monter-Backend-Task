require("dotenv").config();

const express = require("express");
const { responseHandler } = require("./utils/responseHandler");

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use((req, res, next) => {
  responseHandler(res).error(404, "Route not found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
