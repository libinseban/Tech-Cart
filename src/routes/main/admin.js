
const express = require("express");
const adminRouter = express.Router();
const adminSignIn = require("../../controller/adminControllers/adminSignIn");
const adminSignUp = require("../../controller/adminControllers/adminSignUp");
const adminToken = require("../../middleware/adminVerification");
const adminLogout = require("../../controller/adminControllers/adminLogOut");
const OrderController = require("../../controller/adminControllers/adminOrder");
const productController = require("../../controller/elements/productControl");
const approveSellers = require("../image/sellerControl");
const productImage = require("../image/productImage");
const authToken = require("../../middleware/authToken");
const adminDetails = require("../../test/admin/adminDetails");
const editAdmin = require("../../test/admin/editAdminProfile");
const {
  getConfirmedOrders,
  getShippedOrders,
  getDeliveredOrders,
  getCancelledOrders,
} = require("../../helper/fetchOrders");

adminRouter.post("/signup", adminSignUp);
adminRouter.post("/signin", adminSignIn);
adminRouter.post("/logout", adminLogout);

adminRouter.use("/upload", adminToken, productImage);
adminRouter.get("/profile", adminToken, adminDetails);
adminRouter.put("/edit/profile", adminToken, editAdmin);

adminRouter.post(
  "/product",
  adminToken,
  productImage,
  productController.createProduct
);
adminRouter.get(
  "/products/:productId",
  adminToken,
  productController.findProductById
);
adminRouter.get("/products", adminToken, productController.getAllProducts);
adminRouter.post(
  "/creates",
  adminToken,
  productController.createMultipleProducts
);
adminRouter.delete(
  "/products/:productId",
  adminToken,
  productController.deleteProduct
);
adminRouter.put(
  "/products/:productId",
  adminToken,
  productImage,
  productController.updateProduct
);

adminRouter.get("/getOrders", adminToken, OrderController.getAllOrders);
adminRouter.put(
  "/confirmOrder/:orderId",
  adminToken,
  OrderController.confirmOrders
);
adminRouter.get("/confirmed/orders", adminToken, getConfirmedOrders);
adminRouter.put(
  "/shippingOrders/:orderId",
  adminToken,
  OrderController.shippingOrders
);
adminRouter.get("/shipped/orders", adminToken, getShippedOrders)

adminRouter.put("/deliver/:orderId", adminToken, OrderController.deliveryOrders);
adminRouter.get("/delivered/orders",adminToken,getDeliveredOrders)
adminRouter.put(
  "/cancelOrder/:orderId",
  adminToken,
  OrderController.cancelledOrders
);

adminRouter.get("/cancelled/orders" , adminToken, getCancelledOrders)

adminRouter.put(
  "/deleteOrder/:orderId",
  adminToken,
  OrderController.deleteOrders
);
adminRouter.use("/approveSellers", authToken, approveSellers);

module.exports = adminRouter;
