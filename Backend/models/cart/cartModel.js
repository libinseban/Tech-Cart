const mongoose=require ('mongoose')


const cardShema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:"true"
      },
      cardItem:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cartItems",
        require:true
      }],
      totalPrice: {
        type: Number,
        required: true,
        default:0
     
      },
      totalItem: {
        type: Number,
        required: true,
        default:0
     
      },
      totalDiscountPrice: {
        type: String,
        required: true,
       default:0
     
      },
      discount: {
        type: String,
        required: true,
        default:0
     
      },
     
     
   
});

const Card=mongoose.model("cart",cardShema)

module.exports=Card;