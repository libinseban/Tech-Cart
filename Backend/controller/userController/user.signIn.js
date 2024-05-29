
const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "1d",
      });

      // Send token in response
      res.cookie("access_token", token, { httpOnly: true, secure: true }).json({
        success: "Login Successful",
        token: token,
      });
    } else {
      throw new Error("Incorrect password");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignInController;
