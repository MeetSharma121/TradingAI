require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID
});

async function testOpenAI() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: "Hello, can you confirm if the API is working?"
                }
            ],
            temperature: 0.7,
            max_tokens: 100
        });

        console.log('OpenAI API Test Successful!');
        console.log('Response:', response.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI API Test Failed:', error.message);
    }
}

testOpenAI(); 