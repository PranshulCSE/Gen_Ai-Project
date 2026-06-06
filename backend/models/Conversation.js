const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "model"],
            required: true,
        },
        parts: {
            type: String,
            required: true,
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const conversationSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            unique: true,
            index: true,
            default: () => randomUUID(),
        },
        messages: {
            type: [messageSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Conversation", conversationSchema);

