const Address = require("../models/others/addressModel");
const Order = require("../models/others/orderModel");
const User = require('../models/client/userModel');
const Cart = require("../models/cart/cartModel");
const Seller = require("../models/client/seller");
const nodemailer = require('nodemailer');
const Product = require("../models/product/productModel");
const Razorpay = require('razorpay');
const CartItem = require("../models/cart/cartItem");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_PASSWORD
  }
});
async function sendEmail(sellerEmail, sellerName, subject, productNames, orderAddress, orderDate) {
  const mailOptions = {
    from: `"Tech-Cart Support" <no-reply@tech-cart.com>`,
    to: sellerEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3 style="color:blue">Dear ${sellerName},</h3>
        <p>A new order has been placed for your product(s):</p>
        <ul style="list-style-type: circle; padding-left: 20px;">
          ${productNames}
        </ul>
        
        <h4>Shipping Details</h4>
        <p>
          <strong>Name:</strong> ${orderAddress.name}<br>
          <strong>Address:</strong> ${orderAddress.streetAddress}, ${orderAddress.city}, ${orderAddress.state} - ${orderAddress.zipCode}<br>
          <strong>Contact Number:</strong> ${orderAddress.phoneNumber}
        </p>
        
        <p><strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString()}</p>
        
        <p>Thank you for your continued partnership with <strong>Tech-Cart</strong>.</p>
        <p style="margin-top: 30px;">Best Regards,<br><strong>Tech-Cart Team</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${sellerEmail}`);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
}




const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createOrder = async (userId, shippingAddress) => {
  try {
    let address;
    if (shippingAddress._id) {
      address = await Address.findById(shippingAddress._id);
    }

    if (!address) {
      const requiredFields = ["name", 'streetAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          throw new Error(`Missing required address field: ${field}`);
        }
      }

      address = new Address({
        user: userId,
        ...shippingAddress
      });

      await address.save();
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'cartItem',
      populate: {
        path: 'product',
        select: 'price discountPrice user title brand color model finalPrice', 
        populate: { path: 'user', select: 'email' }
      }
    });
    

    if (!cart || !cart.cartItem || !cart.cartItem.length) {
      throw new Error('Cart or CartItems not found');
    }

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    cart.cartItem.forEach(item => {
      totalPrice += (item.product.finalPrice * item.quantity)
      totalDiscountPrice += item.product.discountPrice * item.quantity;
      totalItem += item.quantity;
    });

    const finalPrice = totalPrice - totalDiscountPrice;
    const products = cart.cartItem.map(item => item.product._id);


    const paymentCapture = 1; 
    const razorpayOptions = {
      amount: finalPrice, 
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 10000}`,
      payment_capture: paymentCapture
    };

    const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
    console.log('Razorpay order created:', razorpayOrder);

    const order = new Order({
      user: userId,
      orderDate: new Date(),
      address: address._id,
      totalPrice,
      totalDiscountPrice,
      totalItem,
      products,
      paymentId: razorpayOrder.id,  
      orderStatus: 'PENDING',    
    });

    await order.save();
 



    const userData = new Set();
    cart.cartItem.forEach(item => {
      if (item.product.user) {
        userData.add(item.product.user);
      }
    });

    const userDetails = await Promise.all([...userData].map(userId => User.findById(userId)));
    for (const userId of userDetails) {
      const user = await User.findById(userId);
      
      const userProducts = cart.cartItem
        .filter(item => item.product.user.toString() === userId.toString())
        .map(item => item.product.title) 
      
      const productNames = userProducts.join(", "); 

      if (user && user.email) {
        console.log(`Attempting to send email to user: ${user.email}`);
        await sendEmail(
          user.email,
          user.name,
          'New Order Placed',
          productNames,
          order.address,
          order.orderDate
        );
        
        console.log(`Email sent to seller: ${user.email}`);
      } else {
        console.warn(`No email found for seller with ID: ${userId}`);
      }
    }
    
const userCart = await Cart.findOne({ user: userId });

const updateResult = await Cart.findOneAndUpdate(
  { user: userId },
  { $set: { cartItem: [] } },
  { new: true }
);

    
if (userCart) {
  await CartItem.deleteMany({ _id: { $in: userCart.cartItem } });
  userCart.cartItem = [];
  await userCart.save();
}


 

    return {
      message: 'Order placed successfully',
      order,
      razorpayOrderId: razorpayOrder.id, 
      amount: Math.round(finalPrice * 100),            
      currency: "INR"
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};



const cancelOrder = async (req, res) => {
  const { productId } = req.body;
  const userId = req.cookies.userId;
  try {
    const orders = await findOrder(productId, userId);
    
    if (orders.length === 0) throw new Error('Order not found');
    
    const order = orders[0];
    
    await Order.findByIdAndUpdate(order.orderId, { orderStatus: "CANCELLED" });
    
    
    for (const product of order.products) {
      const productDetails = await Product.findById(productId).populate('user', 'email name');
      
      if (productDetails && productDetails.user && productDetails.user.email) {
        const sellerEmail = productDetails.user.email;
        const subject = `Order ${order.orderId} Cancelled`;
        const message = `Dear ${productDetails.seller.name}, the order containing your product
         ${productDetails.title} has been cancelled by the user.`;

       await sendEmail(sellerEmail, productDetails.user.name, subject, productDetails.title, {},message, new Date());
      
      }
    }

    return res.status(200).send({ success: true, message: 'Order cancelled and sellers notified.' });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).send({ error: error.message });
  }
};

  
async function findOrder(productId, userId) {
  try {
    const orders = await Order.find({
      user: userId,
      orderStatus: { $in: ["CONFIRMED", "PENDING", "SHIPPED"] }
    })
    .populate({
      path: 'products',
      select: '_id title price discountPrice',  
    })
    .lean();
    
    
    const orderStatuses = orders.map(order => ({
      orderId: order._id,
      products: order.products
        .filter(product => product._id.toString() === productId)
        .map(product => ({
          product: product,
          status: order.orderStatus,
          orderDate:order.createdAt
        }))
    })).filter(order => order.products.length > 0); 
    return orderStatuses;
  } catch (error) {
    console.error("Error finding order:", error);
    throw error;
  }
}

  
  async function userOrderHistory(userId) {
    try {
      const orders = await Order.find({
        user: userId,
        orderStatus: { $in: [ "PENDING","CONFIRMED"] }
      })
      .populate({
        path: 'products',
        select: 'title price discountPrice'
      })
        .lean();
  
   if (orders.length === 0) {
    return { success: false, message: 'Order list is empty' };
  }

  return { success: true, orders };
    } catch (error) {
      console.error("Error retrieving user order history:", error);
      throw error;
    }
  }



  module.exports = {
    createOrder,
    cancelOrder,
    findOrder,
    userOrderHistory,
    
  }

