
const Cart=require("../../models/cart/cartModel")
 const Cartitem=require("../../models/cart/cardItem")
 const Products=require("../../models/server/productModel");

const User=require("../../models/client/userModel");
 
 

async function CreateCart(user){

try{
    
        const cart= new Cart({ user});
       const createdCart=await cart.save();
    console.log("createdCart",createdCart);
      return createdCart;
       
}
catch(error){
  throw error;
  }
}


async function findUserCart(userId) {
 
  try {
    console.log(userId,"user1");
    const cart=await Cart.findOne({user:'665d8e8f091160682bfe82cf'})

  console.log("cart1",cart);
      if (!cart) {

          throw new Error("Cart not found");

      }
      const cartItems = await Cartitem.find({ cart:cart._id }).populate("product");

     
      cart.cardItem = cartItems;

  

      let totalPrice = 0;
      let totalDiscountPrice = 0;
      let totalItem = 0;

      for (let cartItem of cart.cardItem) {
          totalPrice += cartItem.price;
          totalDiscountPrice += cartItem.discountedPrice;
          totalItem += cartItem.quantity;
      }

      cart.totalPrice = totalPrice;
      cart.totalItem = totalItem;
      cart.discounte = totalPrice - totalDiscountPrice;    
      await cart.save();
      return cart;   




      
    }    


  catch (error) {
      throw error;
  }
  
}

async function addCartItem(userId, req) {
  try {
  
    const cart = await Cart.findOne({ user:"665d8e8f091160682bfe82cf" });
    const userId="665d8e8f091160682bfe82cf";
    const product = await Products.findById(req.productId);
if(!cart){
  console.log("cart not ");
}
console.log("success");
    if (!product) {
      throw new Error("Product not found");
    }

    const isPresent = await Cartitem.findOne({ cart: cart._id, product: product._id, user:userId });

    if (!isPresent) {
      const cartItem = new Cartitem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        user:userId,
        price: product.price,     
        size: req.size,
        discountedPrice: product.discountedPrice,
      });
     
      
      console.log(cartItem,"succuess2");

      const createdCartItem = await cartItem.save();
      cart.cardItem = cart.cardItem || [];
      cart.cardItem.push(createdCartItem); // Assuming the array name is cartItems, update it accordingly if different
      await cart.save();
      return "Item added to cart";
    } else {
      return "Item is already in the cart";
    }
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be caught by the caller
  }
}


module.exports={findUserCart,addCartItem,CreateCart};