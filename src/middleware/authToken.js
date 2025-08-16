const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = (req, res, next) => {
    try {
        const token = req.cookies.userToken
        console.log("Cookies received:", req.cookies); // <--- Important

        if (!token) {
            console.error("No token provided");
            return res.status(401).send("Access Denied. No token provided.");
        }

     
        const verified = jwt.verify(token, process.env.USER_SECRET_KEY);
        req.cookies.userId = verified._id; 

        next();
    } catch (error) {
        console.error("Invalid token", error);
        res.status(400).send("Invalid token.");
    }
};

module.exports = authToken;
