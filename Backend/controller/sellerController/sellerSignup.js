const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../../models/client/seller');
const express = require("express");
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, name, address, phoneNumber } = req.body;

  try {
    if (!email || !password || !name || !address || !phoneNumber) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }
    console.log(req.body)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email is not valid' });
    }

   
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newSeller = new Seller({
      email,
      password: hashPassword,
      name,
      address,
      phoneNumber
    });

    const savedSeller = await newSeller.save();

    console.log('New Seller Created:', savedSeller);

    const token = jwt.sign({ userId: savedSeller._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({ id: savedSeller._id, data: savedSeller, success: true, message: 'Seller created successfully' });
  } catch (error) {
    console.error('Error during seller signup:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
