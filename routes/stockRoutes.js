const express = require('express');
const router = express.Router();
const stockPrediction = require('../services/stockPrediction');

// Get prediction for a specific stock
router.get('/prediction/:symbol', async (req, res) => {
    try {
        const prediction = await stockPrediction.getPrediction(req.params.symbol);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get historical data for a specific stock
router.get('/historical/:symbol', async (req, res) => {
    try {
        const data = await stockPrediction.fetchHistoricalData(req.params.symbol);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;