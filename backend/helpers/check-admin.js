const jwt = require("jsonwebtoken");
const secretJwt = process.env.JWT_CRYPTEX;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretJwt);
    req.userData = { isAdmin: decodedToken.isAdmin };
    next();
  } catch (error) {
    res.status(401).json({ message: "Vous n'êtes pas authorisé..." });
  }
};
