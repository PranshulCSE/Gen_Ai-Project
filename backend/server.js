require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
let server;
let isShuttingDown = false;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/chat', chatRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

async function start() {
    await connectDB();

    const port = process.env.PORT || 3000;
    server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

async function shutdown(signal) {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}. Shutting down gracefully...`);

    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }

    await mongoose.connection.close(false);
    process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

module.exports = app;