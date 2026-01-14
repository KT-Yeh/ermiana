<h1 align="center">
    <img width="120" height="120" src="pic/logo.svg" alt=""><br>
    ermiana
</h1>

<p align="center">
    <a href="https://github.com/canaria3406/ermiana/blob/master/LICENSE"><img src="https://img.shields.io/github/license/canaria3406/ermiana?style=flat-square"></a>
    <a href="https://github.com/canaria3406/ermiana"><img src="https://img.shields.io/github/stars/canaria3406/ermiana?style=flat-square"></a>
    <a href="https://discord.com/application-directory/1078919650764652594"><img src="https://img.shields.io/badge/verified-%E2%9C%93%20BOT-7289da?style=flat-square&logo=discord&logoColor=white"></a>
    <a href="https://discord.com/application-directory/1078919650764652594"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fermiana.deno.dev%2F&style=flat-square&logo=Discord&logoColor=white&cacheSeconds=86400"></a>
    <a href="https://discord.gg/QBwjpHcMyw"><img src="https://img.shields.io/discord/1172363356406042684?style=flat-square&logo=Discord&logoColor=white&label=support&color=yellow"></a>
</p>

**🆕 Now with RESTful API!** 

A Discord bot that fixes sites with broken preview by providing more detailed images and webpage content. Supports multiple popular sites in Taiwan, East Asia. 

![demo](pic/demo20.png)

## Invite BOT

[discord.com/application-directory/1078919650764652594](https://discord.com/application-directory/1078919650764652594)

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
npm run start:djs
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

## Policies

- [Privacy Policy](doc/privacy-policy.md)
- [Terms of Service](doc/terms-of-service.md)
- [隱私權政策](doc/privacy-policy-zh_tw.md)
- [服務條款](doc/terms-of-service-zh_tw.md)

## Screenshot

![demo](pic/demo21.png)

![demo](pic/demo22.png)

![demo](pic/demo25.png)

![demo](pic/demo3.png)

![demo](pic/demo24.png)

![demo](pic/demo23.png)

## Support

- [x] Community
  - [x] PTT.cc
    - [x] 八卦板
    - [x] 希洽板
    - [x] 裏洽板
    - [x] 西斯板
    - [x] 政黑板
    - [x] 表特板
    - [x] JAV板
    - [x] HG板
    - [x] DMMG板
  - [x] 巴哈姆特電玩資訊站
    - [x] 場外休憩區
  - [x] Bilibili 專欄
  - [ ] Dcard
- [x] Social media
  - [x] Plurk
  - [x] Twitter
  - [x] Misskey
  - [x] Bluesky
  - [x] Weibo
  - [x] instagram
  - [x] tiktok
  - [x] threads
- [x] Image sharing service
  - [x] Pixiv
  - [x] ehentai
  - [x] exhentai
  - [ ] nhentai
- [x] E-commerce site
  - [x] PChome24h
