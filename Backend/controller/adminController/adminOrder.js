const orderService=require('../service/orderSevice')


const getAllOrders=async(req,res)=>{
    try{
        const orders=await orderService.getAllOrders();
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const conformorder=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.confiremeOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}
const shipporder=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.shipOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const deliverorder=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.deleteOrders(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const cancelledorder=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.CanceldOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const deleteorder=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.deleteOrders(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}
module.exports={
    getAllOrders,
    conformorder,
    cancelledorder,
    deleteorder,
    shipporder,
    deliverorder
}