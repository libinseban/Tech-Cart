const bcrypt = require("bcryptjs");
const User = require("../../models/client/userModel");

const editUserProfile = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized User", error: true });
        }

        const { email, firstName, lastName, password, profilePic } = req.body;

        // Ensure required fields are present
        if (!email || !firstName || !lastName) {
            return res.status(400).json({ message: "Please fill out all fields", error: true });
        }

        // Find the user by ID
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found", error: true });
        }

        // Check if email is being changed and ensure it's unique
        if (email !== findUser.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already in use", error: true });
            }
        }

        const updates = { email, firstName, lastName };

        if (password) {
            if (!findUser.hashPassword) {
                return res.status(400).json({ message: "No existing password found. Please set a new password.", error: true });
            }

            const isPasswordMatch = await bcrypt.compare(password, findUser.hashPassword);
            if (isPasswordMatch) {
                return res.status(409).json({ message: "New password must be different from the old one", error: true });
            }

            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);



            // Handle profile picture update
            if (req.file) {
                updates.profilePic = req.file.path;
            } else if (profilePic) {
                updates.profilePic = profilePic;
            }

            // Update user
            const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });

            return res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser,
                success: true,
                error: false
            });

        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        return res.status(500).json({ message: "Internal server error", error: true });
    }
};

module.exports = editUserProfile;
