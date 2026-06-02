const app=require("express")();
const AI = require("./AI");
require('dotenv').config();

app.use(express.json());

app.post("/api/message", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        const aiResponse = await AI.main(message);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});