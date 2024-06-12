const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')

const {updateWishList, removeWishList}=require('../../controller/orderController/wishListController');

routes.put('/:id',authenticate,updateWishList);
routes.delete('/:id',authenticate,removeWishList);


module.exports=routes;