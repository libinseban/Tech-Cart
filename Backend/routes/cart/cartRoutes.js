const express = require('express');
const router = express.Router();
const Product = require('../../models/server/productModel'); 
const Cart = require('../../models/cart/cartModel'); 

// Add Item to Cart
router.post('/cart/add', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required', success: false, error: true });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false, error: true });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity, price: product.price }],
        total: product.price * quantity
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        let cartItem = cart.items[itemIndex];
        cartItem.quantity += quantity;
        cart.total += product.price * quantity;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
        cart.total += product.price * quantity;
      }
    }

    await cart.save();
    res.status(201).json({ cart, success: true, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error, success: false });
  }
});

// Get Cart Items
router.get('/cart',  async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found', success: false, error: true });
    }
    res.json({ cart, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error, success: false });
  }
});

module.exports = router;

