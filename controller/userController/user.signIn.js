/** @format */

const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/client/adminModel");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password", success: false });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (isPasswordMatch) {
        const tokenData = {
          _id: admin._id,
          email: admin.email,
          role: "admin",
        };
        const adminToken = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
          expiresIn: "1d",
        });

        res.cookie("access_token", adminToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        return res.json({
          success: true,
          message: "Login Successful",
          role: "admin",
          redirectUrl: "/admin/dashboard",
          access_token: adminToken,
        });
      }
    }

    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.hashPassword);
      if (isPasswordMatch) {
        const tokenData = {
          _id: user._id,
          email: user.email,
          role: "user",
        };
        const userToken = jwt.sign(tokenData, process.env.USER_SECRET_KEY, {
          expiresIn: "5d",
        });

        res.cookie("userId", user._id.toString(), {
          httpOnly: false, 
          secure: process.env.NODE_ENV === "production", 
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 5 * 24 * 60 * 60 * 1000, 
          path: '/'
        });
        
        res.cookie("userToken", userToken, {
          httpOnly: false, 
          secure: process.env.NODE_ENV === "production",  
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 5 * 24 * 60 * 60 * 1000, 
          path: '/'
        });

        return res.status(200).json({
          success: true,
          token: userToken,
          user: {
            userId: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
          },
        });
      }
    }

    return res.status(400).json({
      message: "Email or password is incorrect",
      success: false,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({
      message: "An unexpected error occurred",
      success: false,
    });
  }
}

module.exports = userSignInController;
