const { findUserCart, addCartItem} = require("../service/cartService");

const findUserCartController=async(req,res)=>{
  let userId=await req.user.userId;
  
  try{
    const cart = await findUserCart(userId);
   
      return res.status(200).send(cart);
  }
  catch(error){
      return res.status(500).send({error:error.message});
  }
}

const addItemCartController = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(400).send({ error: "User not authenticated" });
  }

  let userId = req.user.userId;
  console.log("Authenticated User ID:", userId);

  try {
    const cartItem = await addCartItem(userId, req.body);
    return res.status(200).send(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  findUserCartController,
  addItemCartController,
};
