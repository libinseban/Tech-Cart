const adminToken = (req, res, next) => {
    try {
        const token = req.cookie.token
        console.log("token", token);   
    } catch (err) {
        res.send(400).json({
            message: err.message || err,
            data:[],
            success: false,
            error:true
        });
    }
    next();
};
module.exports=adminToken