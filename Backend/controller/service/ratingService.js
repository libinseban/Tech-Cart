const Rating=require ('../../models/server/ratingModel.js')
const productServices=require('./productService.js');
const { CreateCart } = require('./cartService');


async function createRating(req,res){
    const product=await productServices.findProductById(req.productId);

    const rating =new Rating({
        product:product._id,
        user:user._id,
        rating:req.rating,
        CreateAt:new Date()
    })
    return await rating.save();

}

async function getProductRating(product){
    return await Rating.find({product:productId});
}
module.exports={
    createRating,
    getProductRating
}