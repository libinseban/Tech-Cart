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
      }
      
      
})
const User=mongoose.model("User",userShema)

module.exports=User;