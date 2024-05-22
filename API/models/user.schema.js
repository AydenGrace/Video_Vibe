const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    // email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    gender: { type: String, default: "other" },
    token: String,
    token_password: String,
    // liked_videos: [{
    //   type: ObjectId,
    //   ref: "Video",
    // }],
    // disliked_videos: [{
    //   type: ObjectId,
    //   ref: "Video",
    // }],
    liked_videos:[
      {
        _id: {type: ObjectId, ref: "Video"},
        likeOrDislike : {type: Boolean}
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
