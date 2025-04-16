const OpenAI = require('openai');
require('dotenv').config();

class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async analyzeStock(symbol, historicalData) {
        try {
            const prompt = `Analyze the following stock data for ${symbol} and provide insights:
            ${JSON.stringify(historicalData)}
            
            Please provide:
            1. Trend analysis
            2. Key support and resistance levels
            3. Potential entry and exit points
            4. Risk assessment
            5. Short-term and long-term outlook`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional stock market analyst with expertise in technical and fundamental analysis."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to analyze stock data');
        }
    }

    async generateTradingStrategy(symbol, marketConditions) {
        try {
            const prompt = `Generate a trading strategy for ${symbol} based on the following market conditions:
            ${JSON.stringify(marketConditions)}
            
            Please provide:
            1. Entry and exit criteria
            2. Position sizing recommendations
            3. Risk management rules
            4. Stop-loss and take-profit levels
            5. Timeframe recommendations`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional trading strategist specializing in algorithmic and systematic trading."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to generate trading strategy');
        }
    }

    async getMarketSentiment(symbol, newsData) {
        try {
            const prompt = `Analyze the following news and social media data for ${symbol}:
            ${JSON.stringify(newsData)}
            
            Please provide:
            1. Overall market sentiment
            2. Key positive and negative factors
            3. Impact on short-term price movement
            4. Notable events or announcements
            5. Risk factors to consider`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a market sentiment analyst specializing in news and social media analysis."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to analyze market sentiment');
        }
    }

    async generateTradingInsights(marketData) {
        try {
            const prompt = `Analyze the following market data and provide trading insights:
            ${JSON.stringify(marketData)}
            
            Please provide:
            1. Key market trends
            2. Potential trading opportunities
            3. Risk assessment
            4. Recommended actions`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional trading analyst with expertise in market analysis and trading strategies."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to generate trading insights');
        }
    }

    async generateProductDescription(productData) {
        try {
            const prompt = `Create a compelling product description for a trading product with the following features:
            ${JSON.stringify(productData)}
            
            The description should:
            1. Highlight key benefits
            2. Explain how it helps traders
            3. Be engaging and professional
            4. Include a call to action`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional copywriter specializing in financial technology products."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to generate product description');
        }
    }
}

module.exports = new OpenAIService(); 