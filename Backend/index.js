const express = require("express")
const connectDb = require("./config/db")
const router = require("./routes/main/user")
const adminRouter=require("./routes/main/admin")
const cookieParser = require("cookie-parser")
const seller = require("./routes/main/seller")
const cors = require("cors")
require("dotenv").config()


const app = express()
app.use(express.static("public"));
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", router)
app.use("/api/admin", adminRouter)
app.use("api/seller",seller)
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials:true
    }
))
 ;
const PORT =  process.env.PORT||8000
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`sever running at ${PORT}`)
    }) 
})
