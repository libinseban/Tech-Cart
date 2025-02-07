const userLogout = (req, res) => {
    try {
        res.clearCookie("userToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",        });
        res.clearCookie("userId", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",        });

        res.status(200).json({
            message: 'Logout successful',
            redirectUrl: "/login" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "An error occurred during logout",
            success: false,
        });
    }
};

module.exports = userLogout;
