# AI API Hub - Multi-Provider AI Integration Platform

## Recent Changes (January 29, 2025)

✅ **Complete AI Provider Integration**: Added all 6 major AI providers with class-based service architecture
✅ **PostgreSQL Database**: Fully configured with comprehensive schema for users, requests, subscriptions, and rate limiting
✅ **Premium Tier System**: Free (100 requests/month) and Premium ($29/month, 10,000 requests) tiers implemented
✅ **Database Schema Deployed**: Successfully pushed schema to PostgreSQL database
✅ **Comprehensive Documentation**: Created detailed README.md with deployment instructions for Render and Vercel
✅ **Environment Configuration**: Complete .env.example with all required API keys and database credentials
✅ **Production Ready**: Application ready for deployment to GitHub repository at https://github.com/xoftion/AI-Hub.git

## Overview

AI API Hub is a comprehensive full-stack application that provides a unified platform for integrating and managing multiple AI providers including OpenAI, Google Gemini, DeepSeek, ElevenLabs, Anthropic, and Perplexity. The application features a separated architecture with independent frontend and backend deployments, PostgreSQL database with premium tier management, rate limiting, and comprehensive request tracking.

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
- **AI Service Integrations**: Class-based service architecture for all 6 providers (OpenAI, Gemini, DeepSeek, ElevenLabs, Anthropic, Perplexity)
- **Storage Layer**: PostgreSQL database with Drizzle ORM for full data persistence
- **Premium Tier System**: User management with free/premium subscriptions and rate limiting
- **Health Monitoring**: Real-time provider status checks and system health endpoints
- **CORS Middleware**: Configured for cross-origin requests from multiple frontend origins
- **Request Tracking**: Comprehensive logging of all API requests with analytics

### Frontend Architecture
- **Component-Based UI**: Modular React components with TypeScript
- **State Management**: TanStack Query for server state and API interactions
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn UI library for consistent design system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Database Schema
- **Users**: User authentication and profile management with tier information
- **API Requests**: Comprehensive request logging with response time, tokens, costs, and status tracking
- **Subscriptions**: Premium tier management with billing and feature tracking
- **Rate Limits**: Dynamic rate limiting based on user tier and provider-specific limits

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
- **ElevenLabs**: Advanced text-to-speech and voice synthesis
- **Anthropic**: Claude models for conversational AI and analysis
- **Perplexity**: Real-time web search and knowledge synthesis

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
- **Production-Ready**: PostgreSQL database with full data persistence
- **Schema Management**: Drizzle ORM with type-safe database operations
- **Premium Features**: User tier management, rate limiting, and billing integration
- **Analytics**: Comprehensive request tracking and performance monitoring

### Environment Configuration
- **API Keys**: Secure storage of all 6 provider API keys (OpenAI, Gemini, DeepSeek, ElevenLabs, Anthropic, Perplexity)
- **Database**: PostgreSQL connection with full credentials
- **CORS Origins**: Configurable allowed origins for cross-deployment flexibility
- **Deployment**: Ready for Render (backend) and Vercel (frontend) deployment