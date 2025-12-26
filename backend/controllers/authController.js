// --- 1. Imports (CommonJS) ---
const dbPool = require('../config/db'); // MySQL Connection Pool
const bcrypt = require('bcryptjs');     // For hashing passwords
const jwt = require('jsonwebtoken');    // For creating auth tokens

// --- 2. Helper Function (Token & Cookie) ---
// This function creates a token and sends it in a secure HttpOnly cookie
const createTokenAndSendCookie = (res, userId) => {
  const payload = {
    user: {
      id: userId,
    },
  };

  // Sign the token with your secret key (from .env)
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 hour
  });

  // Send the token in a secure HttpOnly cookie
  res.cookie('token', token, {
    httpOnly: true, // Cannot be accessed by client-side JS
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Protects against CSRF
    maxAge: 86400000, // 1 hour (in milliseconds)
  });
};

// --- 3. Controller Logic ---

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 */
exports.signup = async (req, res) => {
  const { nom, email, motdepass } = req.body;

  try {
    // --- A. Validation (Your requests) ---
    if (!nom || !email || !motdepass) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    // A1. Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // A2. Password Regex Validation (min 8 chars, letters + numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(motdepass)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include letters and numbers.',
      });
    }

    // --- B. Check for existing user ---
    const [existingUser] = await dbPool.query(
      'SELECT email FROM user WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email is already in use.' }); // 409 Conflict
    }

    // --- C. Hash the password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motdepass, salt);

    // --- D. Insert user into Database ---
    const [result] = await dbPool.query(
      'INSERT INTO user (nom, email, motdepass) VALUES (?, ?, ?)',
      [nom, email, hashedPassword]
    );

    const newUserId = result.insertId;

    // --- E. Log in the user (create token/cookie) ---
    createTokenAndSendCookie(res, newUserId);

    res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: newUserId,
        nom: nom,
        email: email,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { email, motdepass } = req.body;

  try {
    // 1. Check fields
    if (!email || !motdepass) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    // 2. Find user
    const [users] = await dbPool.query('SELECT * FROM user WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // 401 Unauthorized
    }

    const user = users[0];

    // 3. Check password
    const isMatch = await bcrypt.compare(motdepass, user.motdepass);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Create and send token/cookie
    createTokenAndSendCookie(res, user.id);

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Log a user out
 * @route   POST /api/auth/logout
 */
exports.logout = (req, res) => {
  // To log out, we clear the cookie by setting an expiration date in the past
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logout successful.' });
};

/**
 * @desc    Check if a user is authenticated
 * @route   GET /api/auth/check
 */
exports.checkAuth = async (req, res) => {
  // This route checks if the 'token' cookie is valid
  // We need to install 'cookie-parser' middleware for req.cookies
  // (We will do that after this file)
  
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided.' });
  }

  try {
    // 1. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Token is valid, fetch fresh user data (without the password)
    const [users] = await dbPool.query(
      'SELECT id, nom, email FROM user WHERE id = ?',
      [decoded.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('CheckAuth Error:', error);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};