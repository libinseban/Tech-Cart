const adminToken = (req, res, next) => {
    try {
        const token = req.cookie.token; 
        console.log("token", token);

        if (!token) {
            return res.status(403).json({
                message: 'No token provided',
                data: [],
                success: false,
                error: true
            });
        }

        if (token !== "expectedTokenValue") {
            return res.status(401).json({
                message: 'Invalid token',
                data: [],
                success: false,
                error: true
            });
        }

    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            data: [],
            success: false,
            error: true
        });
    }

    next();
};

module.exports = adminToken;
