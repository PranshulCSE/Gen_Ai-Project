const GoogleGenAI = require('@google/genai');

require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;

if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in environment/.env');
}
if (!model) {
    throw new Error('Missing GEMINI_MODEL in environment/.env');
}
const ai = new GoogleGenAI({ apiKey });

async function main(message) {
    const response = await ai.models.generateContent({
        model,
        contents: message,
    });

    return response.text;
}

module.exports = {
    main,
};