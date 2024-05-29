const express = require("express");
const router = express.Router();

const userSignUpController = require("../../controller/userController/user.signup");
const userSignInController = require("../../controller/userController/user.signIn");
const authToken = require("../../middleware/authToken");
const userDetailsController = require("../../controller/userController/userDetails");
const userLogout = require("../../controller/userController/user.logout");
const uploadImage = require("../uploadRoute/uploadImage");
const paymentController = require("../uploadRoute/paymentRouter");
const userOrder = require("../../controller/userController/userOrder");

router.use("/upload", uploadImage);
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.post("/order", authToken, userOrder); 

// router.use("/payment", authToken, paymentController);

router.get("/userdetails", authToken, userDetailsController);
router.post("/logout", userLogout);
module.exports = router;
