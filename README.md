# AI API Hub - Multi-Provider AI Integration Platform

## 🚀 Overview

AI API Hub is a comprehensive full-stack application that provides a unified platform for integrating and managing multiple AI providers including OpenAI, Google Gemini, DeepSeek, ElevenLabs, Anthropic, and Perplexity. The application features a separated architecture with independent frontend and backend deployments, enabling flexible cross-platform deployment.

## ✨ Features

### 🎯 Core Features
- **Multi-Provider Support**: Integrate with 6 major AI providers
- **Premium & Free Tiers**: Built-in subscription management with rate limiting
- **Real-time Monitoring**: Live provider status and performance analytics
- **Request Tracking**: Comprehensive logging and analytics for all API calls
- **Cost Management**: Track costs and usage across all providers
- **Rate Limiting**: Smart rate limiting based on user tier and provider limits

### 🏗️ Architecture Features
- **Separated Deployment**: Frontend and backend can be deployed independently
- **PostgreSQL Database**: Full data persistence with Drizzle ORM
- **Type-Safe**: Full TypeScript implementation across the stack
- **Modern UI**: Beautiful dashboard with Shadcn UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Express.js**: RESTful API server
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Database operations and migrations
- **PostgreSQL**: Primary database
- **Node.js**: Runtime environment

### Frontend
- **React**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe frontend development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Beautiful component library
- **TanStack Query**: Data fetching and state management
- **Wouter**: Lightweight routing

### AI Providers
- **OpenAI**: GPT models for text generation
- **Google Gemini**: Multi-modal AI capabilities
- **DeepSeek**: Specialized coding and reasoning models
- **ElevenLabs**: Advanced text-to-speech synthesis
- **Anthropic**: Claude models for conversation
- **Perplexity**: Real-time web search and answers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- AI Provider API keys

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/xoftion/AI-Hub.git
   cd AI-Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 🌐 Deployment

### Separated Deployment Strategy

This application is designed for independent deployment of frontend and backend components:

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Set the build command: `npm run build:server`
   - Set the start command: `npm run start:server`

2. **Environment Variables**
   Add all the environment variables from `.env.example`:
   ```
   DATABASE_URL=your-postgresql-connection-string
   OPENAI_API_KEY=your-openai-key
   GEMINI_API_KEY=your-gemini-key
   DEEPSEEK_API_KEY=your-deepseek-key
   ELEVENLABS_API_KEY=your-elevenlabs-key
   ANTHROPIC_API_KEY=your-anthropic-key
   PERPLEXITY_API_KEY=your-perplexity-key
   NODE_ENV=production
   SESSION_SECRET=your-session-secret
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

3. **Database Setup**
   - Create a PostgreSQL database on Render or external provider
   - Run migrations: `npm run db:push`

### Frontend Deployment (Vercel)

1. **Create a new project on Vercel**
   - Import your GitHub repository
   - Set the build command: `npm run build:client`
   - Set the output directory: `dist/public`

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-domain.render.com
   ```

3. **Build Settings**
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build:client`
   - Output Directory: `dist/public`

### Alternative Deployment (Netlify)

For Netlify deployment:
1. **Build Settings**
   - Build command: `npm run build:client`
   - Publish directory: `dist/public`

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-domain.render.com
   ```

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build both frontend and backend for production

### Backend Only
- `npm run build:server` - Build backend for production
- `npm run start:server` - Start production backend server

### Frontend Only  
- `npm run build:client` - Build frontend for production
- `npm run start:client` - Preview frontend build locally

### Database
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## 🔧 Configuration

### API Provider Setup

#### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `OPENAI_API_KEY` in environment variables

#### Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Add to `GEMINI_API_KEY` in environment variables

#### DeepSeek
1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Create an API key
3. Add to `DEEPSEEK_API_KEY` in environment variables

#### ElevenLabs
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Create an API key
3. Add to `ELEVENLABS_API_KEY` in environment variables

#### Anthropic
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add to `ANTHROPIC_API_KEY` in environment variables

#### Perplexity
1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Create an API key
3. Add to `PERPLEXITY_API_KEY` in environment variables

### Database Configuration

The application uses PostgreSQL with Drizzle ORM. For production deployment:

1. **Render PostgreSQL**
   - Create a PostgreSQL database instance
   - Copy the connection string to `DATABASE_URL`

2. **External PostgreSQL**
   - Use any PostgreSQL provider (AWS RDS, Google Cloud SQL, etc.)
   - Ensure the database is accessible from your deployment platform

## 🏆 Premium Features

### Free Tier
- 100 requests per month
- Access to basic models
- Standard rate limits
- Community support

### Premium Tier ($29/month)
- 10,000 requests per month
- Access to all models including latest versions
- Higher rate limits
- Priority support
- Advanced analytics
- Cost tracking and optimization

## 📊 API Endpoints

### Core Endpoints
- `GET /api/health` - Service health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/providers/status` - Provider status check
- `POST /api/ai/process` - Process AI requests
- `GET /api/requests/recent` - Recent request history

### User Management
- `GET /api/user/stats` - User usage statistics
- `POST /api/user/upgrade` - Upgrade to premium

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the XOFTION License - see the [LICENSE](https://xoftion.onrender.com/) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and community support

## 🔮 Roadmap

- [ ] Additional AI provider integrations
- [ ] Advanced analytics dashboard
- [ ] API usage optimization recommendations
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Enterprise features and SSO
- [ ] Advanced rate limiting algorithms
- [ ] Cost prediction and budgeting tools

---

Built with ❤️ by the XOFTION Team. Star ⭐ this repository if you find it helpful!
