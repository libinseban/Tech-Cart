const mongoose=require ('mongoose')


const userShema=new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
      lastName: {
        type: String,
        required: true,
        trim: true
       
  },
  profilePic: [{ 
    type: String,
  }],
  
      hashPassword: {
        type: String,
   
     
      },
      email: {
        type: String,
        required: true,
        unique: true 
      },
      role: {
        type: String,
        enum: ['ADMIN', 'SELLER', 'USER'], 
        default: 'USER'
      },
      address:
              {
                type:mongoose.Schema.Types.ObjectId,
                    ref:"address",
                  required: true,
                  type: [String],
              }
            ,
            phoneNumber: {
              type: String,
              required:Number
            
            },
               isApproved: {
        type: Boolean,
        default: false 
    },
      
      
})
const User=mongoose.model("User",userShema)

module.exports=User;