const Order = require('../../models/server/orderModel');

const createOrder = async (req, res) => {
    try {
        const { products, paymentIntent, orderStatus, orderby } = req.body;

        if (!products || !paymentIntent || !orderStatus || !orderby) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new order
        const newOrder = new Order({
            products,
            paymentIntent,
            orderStatus,
            orderby,
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // Respond with the created order
        return res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        console.error('Error processing order:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = createOrder;
