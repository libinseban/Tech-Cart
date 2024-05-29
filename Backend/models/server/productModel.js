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
  },
  sizes: [
    {
      name: { type: String },
      quantity: { type: Number }
    }
  ],
  imageUrl: {
    type: String,
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating", // Assuming 'Rating' is the model name
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review" // Assuming 'Review' is the model name
  }],
  numRatings: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category" // Assuming 'Category' is the model name
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
