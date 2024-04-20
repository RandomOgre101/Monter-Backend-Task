const mongoose = require("mongoose");

/* Rishikeshav Ravichandran */

const userDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserDetail = mongoose.model("UserDetail", userDetailSchema);
module.exports = UserDetail;
