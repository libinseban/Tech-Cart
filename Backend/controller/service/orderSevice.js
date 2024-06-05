const cartService=require("./cartService")
const Address=require("../../models/server/addressModel");
const product = require("../../models/server/productModel");
const Order=require("../../models/server/orderModel");
const OrderItem=require('../../models/server/orderItems')

const User=require('../../models/client/userModel')



async function createorder( user,shippAddress) {
    try {
        console.log(shippAddress);
        const user='665d8e8f091160682bfe82cf';
       
        let address;
      if(shippAddress._id){
        let existAddress=await Address.findById(shippAddress._id);
        address=existAddress;
      }else{
            address = new Address(shippAddress);
            address.user = user;
         
           const addAddress= await address.save();
          
             console.log(addAddress._id);
             const Userid=await User.findById(user);
             if(!Userid)
                {
                    console.log(Userid,"not here");
                }
                console.log(Userid,"here");
               
                
          Userid.address.push(addAddress);
    
           await Userid.save();

            console.log(Userid,"userrrrr");
        
      }
const cart = await cartService.findUserCart(user._id);
        console.log(cart,'cartttt');
        const orderItemsId = [];

        for (const item of cart.cartItems) {
            const orderItem = new OrderItem({
                price: item.price,
                product: item.product,
                quantity: item.quantity,
                size: item.size,
                user: item.user,
                discountedPrice: item.discountedPrice,
            });
            const createOrderItem = await orderItem.save();
            orderItemsId.push(createOrderItem);
            if(!orderItemsId){
                console.log("no array",orderItemsId);
            }
          console.log(orderItemsId,"array");
        }

        const createOrder = new Order({
            user,
            orderItems:orderItemsId,
            totalPrice: cart.totalPrice,
            totalDiscountPrice: cart.totalDiscountPrice,
            discounte:cart.discounte,
            totalItem: cart.totalItem,
            shippAddress: address,
            orderDate: new Date(),
            createAd: new Date()
        });

        const saveOrder = await createOrder.save();
        
        console.log("succuess",saveOrder);
        return saveOrder;
    } catch (error) {
        throw error;
    }
}

 
async function confiremeOrder(orderId){
    const order =await findOrderById(orderId);
  
    order.orderStatus="CONFIRMED";
   
    return await order.save();

}

async function shipOrder(orderId){
    const order =await findOrderById(orderId);
    
    order.orderStatus="SHIPPED";
   
    return await order.save();
    `   `
}

async function deliveryOrder(orderId){
    const order =await findOrderById(orderId);
    
    order.orderStatus="DELIVERED";
   
    return await order.save();
    `   `
}
async function CanceldOrder(orderId){
    const order =await findOrderById(orderId);
    
    order.orderStatus="CANCELLED";
   
    return await order.save()
}

async function findOrderById(orderId){

    const order=await Order.findById(orderId)
    .populate("user")
    .populate({path:"orderItem",populate:{path:"product"}})
    .populate("shippingAddress")
    
    return order

}

async function userOrderHistory(orderId){
    try{
        const orders=await Order.find({user:userId,orderStatus:"PLACED"})
        .populate({path:"orderItem",populate:{path:"product"}}).lean()
         
    return orders;
    }
    catch(error){
return console.log(error);
    }
}

async function getAllOrders(){
    return await Order.find()
    .populate({path:"orderItem",populate:{path:"product"}}).lean()
}
async function deleteOrders(orderId){
    const order=await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id);
}

module.exports={
    createorder,
    
    confiremeOrder,
    shipOrder,
    deliveryOrder,
    CanceldOrder,
    findOrderById,
    userOrderHistory,
    getAllOrders,
    deleteOrders
}