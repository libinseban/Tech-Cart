const mongoose=require ('mongoose')


const categoryShema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:50
       
      },
      
      parentCategory:{
        
            type:mongoose.Schema.Types.ObjectId,
            ref:"categories"
        },
      
    
      
      
      level:{
        type:Number,
       required:true,
      }
})

const category=mongoose.model("categoty",categoryShema)

model.exports=category;