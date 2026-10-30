const mongoose = require("mongoose");

const connectDB = async () => {
    const { MONGODB_URI } = process.env;

    if (!MONGODB_URI) {
        throw new Error("Missing MONGODB_URI in environment");
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;