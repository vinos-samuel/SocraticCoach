import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Conversation threads - each represents a complete thinking session
export const conversationThreads = pgTable("conversation_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"), // Optional - for anonymous users this can be null
  title: text("title").notNull(), // Auto-generated from problem description
  problem: text("problem").notNull(), // Original problem description
  status: text("status").notNull().default("active"), // active, completed, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual messages within a conversation thread
export const conversationMessages = pgTable("conversation_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  type: text("type").notNull(), // "question", "answer", "summary", "action_plan", "coaching"
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Store additional data like question number, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const conversationThreadsRelations = relations(conversationThreads, ({ one, many }) => ({
  user: one(users, {
    fields: [conversationThreads.userId],
    references: [users.id],
  }),
  messages: many(conversationMessages),
}));

export const conversationMessagesRelations = relations(conversationMessages, ({ one }) => ({
  thread: one(conversationThreads, {
    fields: [conversationMessages.threadId],
    references: [conversationThreads.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversationThreadSchema = createInsertSchema(conversationThreads).pick({
  userId: true,
  title: true,
  problem: true,
  status: true,
});

export const insertConversationMessageSchema = createInsertSchema(conversationMessages).pick({
  threadId: true,
  type: true,
  content: true,
  metadata: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ConversationThread = typeof conversationThreads.$inferSelect;
export type InsertConversationThread = z.infer<typeof insertConversationThreadSchema>;
export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type InsertConversationMessage = z.infer<typeof insertConversationMessageSchema>;
