const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db")
const router = require("./routes/main/user")
const adminRouter=require("./routes/main/admin")
const cookieParser=require("cookie-parser")
require("dotenv").config()


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", router)
app.use("/api/admin", adminRouter)
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
