import { User, Thread, Message, InsertUser } from "@shared/schema";
import session from "express-session";
import { users, threads, messages } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

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

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getThreads(userId: number): Promise<Thread[]> {
    return await db
      .select()
      .from(threads)
      .where(eq(threads.userId, userId))
      .orderBy(threads.createdAt, "desc");  // createdAtで降順ソート
  }

  async createThread(userId: number, title: string): Promise<Thread> {
    const [thread] = await db
      .insert(threads)
      .values({ userId, title })
      .returning();
    return thread;
  }

  async getMessages(threadId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(messages.createdAt);
  }

  async createMessage(
    threadId: number,
    content: string,
    role: "user" | "assistant",
  ): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({ threadId, content, role })
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();