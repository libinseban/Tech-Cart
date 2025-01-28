const User = require("../../models/client/userModel");

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

        if (!user.profilePic) {
            return res.status(404).json({ message: "Profile picture not found" });
        }

        const profilePicPath = req.file.path;
        user.profilePic = profilePicPath;
        await user.save();

        return res.status(200).json({
            profilePic: profilePicPath,
           
         });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { profilePicture };