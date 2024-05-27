const {
  uploadVideo,
  getVideos,
  addLike,
  removeLike,
  addDislike,
  removeDislike,
  getVideosAndCreators,
} = require("../controllers/video-controller");

const router = require("express").Router();

router.post("/upload", uploadVideo);

router.get("/getAll", getVideos);

router.get("/getAllandCreators", getVideosAndCreators);

router.patch("/addLike", addLike);

router.patch("/removeLike", removeLike);

router.patch("/addDislike", addDislike);

router.patch("/removeDislike", removeDislike);

module.exports = router;
