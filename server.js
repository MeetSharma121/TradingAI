const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const stockRoutes = require('./routes/stockRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const stockPrediction = require('./services/stockPrediction');
const WebSocketService = require('./services/webSocketService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Detailed logging
app.use(morgan('dev'));
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('Port:', process.env.PORT || 3000);

// Security middleware with relaxed settings for development
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors({
    origin: '*', // Allow all origins in development
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - add detailed logging
app.use(express.static('public', {
    setHeaders: (res, path) => {
        res.set('X-Content-Type-Options', 'nosniff');
    },
    extensions: ['html', 'htm']
}));

console.log('Static directory:', path.join(__dirname, 'public'));

// MongoDB Connection with retry logic
const connectMongoDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradingai';
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        if (err.name === 'MongooseServerSelectionError') {
            console.error('\nPossible solutions:');
            console.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
            console.error('2. Verify your MongoDB Atlas cluster is running');
            console.error('3. Check your internet connection');
            console.error('4. Verify your MongoDB connection string is correct\n');
        }
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectMongoDB, 5000);
    }
};

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

connectMongoDB();

// Initialize WebSocket service with error handling
try {
    const wsService = new WebSocketService(server);
    console.log('WebSocket service initialized');
} catch (err) {
    console.error('WebSocket initialization error:', err);
}

// Routes with logging
app.use('/api/stocks', (req, res, next) => {
    console.log('Stock route accessed:', req.path);
    next();
}, stockRoutes);

app.use('/api/auth', (req, res, next) => {
    console.log('Auth route accessed:', req.path);
    next();
}, authRoutes);

app.use('/api', productRoutes);

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Integrate with a CRM system
        
        // For now, we'll just log the submission
        console.log('Contact form submission:', { name, email, subject, message });
        
        res.status(200).json({ message: 'Message received successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to process contact form' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Serve index.html with detailed error handling
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath, err => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).send('Error loading page');
        }
    });
});

// 404 handler with logging
app.use((req, res) => {
    console.log('404 Not Found:', req.path);
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware with detailed logging
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message,
        path: req.path
    });
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Local URL: http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.log('Port is already in use. Retrying with different port...');
        setTimeout(() => {
            server.close();
            server.listen(PORT + 1);
        }, 1000);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Keep the process running in development
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});