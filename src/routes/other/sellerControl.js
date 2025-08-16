const express = require('express');
const pendingSellers = express.Router();
const UserModel = require('../../models/client/userModel');


pendingSellers.get('/pending', async (req, res) => {
    try {
        const pendingSellers = await UserModel.find({ isApproved: false });

        if (pendingSellers.length === 0) {
            return res.json({ message: "There are no pending sellers" });
        }
        res.json({pendingSellers});
    } catch (error) {
        console.error('Error fetching pending sellers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


pendingSellers.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    try {
        await Seller.findByIdAndUpdate(userId, { isApproved: true });
        res.status(200).json({ message: 'Seller approved successfully' });
    } catch (error) {
        console.error('Error approving seller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

pendingSellers.get('/approved', async (req, res) => {
    try {
        const approvedSellers = await UserModel.find({ isApproved: true });

        if (approvedSellers.length === 0) {
            return res.json({ message: "There are no approved sellers" });
        }
        res.json({approvedSellers});
    } catch (error) {
        console.error('Error fetching pending sellers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


pendingSellers.patch('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    try {
        await Seller.findByIdAndUpdate(userId, { isApproved: false });
        res.status(200).json({ message: 'Seller approved successfully' });
    } catch (error) {
        console.error('Error approving seller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = pendingSellers;
