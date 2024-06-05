const express = require("express");
const router = express.Router();

const userSignUpController = require("../../controller/userController/user.signup");
const userSignInController = require("../../controller/userController/user.signIn");
const authMiddleware=require("../../middleware/authToken")
const userDetailsController = require("../../controller/userController/userDetails");
const userLogout = require("../../controller/userController/user.logout");
const uploadImage = require("../uploadRoute/uploadImage");
const paymentController = require("../uploadRoute/paymentRouter");
const userOrder = require("../../controller/userController/userOrder");
const cartItemRoutes = require("../cart/cartItemRoutes")
const cartRoutes=require("../cart/cartRoutes")
const orderRoutes = require("../service/orderRoutes")
const reviewRoutes = require('../service/reviewRoutes')
const ratingRoutes = require('../service/ratingRoutes')

router.use('/upload', uploadImage);
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.post("/:id/order", authMiddleware, userOrder); 
router.use('/:id/cartitems', cartItemRoutes)
router.use('/:id/carts', cartRoutes)
router.use('/:id/orders',orderRoutes);
router.use("/:id/review",reviewRoutes);
router.use("/:id/ratings",ratingRoutes);

// router.use("/payment", authToken, paymentController);

router.get("/userdetails", authMiddleware, userDetailsController);
router.post("/logout", userLogout);
module.exports = router;
