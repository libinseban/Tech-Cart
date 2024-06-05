const Cart=require("../../models/cart/cartModel")
 const Cartitem=require("../../models/cart/cardItem")
 const Products=require("../../models/server/productModel");

const user=require("../../models/client/userModel");
 
 

async function CreateCart(user){

try{
    
        const cart= new Cart({ user});
       const createdCart=await cart.save();
       console.log(createdCart);
      return createdCart;
       
}
catch(error){
  throw error;
  }
}


async function findUserCart(userId) {
 
  try {
  let cart = await Cart.findOne({user:userId});
      if (!cart) {
          throw new Error("Cart not found");
      }
      console.log(cart);
      const cartItems = await Cartitem.find({ cart: cart._id }).populate("product")
      cart.cartItems = cartItems;

  

      let totalPrice = 0;
      let totalDiscountPrice = 0;
      let totalItem = 0;

      for (let cartItem of cart.cartItems) {
          totalPrice += cartItem.price;
          totalDiscountPrice += cartItem.discountedPrice;
          totalItem += cartItem.quatity;
      }

      cart.totalPrice = totalPrice;
      cart.totalItem = totalItem;
      cart.discounte = totalPrice - totalDiscountPrice;
     
      return cart;    //const {findUserById=async(userId)=>{


    }
  



  catch (error) {
      throw error;
  }
}

async function addCartItem(userId, req) {
  try {
    console.log(userId);
    const cart = await Cart.findOne({ user:userId });
    const product = await Products.findById(req.productId);
if(!cart){
  throw error
}
console.log("success");
    if (!product) {
      throw new Error("Product not found");
    }

    const isPresent = await Cartitem.findOne({ cart: cart._id, product: product._id, user });

    if (!isPresent) {
      const cartItem = new Cartitem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        user,
        price: product.price, 
        size: req.size,
        discountedPrice: product.discountedPrice,
      });
     
      
      

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem); 
      await cart.save();
      return "Item added to cart";
    } else {
      return "Item is already in the cart";
    }
  } catch (error) {
    console.error(error);
    throw error; 
  }
}


module.exports={findUserCart,addCartItem,CreateCart};