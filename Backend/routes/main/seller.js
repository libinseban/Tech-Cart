const express = require('express')
const seller = express.Router()
const sellerSignIn = require('../../controller/sellerController/sellerSignin')
const sellerSignUp = require('../../controller/sellerController/sellerSignup')
const uploadImage = require("../uploadRoute/uploadImage");
const authToken = require("../../middleware/authToken");
const sellerAddProduct=require("../service/sellerRoute")

seller.use("/signup", sellerSignUp)
seller.use("/signin", sellerSignIn)
seller.use('/:id/addproduct', authToken, uploadImage);
seller.use('/',authToken, sellerAddProduct);
module.exports = seller;
