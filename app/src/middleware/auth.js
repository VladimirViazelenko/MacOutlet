const jwt = require("jsonwebtoken");
const {createToken} = require("../controllers/userController");

const verifyToken = (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    
    const decoded = jwt.verify(token, createToken);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next()
};
module.exports = verifyToken;