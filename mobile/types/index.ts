// Shared types for the React Native app
export interface Question {
  question: string;
  answer: string;
}

export interface CoachingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  threadId: string;
  problem: string;
  questions: Question[];
  summary?: string;
  actionPlan?: string;
  coachingMessages: CoachingMessage[];
  title: string;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type Stage = 'initial' | 'questioning' | 'summary' | 'coaching' | 'actionplan';