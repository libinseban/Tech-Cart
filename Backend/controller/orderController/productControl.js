const ProductService=require("../service/productService")


const createProduct=async(req,res)=>{
    try{
      const product= await ProductService.createProduct(req.body);
      console.log(  "Success");
      return res.status(201).send(product);

    }catch(error){
      
        return res.status(500).send({error:error.message});
       
    }
}

const deleteProduct=async(req,res)=>{
    const productId=req.params.id;
    try{
      const product= await ProductService.deleteProduct(productId);
      return res.status(201).send(product);

    }catch(error){
        return res.status(500).send({error:error.message});
    }
}

const updateProduct=async(req,res)=>{
    const productId=req.params.id;
    try{
      const product= await ProductService.updateProduct(productId,req.body);
      return res.status(201).send(product);

    }catch(error){
        return res.status(500).send({error:error.message});
    }
}
const findProductByid=async(req,res)=>{
    const productId=req.params.id;
    try{
      const product= await ProductService.findProductById(productId);
      return res.status(201).send(product);

    }catch(error){
        return res.status(500).send({error:error.message});
    }
}

const getAllProduct=async(req,res)=>{
    const productId=req.params.id;
    try{
      const products= await ProductService.getAllProduct(req.query);
      return res.status(201).send(products);

    }catch(error){
        return res.status(500).send({error:error.message});
    }
}
const createMultiProduct=async(req,res)=>{
    const productId=req.params.id;
    try{
      const product= await ProductService.createMultiProduct(req.body);
      return res.status(201).send({message:"Product created succussfully"});

    }catch(error){
        return res.status(500).send({error:error.message});
    }
}

module.exports={
    createMultiProduct,
    getAllProduct,
    findProductByid,
    updateProduct,
    deleteProduct,
    createProduct
}