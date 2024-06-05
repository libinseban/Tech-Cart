const mongoose=require ('mongoose')


const orderShema=new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
            ref:"User"
       
      },
      orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orderitem'
    }],
      orderDate: {
        type: Date,
        required: true,
     
      },
     deliveryDate: {
        type: Date,

       
     
      },
      shippingAddress: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"address"
     
      },
      paymentDetails: {
       paymentMethod:{
        type:String,
       },
       transactionId:{
        type:String,

       },
       paymentId:{
        type:String,

       },
       paymentStatus:{
         type:String,
       }
     
      },
      
      totalPrice:{
        type:Number,
        required:true
      },
      totalDiscountPrice:{    
        type:Number,
        required:true
      },
      discounte:{
        type:Number,
        required:true
      },
      orderStatus:{
        type:String,
        required:true,
        default:'PENDING'
      },
      totalItem:{
        type:Number,
        required:true
      },
      createAd:{
        type:Date,
        required:Date.now,
      },



})

const order=mongoose.model("order",orderShema)

module.exports=order;