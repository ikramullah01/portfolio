const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const socialSchema = new Schema({
  plateform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Social", socialSchema);
