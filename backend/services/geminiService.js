const { GoogleGenerativeAI } = require("@google/generative-ai");


const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in environment/.env');
}

const genAI = new GoogleGenerativeAI(apiKey);

function toGeminiHistory(messages = []) {
    return messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.parts }],
    }));
}

async function generateReply(messages, prompt) {
    const model = genAI.getGenerativeModel({ model: modelName });
    const history = toGeminiHistory(messages);
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);

    return result.response.text();
}

module.exports = {
    generateReply,
    toGeminiHistory,
};