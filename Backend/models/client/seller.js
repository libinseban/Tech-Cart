const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false 
    },
   
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
