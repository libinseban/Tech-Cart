const mongoose=require ('mongoose')


const productShema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
       
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
     
      },
      discountedPrice : {
        type: Number,
        required: true,
     
      },
      discountPercentage: {
        type: Number,
       required:true,
       
     
      },
      quantity: {
        type: Number,
        required: true,
     
      },
      brand:
        {
            type: String,
           
        }
    ,
     color:
        {
            type: String, 
        }
      , sizes: {
        type: [Number],
        required: true
      },
     
      imageUrl:
        {
            type: String,
        },
        ratings: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ratings",
           
          }],

          reviews: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"reviews"
           
          }],
          numratings: {
            type: Number,
           default:0,
         
          },
          category: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"category"
           
          },
          createAt:
          {
              type: Date,
              default:Date.now
          }
      ,  
})

const product=mongoose.model("product",productShema)

module.exports=product;