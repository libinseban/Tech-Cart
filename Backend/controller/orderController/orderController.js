const orderService=require("../service/orderSevice");


const createOrder=async(req,res)=>{
  const user= await req.user;

  try {
    let createOrder=await orderService.createorder(user,req.body);
    return res.status(201).send(createOrder);
  } catch (error) {
    return res.status(500).send({error:error.message});
    
  }
}

const findOrderById=async(req,res)=>{
    const user=await req.user;
  
    try {
      let createOrder=await orderService.findOrderById(user,params.id);
      return res.status(201).send(createOrder);
    } catch (error) {
      return res.status(500).send({error:error.message});
      
    }
  }

  
const OrderHistory=async(req,res)=>{
    const user=await req.user;
  
    try {
      let createOrder=await orderService.OrderHistory(user._id);
      return res.status(201).send(createOrder);
    } catch (error) {
      return res.status(500).send({error:error.message});
      
    }
  }
  module.exports={
    OrderHistory,
    findOrderById,
    createOrder
  }