
const Cart = require("../models/cart/cartModel");
const Products = require("../models/product/productModel");
const CartItem = require("../models/cart/cartItem");

async function CreateCart(userId) {
  try {
    const cart = new Cart({ user: userId });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw error;
  }
}

async function findUserCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
        path: "cartItem",
        populate: {
          path: "product",
          model: "Product",
          select: "_id title price discountPrice brand productImages description",
        }
      })
    .exec();
  

    if (!cart) {
      return { message: "Cart not found" };
    }
    if (!cart.cartItem || cart.cartItem.length === 0) {
      console.log("Cart found but no items");
    }
    

    const cartItems = cart.cartItem;
    console.log("Cart items populated:", cartItems);

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    const products = cartItems
      .map((item) => {
        const { product, quantity } = item;
        if (!product) return null;

        totalPrice += product.price * quantity;
        totalDiscountPrice += (product.discountPrice || 0) * quantity;
        totalItem += quantity;

        return {
          product: {
            productId: product._id,
            title: product.title,
            price: product.price,
            discountPrice: product.discountPrice,
            brand: product.brand,
            productImages: product.productImages,
            description: product.description,
          },
          quantity,
          itemTotal: product.price * quantity,
          itemDiscountTotal: (product.discountPrice || 0) * quantity,
        };
      })
      .filter((item) => item !== null);

    return {
      cart: cart._id,
      user: cart.user,
      products,
      totalDiscountPrice,
      totalPrice,
      totalItem,
      finalPrice: totalPrice - totalDiscountPrice,
    };
  } catch (error) {
    console.error("Error finding user cart:", error);
    throw error;
  }
}

async function addCartItem(userId, { productId,quantity }) {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await CreateCart(userId);
    }

    // First fetch the product to get its price
    const product = await Products.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if the item already exists in the cart
    const existingCartItem = await CartItem.findOne({
      user: userId,
      product: productId,
      cart: cart._id
    });

    if (existingCartItem) {
      existingCartItem.quantity = quantity; 
      await existingCartItem.save();
    } else {
      // Create new cart item with product price
      const cartItem = new CartItem({
        product: productId,
        user: userId,
        quantity: quantity || 1,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        cart: cart._id,
      });

      const savedCartItem = await cartItem.save();
      cart.cartItem.push(savedCartItem._id);
      await cart.save();
    }

    return await findUserCart(userId);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
}

async function removeCartItem(userId, productId) {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      console.log("Cart not found");
      throw new Error("Cart not found");
    }

    const cartItem = await CartItem.findOne({
      product: productId,
      user: userId,
    });
    if (!cartItem) {
      console.log("Cart item not found");
      throw new Error("Cart item not found");
    }

    await CartItem.findByIdAndDelete(cartItem._id);
    await Cart.updateOne(
      { user: userId },
      { $pull: { cartItem: cartItem._id } }
    );

    return await findUserCart(userId);
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
}

module.exports = { findUserCart, addCartItem, removeCartItem };
