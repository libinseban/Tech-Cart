const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')

const {findUserCartController, addItemCartController}=require('../../controller/orderController/cartControl')



routes.get('/', authenticate, findUserCartController);
routes.put('/add', authenticate, addItemCartController);

module.exports=routes;
