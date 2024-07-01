const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: String,
  },
  address: {
    type: String,
  },
  occupation: {
    type: String,
  },
  about_me: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
