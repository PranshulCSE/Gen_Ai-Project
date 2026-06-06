const { GoogleGenerativeAI } = require("@google/generative-ai");


const apiKey = process.env.GEMINI_API_KEY;
const configuredModelName = process.env.GEMINI_MODEL;
const fallbackModelNames = [
    configuredModelName,
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
].filter(Boolean);

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

function createFallbackReply(prompt, reason) {
    const topic = String(prompt || '').trim();
    const focus = topic ? `about "${topic}"` : 'for your request';

    return [
        `I could not reach Gemini right now because ${reason}.`,
        `Local fallback reply ${focus}:`,
        'I can still help with a quick overview, key points, travel tips, or a structured summary if you want to keep going.',
    ].join(' ');
}

async function generateReply(messages, prompt) {
    const history = toGeminiHistory(messages);
    let lastError;

    for (const modelName of fallbackModelNames) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const chat = model.startChat({ history });
            const result = await chat.sendMessage(prompt);

            return result.response.text();
        } catch (error) {
            lastError = error;

            const message = String(error?.message || '');
            if (!message.includes('not found') && !message.includes('404')) {
                if (message.includes('429') || message.toLowerCase().includes('quota')) {
                    return createFallbackReply(prompt, 'your Gemini API quota is exhausted');
                }

                throw error;
            }
        }
    }

    if (lastError) {
        const message = String(lastError.message || '');
        if (message.includes('429') || message.toLowerCase().includes('quota')) {
            return createFallbackReply(prompt, 'your Gemini API quota is exhausted');
        }
    }

    throw lastError || new Error('Unable to generate a Gemini reply');
}

module.exports = {
    generateReply,
    toGeminiHistory,
};