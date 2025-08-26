import {
  users,
  conversationThreads,
  conversationMessages,
  type User,
  type UpsertUser,
  type ConversationThread,
  type InsertConversationThread,
  type ConversationMessage,
  type InsertConversationMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Conversation operations
  createThread(thread: InsertConversationThread): Promise<ConversationThread>;
  getThread(id: string): Promise<ConversationThread | undefined>;
  getUserThreads(userId: string): Promise<ConversationThread[]>;
  updateThread(id: string, updates: Partial<ConversationThread>): Promise<ConversationThread>;
  deleteThread(id: string): Promise<void>;
  
  // Message operations
  addMessage(message: InsertConversationMessage): Promise<ConversationMessage>;
  getThreadMessages(threadId: string): Promise<ConversationMessage[]>;
  
  // Convenience methods
  saveConversation(data: { threadId?: string; userId: string; problem: string; questions: string; summary?: string; actionPlan?: string; coachingMessages: string }): Promise<ConversationThread>;
  getUserConversations(userId: string): Promise<ConversationThread[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Conversation operations
  async createThread(threadData: InsertConversationThread): Promise<ConversationThread> {
    const [thread] = await db
      .insert(conversationThreads)
      .values(threadData)
      .returning();
    return thread;
  }

  async getThread(id: string): Promise<ConversationThread | undefined> {
    const [thread] = await db
      .select()
      .from(conversationThreads)
      .where(eq(conversationThreads.id, id));
    return thread;
  }

  async getUserThreads(userId: string): Promise<ConversationThread[]> {
    return await db
      .select()
      .from(conversationThreads)
      .where(eq(conversationThreads.userId, userId))
      .orderBy(desc(conversationThreads.updatedAt));
  }

  async updateThread(id: string, updates: Partial<ConversationThread>): Promise<ConversationThread> {
    const [thread] = await db
      .update(conversationThreads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversationThreads.id, id))
      .returning();
    return thread;
  }

  async deleteThread(id: string): Promise<void> {
    // Delete messages first (foreign key constraint)
    await db.delete(conversationMessages).where(eq(conversationMessages.threadId, id));
    // Then delete the thread
    await db.delete(conversationThreads).where(eq(conversationThreads.id, id));
  }

  // Message operations
  async addMessage(messageData: InsertConversationMessage): Promise<ConversationMessage> {
    const [message] = await db
      .insert(conversationMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getThreadMessages(threadId: string): Promise<ConversationMessage[]> {
    return await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.threadId, threadId))
      .orderBy(conversationMessages.createdAt);
  }

  // Convenience methods
  async saveConversation(data: { 
    threadId?: string; 
    userId: string; 
    problem: string; 
    questions: string; 
    summary?: string; 
    actionPlan?: string; 
    coachingMessages: string 
  }): Promise<ConversationThread> {
    if (data.threadId) {
      // Update existing thread
      return await this.updateThread(data.threadId, {
        problem: data.problem,
        questions: data.questions,
        summary: data.summary,
        actionPlan: data.actionPlan,
        coachingMessages: data.coachingMessages,
      });
    } else {
      // Create new thread
      return await this.createThread({
        userId: data.userId,
        problem: data.problem,
        questions: data.questions,
        summary: data.summary,
        actionPlan: data.actionPlan,
        coachingMessages: data.coachingMessages,
      });
    }
  }

  async getUserConversations(userId: string): Promise<ConversationThread[]> {
    return await this.getUserThreads(userId);
  }
}

export const storage = new DatabaseStorage();
