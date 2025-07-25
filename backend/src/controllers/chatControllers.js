const prisma = require("../db");
const axios = require("axios");

let abortControllers = {};

exports.createChat = async (req, res) => {
  const chat = await prisma.chat.create({
    data: { title: `Chat ${Date.now()}` },
  });
  res.json(chat);
};

exports.sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  console.log(`Sending message to chat ${chatId}: ${content}`);

  const controller = new AbortController();
  abortControllers[chatId] = controller;

  try {
    // Store user message
    await prisma.message.create({
      data: {
        chatId: chatId,
        role: "user",
        content,
      },
    });

    // Check if this is the first message in the chat and update title
    const messageCount = await prisma.message.count({
      where: { chatId: chatId },
    });

    if (messageCount === 1) {
      // This is the first message, generate a title from it
      const title =
        content.length > 50 ? content.substring(0, 47) + "..." : content;
      await prisma.chat.update({
        where: { id: chatId },
        data: { title: title },
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "sam860/amoral-gemma3-1b-v2",
        prompt: content,
        stream: true,
      },
      {
        responseType: "stream",
        signal: controller.signal,
      }
    );

    let fullResponse = "";
    response.data.on("data", async (chunk) => {
      const text = chunk
        .toString()
        .trim()
        .split("\n")
        .map((line) => {
          try {
            const json = JSON.parse(line);
            return json.response || "";
          } catch {
            return "";
          }
        })
        .join("");

      fullResponse += text;
      res.write(`data: ${text}\n\n`);
    });

    response.data.on("end", async () => {
      await prisma.message.create({
        data: {
          chatId: chatId,
          role: "assistant",
          content: fullResponse,
        },
      });
      res.end();
      delete abortControllers[chatId];
    });
  } catch (err) {
    if (err.name === "AbortError") {
      res.write(`data: [Stopped by user]\n\n`);
      res.end();
    } else {
      console.error("Error:", err.message);
      res.status(500).json({ error: "Streaming failed" });
    }
    delete abortControllers[chatId];
  }
};

exports.stopStream = (req, res) => {
  const { chatId } = req.params;
  if (abortControllers[chatId]) {
    abortControllers[chatId].abort();
    delete abortControllers[chatId];
    res.json({ message: "Stream stopped" });
  } else {
    res.status(404).json({ message: "No active stream to stop" });
  }
};

exports.getChats = async (req, res) => {
  const chats = await prisma.chat.findMany({ orderBy: { createdAt: "desc" } });
  res.json(chats);
};

exports.getChatHistory = async (req, res) => {
  const { chatId } = req.params;
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: "asc" },
  });
  res.json(messages);
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    // First delete all messages in the chat
    await prisma.message.deleteMany({
      where: { chatId: chatId },
    });

    // Then delete the chat itself
    await prisma.chat.delete({
      where: { id: chatId },
    });

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};

exports.renameChat = async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;

  try {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title: title.trim() },
    });

    res.json(updatedChat);
  } catch (error) {
    console.error("Error renaming chat:", error);
    res.status(500).json({ error: "Failed to rename chat" });
  }
};
