const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ userId: user._id.toString() }, process.env.TOKEN_SECRET_KEY, { expiresIn: "2d" });
};

module.exports = generateToken;
