const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role, address, phone } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Create new user (password will be hashed by the model hook)
    const newUser = await User.create({
      email,
      password,
      name,
      role: role || 'CUSTOMER',
      address: address || '',
      phone: phone || ''
    });

    // Return user without password
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      createdAt: newUser.created_at
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Load private key
    let privateKey;
    try {
      privateKey = fs.readFileSync('/app/keys/jwt-private.key', 'utf8');
    } catch (error) {
      // Fallback for local development
      try {
        privateKey = fs.readFileSync('./keys/jwt-private.key', 'utf8');
      } catch (err) {
        try {
          privateKey = fs.readFileSync('../../keys/jwt-private.key', 'utf8');
        } catch (e) {
          return res.status(500).json({
            error: 'JWT key not configured'
          });
        }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '24h'
      }
    );

    // Return token and user info
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user info from token
 */
router.get('/me', async (req, res) => {
  // This will be populated by API Gateway after JWT verification
  const userInfo = req.headers.user ? JSON.parse(req.headers.user) : null;

  if (!userInfo) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await User.findByPk(userInfo.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    address: user.address,
    createdAt: user.created_at
  };

  res.json(userResponse);
});

module.exports = router;
