const Seller = require('../../models/client/seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require("express")
const router = express.Router()

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
      }
  
      const seller = await Seller.findOne({ email });
      if (!seller) {
        return res.status(400).json({ message: 'Seller does not exist' });
      }
  
      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: seller._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });
  
      res.cookie('access_token', token, {
        httpOnly: true,
   
      });
  
      res.status(200).json({ id: seller._id, data: seller, success: true, message: 'Seller signed in successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;
  

