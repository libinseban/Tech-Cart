const User = require("../../models/client/userModel");
const path = require("path")
const profilePicture = async (req, res) => {
    const userId = req.cookies.userId; 

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        if (!user.profilePic||user) {
            return res.status(404).json({ message: "Profile picture not found",  user });
        }

       

        return res.status(200).json({
           user
           
         });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { profilePicture };