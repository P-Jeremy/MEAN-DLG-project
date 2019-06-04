const jwt = require("jsonwebtoken");
const secretJwt = process.env.JWT_CRYPTEX;

/** Allows to check if the user is signed in */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretJwt);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId, Previoushash:decodedToken.hash};
    next();
  } catch (error) {
    res.status(401).json({ message: "Vous n'êtes pas authentifié..." });
  }
};
