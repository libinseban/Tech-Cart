const Order = require("../../models/others/orderModel");
const Product = require("../../models/product/productModel");
const sendCancellationEmail = require("../../helper/sendCancellationEmail");

const getSellerProducts = async (userId) => {
  return await Product.find({ seller: userId }).select("_id").lean();
};

const getOrders = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const products = await getSellerProducts(userId);

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }
    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    }).populate("user");

    if (orders.length > 0) {
      return res.status(200).json({ success: true, orders});
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const confirmOrders = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const products = await getSellerProducts(userId);


    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    }).populate("user");

    console.log("Orders found:", orders);

    if (orders.length > 0) {
      const updatedOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "CONFIRMED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, updatedOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error confirming orders:", error);
    return res.status(500).json({ error: "Failed to confirm orders." });
  }
};

const shippingOrders = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const products = await getSellerProducts(userId);


    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    }).populate("user", "name email address");


    console.log("Orders found:", orders);

    if (orders.length > 0) {
      const shippedOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "SHIPPED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, shippedOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const deliverOrders = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const products = await getSellerProducts(userId);

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    if (orders.length > 0) {
      const deliveredOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "DELIVERED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, deliveredOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const cancelOrders = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    const sellerProducts = await getSellerProducts(userId)

    if (!sellerProducts.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }
    const sellerProductIds = sellerProducts.map((product) => product._id);

    const orders = await Order.find({
      products: { $in: sellerProductIds },
    })
      .populate("user")
      .populate("products");

    if (orders.length > 0) {
      // Cancel each order
      const cancelledOrders = await Promise.all(
        orders.map(async (order) => {
          const sellerProductsInOrder = order.products.filter((product) =>
            sellerProductIds.includes(product._id.toString())
          );

          if (!sellerProductsInOrder.length) return null;

          const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            {
              orderStatus: "CANCELLED",
              cancelReason: "Order canceled by the seller",
            },
            { new: true }
          );

          if (order.user?.email) {
            const productNames = sellerProductsInOrder.map((product) => product.title);

            const orderAddress = order.shippingAddress || {};
            const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();

            await sendCancellationEmail(
              order.user.email,
              order.user.name,
              order._id,
              productNames,
              orderAddress,
              orderDate
            );
          }

          return updatedOrder;
        })
      );

      return res.status(200).json({ success: true, cancelledOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const deleteOrders = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const products = await getSellerProducts(userId);
    if (!products.length) {
      return res.status(400).json({ message: "No products found for this seller." });
    }

    const deletedResult = await Order.deleteMany({
      products: { $in: products.map((product) => product._id) },
    });
        return res.status(200).json({
      success: true,
      message: `${deletedResult.deletedCount} order(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting orders:", error.stack);
    return res.status(500).json({ error: "Failed to delete orders." });
  }
};


module.exports = {
  deleteOrders,
  confirmOrders,
  cancelOrders,
  deliverOrders,
  shippingOrders,
  getOrders,
};
