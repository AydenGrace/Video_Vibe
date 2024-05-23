const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    creator: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);
