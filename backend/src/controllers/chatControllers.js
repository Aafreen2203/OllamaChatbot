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

  const controller = new AbortController();
  abortControllers[chatId] = controller;

  await prisma.message.create({
    data: {
      chatId,
      role: "user",
      content,
    },
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
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
          chatId,
          role: "assistant",
          content: fullResponse,
        },
      });
      res.end();
    });
  } catch (err) {
    if (err.name === "AbortError") {
      res.write(`data: [Stopped by user]\n\n`);
      res.end();
    } else {
      console.error("Error:", err.message);
      res.status(500).json({ error: "Streaming failed" });
    }
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
