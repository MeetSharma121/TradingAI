const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(verified.userId);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add favorite stock
router.post('/favorites', authenticateToken, async (req, res) => {
    try {
        const { symbol } = req.body;
        const user = req.user;

        if (!user.favoriteStocks.some(stock => stock.symbol === symbol)) {
            user.favoriteStocks.push({ symbol });
            await user.save();
        }

        res.json(user.favoriteStocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove favorite stock
router.delete('/favorites/:symbol', authenticateToken, async (req, res) => {
    try {
        const { symbol } = req.params;
        const user = req.user;

        user.favoriteStocks = user.favoriteStocks.filter(
            stock => stock.symbol !== symbol
        );
        await user.save();

        res.json(user.favoriteStocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get prediction history
router.get('/predictions', authenticateToken, async (req, res) => {
    try {
        res.json(req.user.predictionHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;