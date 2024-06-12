const express = require("express");
const router = express.Router();

const userSignUpController = require("../../controller/userController/user.signup");
const userSignInController = require("../../controller/userController/user.signIn");
const authMiddleware=require("../../middleware/authToken")
const userDetailsController = require("../../controller/userController/userDetails");
const userLogout = require("../../controller/userController/user.logout");
const uploadImage = require("../uploadRoute/uploadImage");
const paymentController = require("../uploadRoute/paymentRouter");
const ordercontroller = require("../../controller/userController/userOrder");
const wishListRoute = require("../cart/wishListRoutes")
const cartRoutes=require("../cart/cartRoutes")
const orderRoutes = require("../service/orderRoutes")
const reviewRoutes = require('../service/reviewRoutes')
const ratingRoutes = require('../service/ratingRoutes')


router.use('/upload', uploadImage);
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController); 
router.use('/', cartRoutes)
router.use('/wish-list',wishListRoute )
router.use('/orders',orderRoutes);
router.use("/review",reviewRoutes);
router.use("/ratings",ratingRoutes);

router.post('/create-order',authMiddleware,ordercontroller.createOrder);
router.get('/order-history',authMiddleware,ordercontroller.OrderHistory);
router.get('/:id',authMiddleware,ordercontroller.findOrderById);
// router.use("/payment", authToken, paymentController);

router.get("/userdetails", authMiddleware, userDetailsController);
router.post("/logout", userLogout);
module.exports = router;
