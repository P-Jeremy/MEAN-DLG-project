const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helpers/email/sendMail");
const tokenSignUp = require("../helpers/email/templates/sendTokenSignUp");
const newPassword = require('../helpers/email/templates/forgotPassword');
const secretJwt = process.env.JWT_CRYPTEX;
const validApiKey = process.env.API_KEY;
const apiDomain = process.env.API_DOMAIN;
const clientDomain = process.env.CLIENT_DOMAIN;

const User = require("../models/user");

exports.signUp = async (req, res, next) => {
  const { key } = req.query;
  const { email, password, passwordBis } = req.body;
  if (key != validApiKey) {
    return res.status(403).json({
      message: "La clé n'est pas valide..."
    });
  }
  if (password !== passwordBis) {
    return res.status(403).json({
      message: "Veuillez entrer deux mots de passe identiques"
    });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hash
    });
    const result = await user.save();
    const tokenInfo = {
      id: result._id,
      expiresIn: "1d"
    };
    const token = jwt.sign(tokenInfo, secretJwt);

    sendEmail(tokenSignUp(email, `${apiDomain}auth/confirmation/${token}`));
    return res.status(201).json({
      message: "Veuillez verifier votre boite mail",
      result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Inscription impossible..."
    });
  }
};

exports.confirmation = (req, res, next) => {
  const { token } = req.params;
  const decode = jwt.verify(token, jwtSecret);
  try {
    const { id } = decode;
    User.updateOne({ _id: id, isActive: true });
    res.redirect(`${clientDomain}/login`);
  } catch {
    res.redirect(`${clientDomain}`);
    res.status(403).json({
      message: "Activation impossible"
    });
  }
};

exports.newPasswordAsk = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await User.findOne({email: email});
    if (result.isActive === false) {
      return res.status(403).json({
        message: "Cet utilisateur ne possède pas de compte actif..."
      });
    }

    const tokenInfo = {
      userId: result._id,
      email,
      expiresIn: "1h"
    };
    const token = jwt.sign(tokenInfo, secretJwt);
    sendEmail(newPassword(email, `${clientDomain}/newpassword/${token}`));
    return res.status(200).json({
      message: "Email envoyé"
    });
  } catch (error) {
    return res.status(403).json({
      message: "L' utilisateur n'existe pas"
    });
  }
};

exports.newPasswordSet = async (req, res, next) => {
  const { password, passwordBis } = req.body;
  const { email } = req.userData;

  if (password !== passwordBis) {
    return res.status(403).json({
      message: "Les mots de passe ne sont pas identiques..."
    });
  }
  try {
    const result = await User.findOne({ email: email});
    if (result.email === email && result.isActive === true) {
      const hash = await bcrypt.hash(password, 10);
      await User.updateOne({_id: result._id, password: hash })
    }
    return res.status(200).json({
      message: "Nouveau mot de passe crée"
    });
  } catch (error) {
    return res.status(400);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.body.email });
    const allowedUser = await bcrypt.compare(
      req.body.password,
      fetchedUser.password
    );

    if (allowedUser) {
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        secretJwt,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    } else {
      return res.status(403).json({
        message: "Authentification impossible... Mot de passe incorrect"
      });
    }
  } catch {
    return res.status(403).json({
      message: "Authentification impossible... L' utilisateur n'existe pas"
    });
  }
};
