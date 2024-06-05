const mongoose = require('mongoose');
const Seller = require('../../models/client/seller');
const Product = require('../../models/server/productModel');

const sellerAddProduct = async (sellerId, productData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            title,
            description,
            price,
            discountPrice,
            discountPercentage,
            quantity,
            brand,
            color,
            sizes,
            imageUrl,
            category
        } = productData;

        if (!title || !description || !price || !quantity || !brand || !category) {
            throw new Error('Missing required product fields');
        }

        // Find the seller by ID
        const seller = await Seller.findById(sellerId).session(session);
        if (!seller) {
            throw new Error('Seller not found');
        }

        // Create the new product
        const product = new Product({
            title,
            description,
            price,
            discountPrice,
            discountPercentage,
            quantity,
            brand,
            color,
            sizes,
            imageUrl,
            category,
            seller: sellerId
        });

        // Save the product
        const savedProduct = await product.save({ session });

        // Add product to seller's products array
        seller.products.push(savedProduct._id);
        await seller.save({ session });

        await session.commitTransaction();
        session.endSession();

        return savedProduct;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(`Failed to add product: ${error.message}`);
    }
};

module.exports = { sellerAddProduct };
