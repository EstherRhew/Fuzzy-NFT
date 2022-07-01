const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    wallet_address: {
      type: [String]
    },
    profile_image: {
      data: Buffer,
      contentType: String,
    }
  }, {timestamps: true}
);

module.exports = mongoose.model("User", userSchema)