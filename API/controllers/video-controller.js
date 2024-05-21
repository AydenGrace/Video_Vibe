const Video = require("../models/video.schema");

const uploadVideo = async (req, res) => {
  console.log(req.body);
  const { title, url, creator } = req.body;
  const isAlreadyExist = await Video.findOne({ title });
  console.log(isAlreadyExist);
  if (isAlreadyExist) {
    res.status(400).json({ message: "Video already exist." });
    return;
  }
  const newVideo = new Video({
    title,
    url,
    creator,
  });
  await newVideo.save();
  res.status(200).json({
    video: newVideo,
    message: "Video uploaded",
  });
};

const getVideos = async (req, res) => {
  const Videos = await Video.find();
  res.json(Videos);
};

const addLike = async (req, res) => {
  const { title } = req.body;
  const vid = await Video.findOne({ title });
  if (!vid) {
    res.status(400).json({ message: "Vidéo non trouvée." });
    return;
  }
  await Video.findOneAndUpdate({ title }, { likes: vid.likes + 1 });
  res.json({ message: "Like ajouté." });
};

const removeLike = async (req, res) => {
  const { title } = req.body;
  const vid = await Video.findOne({ title });
  if (!vid) {
    res.status(400).json({ message: "Vidéo non trouvée." });
    return;
  }
  await Video.findOneAndUpdate({ title }, { likes: vid.likes - 1 });
  res.json({ message: "Like ajouté." });
};

const addDislike = async (req, res) => {
  const { title } = req.body;
  const vid = await Video.findOne({ title });
  if (!vid) {
    res.status(400).json({ message: "Vidéo non trouvée." });
    return;
  }
  await Video.findOneAndUpdate({ title }, { dislikes: vid.dislikes + 1 });
  res.json({ message: "Dislike ajouté." });
};

const removeDislike = async (req, res) => {
  const { title } = req.body;
  const vid = await Video.findOne({ title });
  if (!vid) {
    res.status(400).json({ message: "Vidéo non trouvée." });
    return;
  }
  await Video.findOneAndUpdate({ title }, { dislikes: vid.dislikes - 1 });
  res.json({ message: "Dislike ajouté." });
};

module.exports = {
  uploadVideo,
  getVideos,
  addDislike,
  addLike,
  removeDislike,
  removeLike,
};
