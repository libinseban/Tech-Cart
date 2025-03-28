const Order = require("../models/others/orderModel");

const getOrdersByStatus = async (req, res, status) => {
  try {
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

const getConfirmedOrders = async (req, res) => getOrdersByStatus(req, res, "confirmed");
const getShippedOrders = async (req, res) => getOrdersByStatus(req, res, "shipped");
const getDeliveredOrders = async (req, res) => getOrdersByStatus(req, res, "delivered");
const getCancelledOrders = async (req, res) => getOrdersByStatus(req, res, "cancelled");



module.exports = {
  getConfirmedOrders,
  getShippedOrders,
  getDeliveredOrders,
  getCancelledOrders};
