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
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      email,
      hashPassword, 
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

 
        res.cookie("userId", user._id.toString(), {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 5 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("userToken", userToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 5 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        
    return res.status(201).json({
      userId: savedUser._id,
      role: savedUser.role,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      profilePic: savedUser.profilePic,
      hashPassword: savedUser.hashPassword,
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
