const {
  signupUser,
  loginUser,
  getUserbyId,
  updateUser,
} = require("../controllers/user-controller");

const router = require("express").Router();

router.post("/signup", signupUser);

router.post("/signin", loginUser);

router.post("/findId", getUserbyId);

router.patch("/updateUser", updateUser);

module.exports = router;
