
const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUpController = async (req, res) => {
    try {
        const { email, password, name, profilePic } = req.body;
        const findUser = await userModel.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Please fill out all fields" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = new userModel({
            email,
            password: hashPassword,
            name,
            profilePic,
            role: "GENERAL"
        });

        const savedUser = await user.save();

        // Generate token
        const token = jwt.sign({ userId: savedUser._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

        // Set token in cookies
        res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000), // 1 hour expiry
            secure: false,
            
        });
console.log(token)
        res.status(200).json({
            id: savedUser._id,
            data: savedUser,
            success: true,
            error: false,
            message: "User Created Successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
}

module.exports = userSignUpController;
