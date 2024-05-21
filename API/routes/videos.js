const {
  uploadVideo,
  getVideos,
  addLike,
  removeLike,
  addDislike,
  removeDislike,
} = require("../controllers/video-controller");

const router = require("express").Router();

router.post("/upload", uploadVideo);

router.get("/getAll", getVideos);

router.get("/addLike", addLike);

router.get("/removeLike", removeLike);

router.get("/addDislike", addDislike);

router.get("/removeDislike", removeDislike);

module.exports = router;
