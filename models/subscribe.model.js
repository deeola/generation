const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SubscribeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscribe = mongoose.model("subscribe", SubscribeSchema);

module.exports = Subscribe;
