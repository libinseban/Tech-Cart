const userService = require("../service/userService");
const cartModel = require("../../models/cart/cartModel");
const User = require("../../models/client/userModel");

async function updateCartItem(userId, cartId, cartItemData) {
  console.log("Received User ID:", userId);
  console.log("Cart Item Data:", cartItemData);
  console.log("Cart ID:", cartId);

  try {
    const item = await cartModel.findById(cartId).populate('product');
    console.log("Found cart item:", item);

    if (!item) {
      console.log("Cart item not found", cartId);
      return null;
    }

    const user = await User.findById(userId);
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found", userId);
      return null;
    }

    if (item.user && item.user.toString() === user._id.toString()) {
      item.quantity = cartItemData.quantity;

      if (item.product && typeof item.product.price === "number" && typeof item.product.discountPrice === "number") {
        item.price = item.quantity * item.product.price;
        item.discountPrice = item.quantity * item.product.discountPrice;
        const updatedCartItem = await item.save();
        return updatedCartItem;
      } else {
        console.log("Invalid product price or discounted price:", item.product);
        return null;
      }
    } else {
      console.log("You can't update this cart");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while updating the cart item:", error);
    throw error;
  }
}


async function removeCartItem(userId, cartId) {

  try {
    const cartItem = await userService.findCartItemById(cartId);
    console.log("Cart item:", cartItem);

    if (!cartItem) {
      console.log("Cart item not found with id", cartId);
      return;
    }
    
    const user = await userService.findUserById(userId);
    console.log("User:", user);

    if (user && user._id && cartItem && cartItem.user && user.toString() === cartItem.user.toString()) {
      await cartModel.findByIdAndDelete(cartId);
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



module.exports = {
  updateCartItem,
  removeCartItem
};
