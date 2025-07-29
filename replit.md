# AI API Hub - Multi-Provider AI Integration Platform

## Overview

AI API Hub is a full-stack application that provides a unified platform for integrating and managing multiple AI providers including OpenAI, Google Gemini, DeepSeek, and ElevenLabs. The application features a separated architecture with independent frontend and backend deployments, enabling cross-platform deployment flexibility.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Separated Full-Stack Architecture
The system follows a decoupled architecture pattern where frontend and backend can be deployed independently:

- **Frontend**: React SPA deployed to static hosting platforms (Vercel/Netlify)
- **Backend**: Express.js RESTful API deployed to server platforms (Render)
- **Communication**: Cross-origin requests with CORS configuration
- **Database**: PostgreSQL with Drizzle ORM (configurable, currently using in-memory storage)

### Technology Stack Decision Rationale
- **React + TypeScript**: Chosen for type safety and modern development experience
- **Vite**: Selected for fast build times and excellent developer experience
- **Express.js**: Lightweight and flexible for RESTful API development
- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **Tailwind CSS + Shadcn UI**: Rapid UI development with consistent design system

## Key Components

### Backend Services
- **AI Service Integrations**: Individual service classes for each provider (OpenAI, Gemini, DeepSeek, ElevenLabs)
- **Storage Layer**: Extensible interface with in-memory implementation (IStorage interface allows easy database integration)
- **Health Monitoring**: Real-time provider status checks and system health endpoints
- **CORS Middleware**: Configured for cross-origin requests from multiple frontend origins

### Frontend Architecture
- **Component-Based UI**: Modular React components with TypeScript
- **State Management**: TanStack Query for server state and API interactions
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn UI library for consistent design system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Database Schema
- **Users**: Authentication and user management
- **API Requests**: Request logging and analytics tracking
- **Provider Configs**: AI provider settings and configuration management

## Data Flow

### Request Processing Flow
1. **Client Request**: Frontend sends AI requests through API client
2. **Route Handling**: Express router processes requests and validates input
3. **Provider Delegation**: Request routed to appropriate AI service handler
4. **External API Call**: Service makes authenticated request to AI provider
5. **Response Processing**: Response normalized and returned with metadata
6. **Analytics Tracking**: Request details stored for monitoring and analytics

### Real-time Monitoring
- Health check endpoints poll provider status
- Dashboard displays real-time statistics and provider availability
- Request history and performance metrics tracked and displayed

## External Dependencies

### AI Provider APIs
- **OpenAI**: GPT models for text generation and image analysis
- **Google Gemini**: Multi-modal AI for text and image processing
- **DeepSeek**: Specialized models for coding and reasoning tasks
- **ElevenLabs**: Text-to-speech and voice synthesis

### Development Dependencies
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Backend bundling for production deployment
- **Vite**: Frontend build tooling and development server

## Deployment Strategy

### Independent Deployment Pattern
The architecture supports separate deployment of frontend and backend components:

### Frontend Deployment
- **Target Platforms**: Vercel, Netlify, or other static hosting
- **Build Process**: Vite builds static assets to `dist/public`
- **Environment Configuration**: API URL configured via environment variables
- **Cross-Origin Setup**: CORS configured for multiple deployment origins

### Backend Deployment
- **Target Platforms**: Render, Railway, or other Node.js hosting
- **Build Process**: ESBuild bundles server code for production
- **Environment Variables**: AI provider API keys and database configuration
- **Health Monitoring**: Built-in health check endpoints for deployment platforms

### Database Strategy
- **Development**: In-memory storage for rapid development
- **Production**: PostgreSQL with Drizzle ORM migrations
- **Flexibility**: Storage interface allows easy swapping of implementations

### Environment Configuration
- **API Keys**: Secure storage of provider API keys
- **CORS Origins**: Configurable allowed origins for cross-deployment flexibility
- **Database URLs**: Environment-based database connection configuration