const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    discountPercentage: { 
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "rating",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
    }],
    numRatings: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
