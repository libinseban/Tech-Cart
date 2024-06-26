const Reviews = require("../../models/server/review");

const ProductService=require("../service/productService");


async function createReview(reqData,user){
  const product=await ProductService.findProductById(reqData.productId);

  const review=new Reviews({
    user:user._id,
    product:product._id,
    review:reqData.review,
    createAt:new Date(),
  })

  await product.save();
  return await review.save();

}
async function getAllReview(productId){
    const product=await ProductService.findProductById(reqData.productId);

    return await Reviews.find({product:productId}).populate("user");
}

module.exports={
    getAllReview,
    createReview
}