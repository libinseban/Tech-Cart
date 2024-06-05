const express = require("express")
const control=require("./control")
const adminRouter = express.Router()
const adminSignIn = require("../../controller/adminController/adminSignIn")
const adminSignUp = require("../../controller/adminController/adminSignUp")
const adminToken=require("../../middleware/adminVerification")
const adminLogout = require("../../controller/adminController/adminLogOut")
const OrderController = require("../../controller/adminController/adminOrder")
const productController=require('../../controller/orderController/productControl');


adminRouter.post("/signup",adminSignUp)
adminRouter.post("/signin", adminSignIn)
adminRouter.post("/control", adminToken, control)
adminRouter.post('/add-product',productController.createProduct);
adminRouter.post('/creates',adminToken,productController.createMultiProduct);
adminRouter.delete('/:id',productController.deleteProduct);
adminRouter.put('/:id',adminToken,productController.updateProduct);
adminRouter.get('/', adminToken, OrderController.getAllOrders);
adminRouter.put("/:orderId/confired",adminToken,OrderController.conformorder);
adminRouter.put("/:orderId/ship",adminToken,OrderController.shipporder);
adminRouter.put("/:orderId/deliver",adminToken,OrderController.deliverorder);
adminRouter.put("/:orderId/cancel",adminToken,OrderController.cancelledorder);
adminRouter.put("/:orderId/delete", adminToken, OrderController.deleteorder);
adminRouter.post("/logout", adminLogout)
module.exports = adminRouter


