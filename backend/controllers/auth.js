const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretJwt = process.env.JWT_CRYPTEX;

const User = require("../models/user");

exports.signUp = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    const result = await user.save();

    return res.status(201).json({
      message: "Utilisateur crée avec succès !",
      result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Inscription impossible..."
    });
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
