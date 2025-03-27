
const express = require("express");
const userRouter = express.Router();
const userSignUpController = require("../../controller/userController/user.signup");
const userSignInController = require("../../controller/userController/user.signIn");
const userLogout = require("../../controller/userController/user.logout");
const uploadImage = require("../other/uploadImage");
const authenticate = require("../../middleware/authToken");
const {
  newOrder,
  OrderHistory,
  findOrderById,
} = require("../../helper/orderFunctions/orderController");
const {
  moveProductToCart,
  removeWishList,
  updateWishList,
  getWishlist,
  getWishlistProduct,
} = require("../../helper/productHelper/wishListController");
const {
  findUserCartController,
  removeItemCartController,
  addItemCartController,
  findUserCartById,
} = require("../../helper/productHelper/cartControl");
const {
  forgetPassword,
  resetPassword,
} = require("../../controller/userController/forgetPassword");
const ratingController = require("../../helper/productHelper/ratingController");
const reviewController = require("../../helper/productHelper/reviewController");
const { getAllProducts } = require("../../helper/productHelper/productControl");
const { cancelOrder } = require("../../service/orderSevice");
const {
  profilePicture,
} = require("../../test/users/userDetails");
const {
  submitContact,
} = require("../../helper/orderFunctions/contactController");
const editUserProfile = require("../../test/users/editUserProfile");

userRouter.post("/signup", uploadImage, userSignUpController);
userRouter.post("/signin", userSignInController);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password/:userToken", resetPassword);
userRouter.post("/logout", userLogout);
userRouter.get("/profile", authenticate, profilePicture);
userRouter.put("/edit/profile", authenticate,uploadImage, editUserProfile)

userRouter.get("/products", getAllProducts);
userRouter.post("/contact", submitContact);
userRouter.get("/test-cookie", (req, res) => {
  res.json({ userToken: req.cookies.userToken, userId: req.cookies.userId });
});

userRouter.get("/wish-list", authenticate, getWishlist);
userRouter.get("/wish-list/get/:productId", authenticate, getWishlistProduct);
userRouter.put("/wish-list/:productId", authenticate, updateWishList);
userRouter.post(
  "/wish-list/moveToCart/:productId",
  authenticate,
  moveProductToCart
);
userRouter.delete("/wish-list/delete/:productId", authenticate, removeWishList);

userRouter.get("/cart", authenticate, findUserCartController);
userRouter.get("/cart/:productId", authenticate, findUserCartById);
userRouter.put("/cart/add", authenticate, addItemCartController);

userRouter.delete(
  "/cart/remove/:productId",
  authenticate,
  removeItemCartController
);

userRouter.put("/order", authenticate, newOrder);
userRouter.get("/order/history", authenticate, OrderHistory);
userRouter.get("/order/:productId", authenticate, findOrderById);
userRouter.delete("/removeOrder", authenticate, cancelOrder);
userRouter.post("/createRating", authenticate, ratingController.createRating);
userRouter.get(
  "/getAllRating/:productId",
  authenticate,
  ratingController.getAllRating
);
userRouter.post(
  "/createReview/:productId",
  authenticate,
  reviewController.createReview
);
userRouter.get(
  "/getReview/:productId",
  authenticate,
  reviewController.getAllReview
);
userRouter.delete(
  "/deleteReview/:reviewId",
  authenticate,
  reviewController.deleteReview
);


module.exports = userRouter;
