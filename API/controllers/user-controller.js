const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendResetPassword,
  sendPasswordChanged,
} = require("../email/email");

const getUserbyId = async (req, res) => {
  const { _id } = req.body;
  const isUser = await User.findOne({ _id });
  if (isUser) res.json({ user: isUser });
  else res.status(400).json({ message: "Utilisateur introuvable" });
};

const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn: "60s" });
};

const createTokenResetPassword = (email) => {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn: "2m" });
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
        message: "Enregistrement effectué",
      });
    } else {
      res.status(400).json({
        message: "Nom d'utilisateur déjà existant",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyMail = async (req, res) => {
  const token = req.params.token;

  const isTokenNull = await User.findOne({ token: token });
  const decoded = jwt.verify(token, process.env.SECRET, {
    ignoreExpiration: true,
  });
  console.log(decoded.exp * 1000);
  console.log(new Date().getTime());
  try {
    if (!isTokenNull) {
      res.status(400).json({ message: "Token déja validé" });
      return;
    }
    if (decoded.exp * 1000 > new Date().getTime()) {
      await User.findOneAndUpdate({ email: decoded.email }, { token: null });
      await sendValidationAccount(decoded.email);
      res.json({ message: "Inscription confirmée avec succès" });
    } else {
      await User.findOneAndDelete({ email: decoded.email });
      await sendInvalidEmailToken(decoded.email);
      res.status(400).json({ message: "Token invalide ou expiré" });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      // if (!user.token) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = createTokenLogin(user._id);
        res.status(200).json({ user, token });
      } else {
        res.status(400).json({ message: "Mauvais Nom et/ou Password" });
      }
      // } else {
      //   res.status(400).json({ message: "Email non validé" });
      // }
    } else {
      res.status(400).json({ message: "Mauvais Email et/ou Password" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const forgotPwd = async (req, res) => {
  const { username } = req.body;
  try {
    const token = createTokenResetPassword(email);
    const user = await User.findOneAndUpdate(
      { username },
      { token_password: token }
    );
    if (user) {
      // await sendResetPassword(username, token.replaceAll(".", ","));
      res.json({ message: "Fonctionnalité en cours de refonte." });
    } else {
      res.status(400).json({ message: "Account not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changePwd = async (req, res) => {
  const { password, token } = req.body;
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashPassWord = await bcrypt.hash(password, salt);

  const isTokenNull = await User.findOne({ token_password: token });
  const decoded = jwt.verify(token, process.env.SECRET, {
    ignoreExpiration: true,
  });
  console.log(decoded.exp * 1000);
  console.log(new Date().getTime());
  try {
    if (!isTokenNull) {
      res.status(400).json({ message: "Demande non trouvée." });
      return;
    }
    if (decoded.exp * 1000 > new Date().getTime()) {
      await User.findOneAndUpdate(
        { token_password: token },
        { token_password: null, password: hashPassWord }
      );
      await sendPasswordChanged(decoded.email);
      res.json({ message: "Modification enregistrée avec succès" });
    } else {
      await User.findOneAndUpdate(
        { token_password: token },
        { token_password: null }
      );
      res.status(400).json({ message: "Demande expirée." });
    }
  } catch (error) {
    console.log(error);
  }
};

const changePwdAsConnected = async (req, res) => {
  const { _id, oldPassword, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassWord = await bcrypt.hash(password, salt);

  const isUserFind = await User.findOne({ _id });
  console.log(isUserFind);
  if (isUserFind) {
    const match = await bcrypt.compare(oldPassword, isUserFind.password);
    if (match) {
      await User.findOneAndUpdate({ _id }, { password: hashPassWord });
      res.status(200).json({ message: "Mot de passe modifié." });
    } else {
      res.status(400).json({ message: "Ancien mot de passe incorrect." });
    }
  } else {
    res.status(400).json({ message: "Compte inconnu." });
  }
};

const updateUser = async (req,res) => {
  console.log(req.body);
  const {_id, username, avatar, gender, liked_videos} = req.body;
  await User.findOneAndUpdate({_id},{
    username, avatar, gender, liked_videos
  })
  res.status(200).json({message: 'Utilisateur mit à jour.'})
}

module.exports = {
  signupUser,
  verifyMail,
  loginUser,
  forgotPwd,
  changePwd,
  changePwdAsConnected,
  getUserbyId,
  updateUser
};
