const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')

const cartItemController=require('../../controller/orderController/cartItemConroller');

routes.put('./:id',authenticate,cartItemController.updateCartitem);
routes.delete('/:id',authenticate,cartItemController.removeCartitem);


module.exports=routes;