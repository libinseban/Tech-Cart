const mongoose=require ('mongoose')


const orderItemShema=new mongoose.Schema({
  
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        require:true
      },
      size: {
        type: String,
      
     
      },
      quantity: {
        type: Number,
        required: true,
      
     
      },
      price: {
        type: Number,
        required: true,
       
     
      },
      discountedPrice: {
        type: Number,
       required:true,
      
     
      },
      user: {
        type:mongoose.Schema .Types.ObjectId,
       ref:'User',
       required:true
     
      },
      
})

const OrderItem=mongoose.model("Orderitem",orderItemShema)

module.exports=OrderItem;