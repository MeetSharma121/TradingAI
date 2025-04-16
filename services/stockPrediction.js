const axios = require('axios');
const moment = require('moment');
const aiModel = require('./aiModel');

class StockPrediction {
    constructor() {
        this.historicalData = new Map();
    }

    async getPrediction(symbol) {
        try {
            // Fetch historical data
            const data = await this.fetchHistoricalData(symbol);
            
            // Get AI prediction
            const aiPrediction = await aiModel.predict(data);
            
            // Combine AI prediction with technical analysis
            const technicalAnalysis = this.analyzeTrend(data);
            
            // Weighted combination of predictions
            const combinedPrediction = this.combinePredictions(aiPrediction, technicalAnalysis);
            
            return {
                symbol,
                trend: combinedPrediction.trend,
                confidence: combinedPrediction.confidence,
                predictedPrice: combinedPrediction.predictedPrice,
                aiConfidence: aiPrediction.confidence,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    async fetchHistoricalData(symbol) {
        // This should be replaced with actual API calls to a stock data provider
        // For demo purposes, generating mock data with more realistic patterns
        const prices = [];
        const basePrice = 100;
        const days = 60; // Increased for better AI training
        let currentPrice = basePrice;
        let trend = 0;

        for (let i = 0; i < days; i++) {
            // Add some momentum to price changes
            trend = trend * 0.95 + (Math.random() - 0.5) * 0.3;
            currentPrice += trend;
            currentPrice = Math.max(currentPrice, 1); // Ensure price stays positive

            prices.push({
                date: moment().subtract(days - i, 'days').format('YYYY-MM-DD'),
                price: currentPrice
            });
        }

        this.historicalData.set(symbol, prices);
        
        // Train the AI model with the new data
        await aiModel.train(prices);
        
        return prices;
    }

    analyzeTrend(data) {
        const prices = data.map(d => d.price);
        const len = prices.length;
        
        // Calculate multiple technical indicators
        const shortTermMA = this.calculateMA(prices.slice(-5));
        const mediumTermMA = this.calculateMA(prices.slice(-10));
        const longTermMA = this.calculateMA(prices.slice(-20));
        
        // Determine trend using multiple timeframes
        const shortTrend = shortTermMA > mediumTermMA;
        const longTrend = mediumTermMA > longTermMA;
        
        const trend = (shortTrend && longTrend) ? 'up' : (!shortTrend && !longTrend) ? 'down' : 'neutral';
        
        // Calculate confidence based on trend strength and consistency
        const trendStrength = Math.abs(shortTermMA - longTermMA) / longTermMA;
        const confidence = Math.min(trendStrength * 5, 0.95);
        
        // Predict next price using technical analysis
        const lastPrice = prices[prices.length - 1];
        const momentum = (shortTermMA - mediumTermMA) + (mediumTermMA - longTermMA);
        const predictedPrice = lastPrice + momentum;

        return {
            trend,
            confidence,
            predictedPrice
        };
    }

    combinePredictions(aiPrediction, technicalAnalysis) {
        // Weight the predictions (giving more weight to AI)
        const aiWeight = 0.7;
        const technicalWeight = 0.3;

        const predictedPrice = (aiPrediction.nextDayPrice * aiWeight) + 
                             (technicalAnalysis.predictedPrice * technicalWeight);

        const confidence = (aiPrediction.confidence * aiWeight) +
                         (technicalAnalysis.confidence * technicalWeight);

        const trend = predictedPrice > technicalAnalysis.predictedPrice ? 'up' : 'down';

        return {
            trend,
            confidence,
            predictedPrice
        };
    }

    calculateMA(prices) {
        return prices.reduce((a, b) => a + b, 0) / prices.length;
    }
}

module.exports = new StockPrediction();