const userService =require("./userService")
const Cartitem=require("../../models/cart/cardItem")

async function updateCartitem(userId,cartItemId,cartItemData){
    try{

      const item=await findCartItemById(cartItemId);
      if(!item){
      return console.log("cart item not found",cartItemId);

      }
      const user=userService.findUserById(item.userId);
      if(!user){
        return console.log("user not found",userId);
              
      }
      if(user._id.toString()===userId.toString()){
        item.quantity=cartItemData.quantity;
        item.price=item.quantity*item.product.price;
        item.discounterdPrice=item.quantity*item.product.discounterdPrice;
        const updateCartitem=await item.save();
        return updateCartitem
      }
      else{
        console.log("you cant updatee this cart");
      }

    }catch(error){
throw error;
    }
}
async function removeCartItem(userId, cartItemId) {
  try {
      const cartItem = await findCartItemById(cartItemId);
      const user = await userService.findUserById('665d8e8f091160682bfe82cf');
console.log(cartItemId);
      if ( (user && user._id && cartItem && cartItem.user && user._id.toString() === cartItem.user.toString())) {
          await Cartitem.findByIdAndDelete(cartItemId);
          console.log("Item removed successfully");
          return;
      } else {
          console.log("You can't remove this item");
      }
  } catch (error) {
      console.error("An error occurred:", error);
      throw error;
  }
}
async function findCartItemById(cartItemId){
    const cartItem=await Cartitem.findById(cartItemId)
    if(cartItem){
        return cartItem
    }
    else{
        return console.log("cartitem not found with id",cartItemId);
    }
}
module.exports={
    updateCartitem,
    removeCartItem,
    findCartItemById
}