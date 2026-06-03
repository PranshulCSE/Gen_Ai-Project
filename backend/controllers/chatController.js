const Conversation = require("../models/Conversation");
const { generateReply } = require("../services/geminiService");

const startConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.create({});

        return res.status(201).json({
            message: "Conversation started",
            conversationId: conversation.conversationId,
        });
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { conversationId, message } = req.body;

        const conversation = await Conversation.findOne({ conversationId });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const history = conversation.messages;
        const aiReply = await generateReply(history, message);

        conversation.messages.push(
            {
                role: "user",
                parts: message,
                timestamp: new Date(),
            },
            {
                role: "model",
                parts: aiReply,
                timestamp: new Date(),
            }
        );

        await conversation.save();

        return res.status(200).json({
            message: "Response generated successfully",
            conversationId: conversation.conversationId,
            reply: aiReply,
            conversation: conversation.messages,
        });
    } catch (error) {
        next(error);
    }
};

const getConversationHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findOne({ conversationId: id });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        return res.status(200).json({
            conversationId: conversation.conversationId,
            messages: conversation.messages,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};

const deleteConversation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findOneAndDelete({ conversationId: id });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        return res.status(200).json({
            message: "Conversation deleted successfully",
            conversationId: id,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startConversation,
    sendMessage,
    getConversationHistory,
    deleteConversation,
}; 