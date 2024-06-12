const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  wishList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"wishList",
    required:true
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
    type: Number,
    required: true,
   default:0
 
  },
  discount: {
    type: Number,
    required: true,
    default:0
 
  },
  user:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }],

  product:[ {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
  }],
 
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
