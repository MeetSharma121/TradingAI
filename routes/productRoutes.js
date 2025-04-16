const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const openAIService = require('../services/openAIService');

// Get all products with AI-enhanced descriptions
router.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        
        // Enhance product descriptions using OpenAI
        const enhancedProducts = await Promise.all(products.map(async (product) => {
            try {
                const enhancedDescription = await openAIService.generateProductDescription({
                    name: product.name,
                    features: product.features,
                    price: product.price
                });
                
                return {
                    ...product.toObject(),
                    enhancedDescription
                };
            } catch (error) {
                console.error('Error enhancing product description:', error);
                return product;
            }
        }));
        
        res.json(enhancedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get a single product with AI-enhanced description
router.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        try {
            const enhancedDescription = await openAIService.generateProductDescription({
                name: product.name,
                features: product.features,
                price: product.price
            });

            res.json({
                ...product.toObject(),
                enhancedDescription
            });
        } catch (error) {
            console.error('Error enhancing product description:', error);
            res.json(product);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

module.exports = router; 