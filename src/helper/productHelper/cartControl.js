
const { findUserCart, addCartItem,removeCartItem } = require("../../service/cartService");
const CartItem = require("../../models/cart/cartItem");
const { default: mongoose } = require("mongoose");
const Cart = require("../../models/cart/cartModel");

const findUserCartController = async (req, res) => {
  console.log("Cookies: ", req.cookies); 
  const userId  = req.cookies.userId;

  try {
    const cartItems = await findUserCart(userId);
    if (!cartItems) {
      return res.status(404).json({ message: "Cart not found for user" });
  }

  res.status(200).json({ cartItems });  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const addItemCartController = async (req, res) => {
const userId=req.cookies.userId
  const { productId, quantity } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing" });
}
 

  try {
    const cartItem = await addCartItem(userId, { productId, quantity });
    return res.status(200).json({ message: "Product added to your cart", cartItem });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).send({ error: error.message });
  }
};
const removeItemCartController = async (req, res) => {
  const userId=req.cookies.userId
  const productId = req.params.productId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing" });
 }
  try {
    const updatedCart = await removeCartItem(userId, productId);
    return res.status(200).send({ message: "Product removed from your cart", updatedCart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).send({ error: error.message });
  }
};

const findUserCartById = async (req, res) => {
const userId=req.cookies.userId


  try {
    const cartItems = await findUserCart(userId);
    
    if (!cartItems || (cartItems.products && cartItems.products.length === 0)) {
      return res.status(200).json({ message: "Cart is empty", cartItems: [] });
    }

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error finding product in cart:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  findUserCartController,
  addItemCartController,
  removeItemCartController,
  findUserCartById
};
