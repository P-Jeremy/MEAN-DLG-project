const jwt = require('jsonwebtoken');
const secretJwt = process.env.JWT_CRYPTEX


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretJwt);
    next();
  } catch (error) {
    res.status(401).json({message: "Auth failed..."})
  }
};
