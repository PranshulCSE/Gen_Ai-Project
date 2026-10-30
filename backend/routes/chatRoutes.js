const express = require("express");
const chatController = require("../controllers/chatController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/start", chatController.startConversation);
router.post(
    "/message",
    validateRequest(["conversationId", "message"]),
    chatController.sendMessage
);
router.get("/history/:id", chatController.getConversationHistory);
router.delete("/:id", chatController.deleteConversation);

module.exports = router;
