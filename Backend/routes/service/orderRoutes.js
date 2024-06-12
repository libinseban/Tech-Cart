const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')

const ordercontroller=require('../../controller/orderController/orderController')

routes.post('/',authenticate,ordercontroller.createOrder);
routes.get('/user',authenticate,ordercontroller.OrderHistory);
routes.get('/:id',authenticate,ordercontroller.findOrderById);


module.exports = routes;

