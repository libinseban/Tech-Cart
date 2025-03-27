/** @format */

const mongoose = require("mongoose");
const wishList = require("../models/cart/wishList");
const Product = require("../models/product/productModel");
const Cart = require("../models/cart/cartModel");
const CartItem = require("../models/cart/cartItem");
const { addCartItem } = require("../service/cartService");
const ObjectId = mongoose.Types.ObjectId;

const updateWishList = async (req, res) => {
  const userId = req.cookies.userId;

  const { productId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).send({ error: "Invalid productId or userId" });
  }

  try {
    let wishlist = await wishList.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new wishList({
        user: userId,
        wishlistItems: [{ product: productId, quantity: 1 }],
      });
    } else {
      const existingProduct = wishlist.wishlistItems.find((item) =>
        item.product.equals(productId)
      );
    
      if (existingProduct) {
        return res.status(409).send({ message: "Product already in wishlist" });
      }

      wishlist.wishlistItems.push({ product: productId, quantity: 1 });
    }

    await wishlist.save();
    return res.status(200).send({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error. Please try again later." });
  }
};

const removeWishList = async (req, res) => {
  const userId = req.cookies.userId;

  const { productId } = req.params;

  try {
    const wishlist = await wishList.findOne({ user: userId });

    if (!wishlist) {
      return res
        .status(404)
        .send({ error: "Wishlist not found for the given userId." });
    }

    const existingProduct = wishlist.wishlistItems.find((item) =>
      item.product.equals(productId)
    );

    await wishList.updateOne(
      { user: userId },
      { $pull: { wishlistItems: { product: productId } } }
    );

    return res.status(200).send({ message: "Product removed from wishlist." });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error. Please try again later." });
  }
};

const getWishlist = async (req, res) => {
  const userId = req.cookies.userId;
  try {
    const wishlist = await wishList
      .findOne({ user: userId })
      .populate("wishlistItems.product");

    if (wishlist) {
      const productDetails = wishlist.wishlistItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      if (productDetails.length === 0) {
        return res.status(200).send({ message: "Wishlist is empty." });
      }
      return res
        .status(200)
        .send({ message: "Products in WishList", productDetails });
    } else {
      return res
        .status(404)
        .send({ error: "Wishlist not found for the given userId." });
    }
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error. Please try again later." });
  }
};

const getWishlistProduct = async (req, res) => {
  const userId = req.cookies.userId;
  const { productId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).send({ error: "Invalid productId or userId" });
  }

  try {
    const wishlist = await wishList
      .findOne({ user: userId })
      .populate("wishlistItems.product");

    if (!wishlist) {
      console.log("Wishlist not found");
      return res.status(404).send({ message: "Wishlist not found" });
    }

    const product = wishlist.wishlistItems.find(
      (item) => String(item.product._id) === productId
    );

    if (!product) {
      console.log("Product not found in Wishlist");
      return res.status(404).send({ message: "Product not found in Wishlist" });
    }

    return res
      .status(200)
      .send({ message: "Product found in Wishlist", product });
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error. Please try again later." });
  }
};

const moveProductToCart = async (req, res) => {
  const { quantity } = req.body || 1 ;
  const userId = req.cookies.userId;

  const { productId } = req.params;

  try {
    if (!productId || !userId) {
      return res
        .status(400)
        .send({ error: "Product ID and User ID are required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cartItem: [] });
    }

    const cartItems = await addCartItem(userId, { productId, quantity });

    await wishList.findOneAndUpdate(
      { user: userId },
      { $pull: { product: productId } },
      { new: true }
    );

    return res.status(200).send({
      message: "Product moved to cart successfully",
      cartItems,
    });
  } catch (error) {
    console.error("Error moving product to cart:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  moveProductToCart,
  removeWishList,
  updateWishList,
  getWishlist,
  getWishlistProduct,
};
