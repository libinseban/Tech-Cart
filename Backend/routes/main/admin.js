const express = require("express")


const control=require("./control")
const adminRouter = express.Router()
const adminSignUp = require("../../controller/adminController/adminSignUp")
const adminToken=require("../../middleware/adminVerification")
const adminLogout = require("../../controller/adminController/adminLogOut")
const adminController = require("../../controller/adminController/adminDetails")
const adminSignIn = require("../../controller/adminController/adminSignIn")

adminRouter.post("/signup",adminSignUp)
adminRouter.post("/signin", adminSignIn)
adminRouter.post("/logout", adminLogout)
adminRouter.post("/control",adminToken,control)
adminRouter.post("/admin-details",adminToken,adminController)
module.exports=adminRouter