const express = require('express');
const router = express.Router();
const { sellerAddProduct } = require('../../controller/sellerController/sellerControl');

router.post('/:sellerId/add-products', async (req, res) => {
    try {
        const { sellerId, productData } = req.body;
        const product = await sellerAddProduct(sellerId, productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
