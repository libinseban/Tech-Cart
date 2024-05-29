const mongoose = require("mongoose")

const connectDb=async()=> {
    try {
        mongoose.connect(process.env.CONNECT_DB)
        .then(console.log("DB connected successfully"))
    } catch (error) {
        console.log(`Error in connecting db ${error}`)
    }
}

module.exports=connectDb