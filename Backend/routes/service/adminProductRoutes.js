const express=require('express');
const routes=express.Router();
const productController=require('../../controller/orderController/productControl');

const authenticate=require('../../middleware/adminVerification');



routes.post('/',productController.createProduct);
routes.post('/creates',authenticate,productController.createMultiProduct);
routes.delete('/:id',productController.deleteProduct);
routes.put('/:id',authenticate,productController.updateProduct);

module.exports=routes;