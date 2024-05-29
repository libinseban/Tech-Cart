const mongoose=require ('mongoose')


const cardItemShema=new mongoose.Schema({
    cart:{
        type:mongoose.Schema .Types.ObjectId,
        ref:"users",
        require:true
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        require:true
      },
      size: {
        type: Number,
        required: true,
     
      },
      quantity: {
        type: Number,
        required: true,
        default:1
     
      },
      price: {
        type: String,
        required: true,
       
     
      },
      discountedPrice: {
        type: String,
        required: true,
      
     
      },
      userId: {
        type:mongoose.Schema .Types.ObjectId,
       ref:'users',
       required:true
     
      },

     
     
   
});

const CardItem=mongoose.model("cardItem",cardItemShema)

module.exports=CardItem;