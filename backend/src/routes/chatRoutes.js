const express = require("express");
const router = express.Router();
const {
  createChat,
  sendMessage,
  stopStream,
  getChats,
  getChatHistory,
  deleteChat,
  renameChat,
} = require("../controllers/chatControllers");

router.post("/chat", createChat);
router.post("/chat/:chatId/message", sendMessage);
router.post("/chat/:chatId/stop", stopStream);
router.get("/chats", getChats);
router.get("/chat/:chatId", getChatHistory);
router.delete("/chat/:chatId", deleteChat);
router.put("/chat/:chatId/rename", renameChat);

module.exports = router;
