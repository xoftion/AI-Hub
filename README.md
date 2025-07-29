# AI API Hub - Multi-Provider AI Integration Platform

A separated full-stack application that integrates multiple AI providers (OpenAI, Gemini, DeepSeek, ElevenLabs) with independent deployment capabilities for frontend and backend.

## 🚀 Features

- **Multi-Provider Support**: Integrate with OpenAI, Google Gemini, DeepSeek, and ElevenLabs APIs
- **Real-time Dashboard**: Monitor API usage, success rates, and response times
- **API Playground**: Test different AI models with customizable parameters
- **Separated Architecture**: Frontend and backend can be deployed independently
- **Cross-Platform Deployment**: Optimized for Vercel/Netlify (frontend) and Render (backend)
- **Health Monitoring**: Real-time provider status and deployment health checks

## 🏗️ Architecture

### Backend (Express.js)
- RESTful API with JSON responses
- CORS configured for cross-origin requests
- Individual AI service integrations
- In-memory storage with extensible interface
- Health check endpoints

### Frontend (React + Vite)
- Modern React with TypeScript
- Tailwind CSS + Shadcn UI components
- TanStack Query for data fetching
- Environment-based API URL configuration

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- TanStack Query for API state management
- Wouter for routing

**Backend:**
- Express.js framework
- TypeScript
- CORS middleware
- Individual AI provider SDKs:
  - OpenAI SDK
  - Google Generative AI
  - Custom HTTP clients for DeepSeek
  - ElevenLabs integration

## 📋 Prerequisites

- Node.js 18+ 
- API keys for the AI providers you want to use:
  - OpenAI API key
  - Google Gemini API key  
  - DeepSeek API key
  - ElevenLabs API key

## 🚀 Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ai-api-hub
npm install
