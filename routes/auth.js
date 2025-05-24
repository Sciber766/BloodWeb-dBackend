const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const path = require('path');

// Register
router.post('/register', async (req, res) => {
    try {
      const { fullName, email, password, age, gender, bloodGroup, location, phone } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        age,
        gender,
        bloodGroup,
        location,
        phone
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Login
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // GET /api/auth/verify
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ message: 'Token is valid', userId: decoded.userId });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  });
  
module.exports = router;
