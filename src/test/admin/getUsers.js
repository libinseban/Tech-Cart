const userModel = require('../../models/client/userModel');

const getUsers = async (req, res) => {
    try {
        const userDetails = await userModel.find();
        if (!userDetails || userDetails.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json({
            success: true,
            data: userDetails,
            message: "User details retrieved successfully"
        });

    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
            success: false
        });
    }
};

module.exports = getUsers;
