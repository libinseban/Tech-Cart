/** @format */

const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUpController = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const profilePic = req.body.profilePic || null;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please fill out all fields", error: true });
    }

    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return res.status(409).json({ message: "User already exists", error: true });
    }

    // Hash password asynchronously
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      email,
      password: hashedPassword, 
      firstName,
      lastName,
      profilePic:profilePic,
    });

    const savedUser = await user.save();

    const userToken = jwt.sign(
      { id: savedUser._id },
      process.env.USER_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.cookie("userId", savedUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(201).json({
      userId: savedUser._id,
      role: savedUser.role,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      profilePic: savedUser.profilePic,
      message: "User Created Successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error in user sign-up:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

module.exports = userSignUpController;
