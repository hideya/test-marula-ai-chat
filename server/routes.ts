import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { getChatResponse, generateThreadTitle } from "./openai";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/threads", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const threads = await storage.getThreads(req.user.id);
    res.json(threads);
  });

  app.post("/api/threads", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const thread = await storage.createThread(req.user.id, "New Chat");
    res.json(thread);
  });

  app.get("/api/threads/:threadId/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const messages = await storage.getMessages(parseInt(req.params.threadId));
    res.json(messages);
  });

  app.post("/api/threads/:threadId/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const threadId = parseInt(req.params.threadId);
    const { content } = req.body;

    // Create user message
    const userMessage = await storage.createMessage(threadId, content, "user");

    // Get thread messages for context
    const messages = await storage.getMessages(threadId);
    const chatMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Get AI response
    const aiResponse = await getChatResponse(chatMessages);
    const assistantMessage = await storage.createMessage(
      threadId,
      aiResponse,
      "assistant"
    );

    // Generate and update thread title
    const newTitle = await generateThreadTitle(chatMessages);
    console.log("Generating new title:", newTitle); // デバッグログ
    const updatedThread = await storage.updateThreadTitle(threadId, newTitle);
    console.log("Updated thread:", updatedThread); // デバッグログ

    res.json([userMessage, assistantMessage]);
  });

  const httpServer = createServer(app);
  return httpServer;
}