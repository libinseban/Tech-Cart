const User = require("../../models/client/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Please provide a valid email." });
    }
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).send({ message: "User not found, please register." });
    }

    const userToken = jwt.sign({ email }, process.env.USER_SECRET_KEY, { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
      }
    });

    const receiver = {
      from:`"SebAttY Support" <no-reply@seb-atty.com>`,
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to generate a new password: ${process.env.FRONTEND_URL}/reset-password/${userToken}`
    };

    await transporter.sendMail(receiver);
    res.status(200).send({ message: "Password reset link sent successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { userToken } = req.params;
  
    const decoded = jwt.verify(userToken, process.env.USER_SECRET_KEY);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).send({ message: "User not found." });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    await user.save();

    res.status(200).send({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};




module.exports = { forgetPassword, resetPassword };
