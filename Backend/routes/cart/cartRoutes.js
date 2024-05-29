const express = require('express');
const router = express.Router();
const Product = require('../../models/productModel'); // Your Product Model
const Cart = require('../models/Cart'); // Your Cart Model

// Add Item to Cart
router.post('/cart/add', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the cart exists for the user
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      // Create a new cart if not exist
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity, price: product.price }],
        total: product.price * quantity
      });
    } else {
      // If the cart exists, update the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity and total if product exists
        let cartItem = cart.items[itemIndex];
        cartItem.quantity += quantity;
        cart.total += product.price * quantity;
      } else {
        // Add new product if not exists
        cart.items.push({ productId, quantity, price: product.price });
        cart.total += product.price * quantity;
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
});

// Get Cart Items
router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

module.exports = router;
