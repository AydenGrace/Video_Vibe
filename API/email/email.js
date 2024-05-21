const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation d'inscription",
    html: `<p>Merci de vous êtes inscrit ! Cliquez sur le lien suivant pour confirmer l'inscription : <a href="http://localhost:5000/api/users/verifyMail/${token}">Confirmer l'inscription</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendValidationAccount = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Inscription validée",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour vous connecter : <a href="http://localhost:5173/login">Page de connexion</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendInvalidEmailToken = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Problème lors de la validation",
    html: `<p>Le temps a expiré ! Cliquez sur le lien suivant pour vous inscrire à nouveau : <a href="http://localhost:5173/register">Page d'inscription'</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPassword = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Demande de changement de mot de passe",
    html: `<p>Nous avons bien reçu votre demande de modification de mot de passe. Si cette demande n'est pas de votre intitiaive, merci d'ignorer le lien suivant : <a href="http://localhost:5173/change_password/${token}">Modifier mon mot de passe</a>.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordChanged = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Modification de mot de passe enregistrée",
    html: `<p>Nous vous informons que votre changement de mot de passe a bien été effectué. Si ce changement n'est pas de votre initiative, merci de contacter notre support.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendResetPassword,
  sendPasswordChanged,
};
