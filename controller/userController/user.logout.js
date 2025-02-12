const userLogout = (req, res) => {
    try {
        // Standardized cookie clear options
        const cookieClearOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Lax',
            path: '/',
            domain: process.env.NODE_ENV === "production" 
                ? ".tech-cart.onrender.com" 
                : "localhost"
        };

        // Clear specific cookies with consistent options
        res.clearCookie("userToken", cookieClearOptions);
        res.clearCookie("userId", cookieClearOptions);

        // Additional fallback for different environments
        res.clearCookie("userToken", { 
            ...cookieClearOptions, 
            domain: undefined 
        });
        res.clearCookie("userId", { 
            ...cookieClearOptions, 
            domain: undefined 
        });

        res.status(200).json({
            message: 'Logout successful',
            redirectUrl: "/login",
            success: true
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
