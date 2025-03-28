const Order = require("../../models/others/orderModel");

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'address', select: 'streetAddress city state zipCode' })
      .populate({ path: 'products', select: 'title price' })
      .lean();

    return res.status(200).json({
      message: "Orders retrieved successfully",
      success: true, orders
    });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
}

const confirmOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "CONFIRMED" }, { new: true });
    return res.status(200).json({ message:"Order confirmed successfully",success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const shippingOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "SHIPPED" }, { new: true });
    return res.status(200).json({ message:"Order shipped successfully",success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deliveryOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "DELIVERED" }, { new: true });
    return res.status(200).json({message:"Order delivered successfully", success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelledOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "CANCELLED" }, { new: true });
    return res.status(200).json({message:"Order cancelled successfully", success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteOrders = async (req, res) => {
  try {
    const deletedOrder = await Order.find();
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json({message:"Order deleted successfully.", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  confirmOrders,
  shippingOrders,
  deliveryOrders,
  cancelledOrders,
  deleteOrders,
};
