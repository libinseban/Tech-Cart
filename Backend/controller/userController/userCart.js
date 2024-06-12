const {findUserCartController,
    addItemCartController}=require("../orderController/cartControl")

const findUserCart=async(req,res)=>{
    let userId=req.user;
    
    
    try{
        const cart=await findUserCartController(userId.userId);
       
        return res.status(200).send(cart);
    }
    catch(error){
        return res.status(500).send({error:error.message});
    }
}

const additemCart=async(req,res)=>{
    let userId=req.user;
    
    try{
        const cartItem=await addItemCartController(userId, req.body)
        return res.status(200).send(cartItem);
    }
    catch(error){
        return res.status(500).send({error:error.message});
    }
}
module.exports={
    findUserCart,
    additemCart
}