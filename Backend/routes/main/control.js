const express = require('express');
const router = express.Router();
const Seller = require('../../models/client/seller');


router.get('/pendingSellers', async (req, res) => {
    try {
        const pendingSellers = await Seller.find({ isApproved: false });
        res.json(pendingSellers);
    } catch (error) {
        console.error('Error fetching pending sellers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/approveSeller/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Seller.findByIdAndUpdate(id, { isApproved: true });
        res.status(200).json({ message: 'Seller approved successfully' });
    } catch (error) {
        console.error('Error approving seller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
