const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserbyId = async (req, res) => {
  const { _id } = req.body;
  const isUser = await User.findOne({ _id });
  if (isUser) res.json({ user: isUser });
  else res.status(400).json({ message: "Utilisateur introuvable" });
};

const createTokenLogin = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "30m" });
};

const signupUser = async (req, res) => {
  const { username, password, gender } = req.body;
  let avatar;
  switch (gender) {
    case "man":
      avatar = "https://api.dicebear.com/8.x/adventurer/svg?seed=Gizmo";
      break;
    case "woman":
      avatar = "https://api.dicebear.com/8.x/adventurer/svg?seed=George";
      break;
    default:
      avatar = "https://api.dicebear.com/8.x/adventurer/svg?seed=Charlie";
      break;
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      // const token = createTokenEmail(email);
      // console.log(token);
      // await sendConfirmationEmail(email, token);
      const salt = await bcrypt.genSalt(10);
      const hashPassWord = await bcrypt.hash(password, salt);
      const user = new User({
        username,
        gender,
        // email,
        password: hashPassWord,
        // token,
        avatar: avatar.toString(),
      });
      console.log(user);
      await user.save();
      res.status(200).json({
        message: "Account created.",
      });
    } else {
      res.status(400).json({
        message: "Username already taken.",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = createTokenLogin(user._id);
        res.status(200).json({ user, token });
      } else {
        res.status(400).json({ message: "Bad username or password." });
      }
    } else {
      res.status(400).json({ message: "Bad username or password." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  console.log(req.body);
  const { _id, username, avatar, gender, liked_videos } = req.body;
  await User.findOneAndUpdate(
    { _id },
    {
      username,
      avatar,
      gender,
      liked_videos,
    }
  );
  res.status(200).json({ message: "Utilisateur mit à jour." });
};

module.exports = {
  signupUser,
  loginUser,
  getUserbyId,
  updateUser,
};
