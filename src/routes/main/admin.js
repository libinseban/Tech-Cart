
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
  getOrdersByStatus
} = require("../../helper/fetchOrders");
const getUsers = require("../../test/admin/getUsers");

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
adminRouter.get('/users', adminToken, getUsers)

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
adminRouter.get('/:status/orders', adminToken, (req, res) => {
  OrderController.getOrdersByStatus(req, res, req.params.status);
});

adminRouter.put(
  "/confirmOrder/:orderId",
  adminToken,
  OrderController.confirmOrders
);
adminRouter.put(
  "/shippingOrders/:orderId",
  adminToken,
  OrderController.shippingOrders
);

adminRouter.put("/deliver/:orderId", adminToken, OrderController.deliveryOrders);
adminRouter.put(
  "/cancelOrder/:orderId",
  adminToken,
  OrderController.cancelledOrders
);


adminRouter.put(
  "/deleteOrder/:orderId",
  adminToken,
  OrderController.deleteOrders
);
adminRouter.use("/approveSellers", authToken, approveSellers);

module.exports = adminRouter;
