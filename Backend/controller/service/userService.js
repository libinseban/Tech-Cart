const findUserById=async(user)=>{
    try {
        const userId=await User.findById(user)
        if(!user){
    throw new Error("user not found",userId);
    
        }
        return user;
    } catch (error) {
        throw new Error(error);
    }
}
  module.exports=findUserById