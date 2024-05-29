async function authToken(req,res,next) {
    try {
        const token = req.cookie.token || req.header
     console.log("token", token)   
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data:[],
            success: false,
            error:true
        })
    }
    next()
}

module.exports=authToken