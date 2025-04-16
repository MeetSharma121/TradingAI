const OpenAI = require('openai');
require('dotenv').config();

class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
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