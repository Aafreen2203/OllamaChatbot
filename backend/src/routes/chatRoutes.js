const express = require("express");
const router = express.Router();
const {
  createChat,
  sendMessage,
  stopStream,
  getChats,
  getChatHistory,
} = require("../controllers/chatControllers");

router.post("/chat", createChat);
router.post("/chat/:chatId/message", sendMessage);
router.post("/chat/:chatId/stop", stopStream);
router.get("/chats", getChats);
router.get("/chat/:chatId", getChatHistory);

module.exports = router;
