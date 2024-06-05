const mongoose=require ('mongoose')


const ratingShema=new mongoose.Schema({
    users:{
        type:mongoose.Schema .Types.ObjectId,
        ref:"users",
        require:true
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        require:true
      },
      rating: {
        type: String,
        required: true,
       
       
      },
      createAt:
          {
              type: Date,
              default:Date.now
          }
    })
    const Rating=mongoose.model("ratings",ratingShema)

module.exports=Rating;