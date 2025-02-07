import { User, Thread, Message, InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getThreads(userId: number): Promise<Thread[]>;
  createThread(userId: number, title: string): Promise<Thread>;
  
  getMessages(threadId: number): Promise<Message[]>;
  createMessage(threadId: number, content: string, role: "user" | "assistant"): Promise<Message>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private threads: Map<number, Thread>;
  private messages: Map<number, Message>;
  sessionStore: session.Store;
  private currentId: { user: number; thread: number; message: number };

  constructor() {
    this.users = new Map();
    this.threads = new Map();
    this.messages = new Map();
    this.currentId = { user: 1, thread: 1, message: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.user++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getThreads(userId: number): Promise<Thread[]> {
    return Array.from(this.threads.values()).filter(
      (thread) => thread.userId === userId,
    );
  }

  async createThread(userId: number, title: string): Promise<Thread> {
    const id = this.currentId.thread++;
    const thread = {
      id,
      userId,
      title,
      createdAt: new Date(),
    };
    this.threads.set(id, thread);
    return thread;
  }

  async getMessages(threadId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.threadId === threadId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(
    threadId: number,
    content: string,
    role: "user" | "assistant",
  ): Promise<Message> {
    const id = this.currentId.message++;
    const message = {
      id,
      threadId,
      content,
      role,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
