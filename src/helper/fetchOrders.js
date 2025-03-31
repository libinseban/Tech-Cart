const Order = require("../models/others/orderModel");

const getOrdersByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const orders = await Order.find({ orderStatus: status });
    return res.status(200).json({ 
      message: `${status} order list`, 
      success: true, 
      orders 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




module.exports = {
getOrdersByStatus};
