const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    console.error("No token provided");
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = { userId: decoded.userId.toString() };
    next();
  } catch (error) {
    console.error("Invalid token", error);
    res.status(400).send("Invalid token.");
  }
};

module.exports = authToken;
