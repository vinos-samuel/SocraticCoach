# Overview

This is a comprehensive Socratic thinking coach application available as both a web application and mobile app for iOS and Android app stores. The application guides users through a structured process of self-reflection by asking thoughtful questions, generating summaries, providing coaching, and creating action plans. Key features include conversation memory through threading, comprehensive export functionality, hands-free voice interaction capabilities, and cross-platform mobile deployment. It's built as a full-stack TypeScript application with a React web frontend, React Native mobile app, and Express backend.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

### Web Application
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark/light mode support
- **State Management**: React hooks for local component state
- **HTTP Client**: Custom fetch-based API client with React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Mobile Application (iOS & Android)
- **Framework**: React Native with Expo framework for cross-platform development
- **Navigation**: Expo Router for type-safe file-based routing
- **UI Components**: Custom React Native components with NativeWind for styling
- **Styling**: NativeWind (Tailwind CSS for React Native) with design system consistency
- **State Management**: TanStack Query for server state, AsyncStorage for local persistence
- **Build System**: Expo Application Services (EAS) for app store deployment
- **Platform Support**: iOS App Store and Google Play Store ready

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
- **AI Service**: Anthropic Claude API (claude-sonnet-4-20250514) for generating Socratic questions, summaries, coaching responses, and action plans
- **Database**: Neon PostgreSQL serverless database with conversation threading
- **Voice Integration**: Web Speech API for speech-to-text and text-to-speech functionality
- **UI Components**: Radix UI primitives for accessible component foundation including dialog components for voice modal
- **Development**: Replit-specific plugins for development environment integration
- **Build Tools**: esbuild for server bundling, Vite for client bundling
- **Deployment**: Node.js production server with static file serving

## Key Features
- **Socratic Questioning**: AI-powered progressive questioning system with 6-question limit
- **Conversation Threading**: Database-backed conversation memory system for contextual awareness
- **Voice Interaction**: Hands-free coaching through speech recognition and synthesis
- **Export Functionality**: Download, copy, and email sharing of sessions and action plans  
- **Cross-Platform Mobile Apps**: Native iOS and Android applications for app store deployment
- **Mobile Optimization**: Touch-friendly interface with native mobile UX patterns
- **Real-time Processing**: Live transcription and instant AI responses during voice sessions
- **App Store Deployment**: Production-ready mobile apps with EAS build system

## Mobile App Architecture
- **Entry Point**: `mobile/app/_layout.tsx` - Root navigation and providers setup
- **Main Screens**: Landing (`index.tsx`), Coaching (`coach.tsx`), History (`history.tsx`)
- **API Integration**: Shared backend endpoints with web app for consistency
- **Build Configuration**: `eas.json` for iOS App Store and Google Play Store deployment
- **Asset Management**: `mobile/assets/` directory for app icons and splash screens
- **Development Workflow**: Expo CLI with hot reload and device testing capabilities