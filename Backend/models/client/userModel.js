const mongoose=require ('mongoose')


const userShema=new mongoose.Schema({
  firstName: {
    type: String,
   required: true 
  },
      lastName: {
        type: String,
        required: true,
       
  },
  profilePic:{ type: String},
      hashPassword: {
        type: String,
       
     
      },
      email: {
        type: String,
        required: true,
     
      },
      role: {
        type: String,
        
        default:"CUSTOMER"
     
      },
      phone: {
        type: String,
        required:Number
      
      },
      address:[
        {
          type:mongoose.Schema.Types.ObjectId,
              ref:"address",
            required:true
        }
      ],
      paymentInformation:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"payment_information"
        }
      ],ratings:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:" rating"
    }
      ],
      reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:" review"
        }
      ],
     
      createdAt:{
        type:Date,
        default:Date.now()
      }
})
const User=mongoose.model("User",userShema)

module.exports=User;