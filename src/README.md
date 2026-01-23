# /src

<p align="center">
🆕 Now with RESTful API!
</p>

A Discord bot that fixes sites with broken preview by providing more detailed images and webpage content. Supports multiple popular sites in Taiwan, East Asia. 

## Setup

1. Configure `.env`:

2. Start both services:
```bash
npm install
npm start
```

Or start separately:
```bash
# Terminal 1 - API Server
npm run start:api

# Terminal 2 - Discord Bot
npm run start:bot
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
# Discord Bot Configuration
DCTK=DiscordBotToken
DCID=DiscordBotClientID
DCWH=https://Discord.Private.Webhook.URL

# For local dev keep localhost;
# For docker-compose set BOT_USE_API_URL=http://api:3000
# Bot/client-specific API URL (used by /src components to call the API)
BOT_USE_API_URL=http://localhost:3000

# Bahamut Configuration
BHUD=BahamutID
BHPD=BahamutSecret

# For local dev keep localhost;
# For docker-compose set API_PUBLIC_URL=http://api:3000
# API server public URL (used by clients to reach the API)
API_PUBLIC_URL=http://localhost:3000

# API Server Configuration
API_PORT=3000

# Support a bypass (useful for tunnels) when set to the literal string 'true'
API_ALLOW_ALL=true

# Comma-separated list of IPs (exact matches) to allow API access.
# Example: API_WHITELIST=192.168.1.100,10.0.0.2
# (leave empty to only allow localhost)
API_WHITELIST=

# Node Environment (development or production)
NODE_ENV=development
```
