# Overview

This is a Socratic thinking coach web application that helps users work through problems using the Socratic method. The application guides users through a structured process of self-reflection by asking thoughtful questions, generating summaries, providing coaching, and creating action plans. It's built as a full-stack TypeScript application with a React frontend and Express backend.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark/light mode support
- **State Management**: React hooks for local component state
- **HTTP Client**: Custom fetch-based API client with React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **AI Integration**: Anthropic Claude API for generating Socratic questions and responses
- **Development Tools**: Custom Vite integration for hot reload in development
- **Error Handling**: Centralized error middleware with structured error responses
- **Logging**: Custom request logging middleware for API endpoints

## Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Storage**: MemStorage class for development/testing with user management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **User Schema**: Basic user model with username/password authentication
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations

## External Dependencies
- **AI Service**: Anthropic Claude API for generating Socratic questions, summaries, coaching responses, and action plans
- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development**: Replit-specific plugins for development environment integration
- **Build Tools**: esbuild for server bundling, Vite for client bundling
- **Deployment**: Node.js production server with static file serving