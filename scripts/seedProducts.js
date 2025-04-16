const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
    {
        name: "AI Trading Bot",
        description: "Automated trading powered by advanced machine learning algorithms",
        price: 99,
        features: [
            "24/7 Market Monitoring",
            "Real-time Trade Execution",
            "Risk Management",
            "Performance Analytics"
        ],
        icon: "🤖"
    },
    {
        name: "Market Predictor",
        description: "AI-powered market analysis and prediction system",
        price: 149,
        features: [
            "Price Predictions",
            "Trend Analysis",
            "Market Sentiment",
            "Custom Alerts"
        ],
        icon: "📈"
    },
    {
        name: "Portfolio Optimizer",
        description: "Smart portfolio management and optimization tools",
        price: 199,
        features: [
            "Risk Assessment",
            "Asset Allocation",
            "Rebalancing",
            "Performance Tracking"
        ],
        icon: "💼"
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log('Successfully seeded products');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts(); 