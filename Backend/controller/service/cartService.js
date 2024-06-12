

const Cart = require("../../models/cart/cartModel");
const Cartitem = require("../../models/cart/wishList");
const Products = require("../../models/server/productModel");

const User = require("../../models/client/userModel");

async function CreateCart(user) {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw error;
  }
}

async function findUserCart(userId) {
  try {
    const cart = await Cart.findOne({user:userId})

    if (!cart) {
      throw new Error("Cart not found");
    }
    const cartItems = await Cartitem.find({ cart: cart._id }).populate(
      "product"
    );
    cart.cardItem = cartItems;

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    for (let cartItem of cart.cardItem) {
      totalPrice += cartItem.price;
      totalDiscountPrice += cartItem.discountPrice;
      totalItem += cartItem.quantity;
    }

    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.discount = totalPrice - totalDiscountPrice;
    await cart.save();
    return cart;
  } catch (error) {
    throw error;
  }
}

async function addCartItem(userId, req) {
  try {
    let cart = await Cart.findOne({user:userId});
    const product = await Products.findById(req.productId);
    
    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      console.log("Cart not found...");
      
    }

    const isPresent = await Cartitem.findOne({
      cart: cart._id,
      product: product._id,
      user: userId,
    });

    if (!isPresent) {
      const cartItem = new Cartitem({
        product: product._id,
        cart: cart._id,
        quantity: req.quantity || 1,
        user: userId,
        price: product.price,
        discountPrice: product.discountPrice || 0,
      });

      const createdCartItem = await cartItem.save();
      cart.cardItem = cart.cardItem || [];
      cart.cardItem.push(createdCartItem); 
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


module.exports = { findUserCart, addCartItem, CreateCart };
