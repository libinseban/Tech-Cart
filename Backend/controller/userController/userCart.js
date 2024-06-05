const cartService=require("../orderController/cartControl")

const findUserCart=async(req,res)=>{
    let userId=req.user;
    
    
    try{
        const cart=await cartService.findUserCart(userId.userId);
        console.log("cart2",cart);
        return res.status(200).send(cart);
    }
    catch(error){
        return res.status(500).send({error:error.message});
    }
}

const additemCart=async(req,res)=>{
    let userId=req.user;
    console.log(userId,"1");
    try{
        const cartItem=await cartService.addCartItem(userId, req.body)
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