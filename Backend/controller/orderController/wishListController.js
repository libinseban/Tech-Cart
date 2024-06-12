const wishListService = require("../service/wishListService");

const updateWishList = async (req, res) => {
  const userId = req.user.userId;
  const cartId = req.params.id;
  
  try {
    const updatedCartItem = await wishListService.updateCartItem( userId,cartId,req.body);
//  console.log(updatedCartItem)

    if (updatedCartItem) {
      return res.status(200).send(updatedCartItem);
    } else {
      return res.status(400).send({ error: "Failed to update cart item" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

const removeWishList = async (req, res) => {
  const userId = req.user.userId;
  const cartId = req.params.id;


  try {
    await wishListService.removeCartItem(userId, cartId);
    return res.status(200).send({ message: "Cart item removed" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

module.exports = { removeWishList, updateWishList };
