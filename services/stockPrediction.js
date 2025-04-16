const axios = require('axios');
const moment = require('moment');
const openAIService = require('./openAIService');

class StockPrediction {
    constructor() {
        this.apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        this.baseUrl = 'https://www.alphavantage.co/query';
    }

    async getHistoricalData(symbol) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol,
                    apikey: this.apiKey,
                    outputsize: 'compact'
                }
            });

            const timeSeries = response.data['Time Series (Daily)'];
            const historicalData = Object.entries(timeSeries).map(([date, data]) => ({
                date,
                open: parseFloat(data['1. open']),
                high: parseFloat(data['2. high']),
                low: parseFloat(data['3. low']),
                close: parseFloat(data['4. close']),
                volume: parseInt(data['5. volume'])
            }));

            return historicalData;
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw new Error('Failed to fetch historical data');
        }
    }

    async getPrediction(symbol) {
        try {
            // Get historical data
            const historicalData = await this.getHistoricalData(symbol);
            
            // Get AI analysis
            const aiAnalysis = await openAIService.analyzeStock(symbol, historicalData);
            
            // Get market sentiment
            const newsData = await this.getNewsData(symbol);
            const sentiment = await openAIService.getMarketSentiment(symbol, newsData);
            
            // Get trading strategy
            const marketConditions = {
                historicalData,
                sentiment,
                currentPrice: historicalData[0].close
            };
            const strategy = await openAIService.generateTradingStrategy(symbol, marketConditions);

            return {
                symbol,
                currentPrice: historicalData[0].close,
                analysis: aiAnalysis,
                sentiment,
                strategy,
                historicalData: historicalData.slice(0, 30) // Last 30 days
            };
        } catch (error) {
            console.error('Error in getPrediction:', error);
            throw new Error('Failed to generate prediction');
        }
    }

    async getNewsData(symbol) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'NEWS_SENTIMENT',
                    tickers: symbol,
                    apikey: this.apiKey
                }
            });

            return response.data.feed || [];
        } catch (error) {
            console.error('Error fetching news data:', error);
            return [];
        }
    }
}

module.exports = new StockPrediction();