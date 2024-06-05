const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
    },
    isApproved: {
        type: Boolean,
        default: false 
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true }, {
    useFindAndModify: false, 
  });

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
