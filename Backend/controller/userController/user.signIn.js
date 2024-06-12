const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genereteToken = require("../../middleware/generateToken");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.hashPassword);

    if (!checkPassword) {
      return res.status(400).send("Password is incorrect");
  }

  const token = genereteToken(user);
  res.cookie("token", token);
  console.log(token);
  res.status(200).send("Logged in!");
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignInController;
