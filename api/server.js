import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { configManager } from '../src/utils/configManager.js';
import { initializeBahaAuth } from './utils/bahaAuth.js';
import twitterRouter from './routes/twitterRoutes.js';
import pixivRouter from './routes/pixivRoutes.js';
import plurkRouter from './routes/plurkRoutes.js';
import blueskyRouter from './routes/blueskyRoutes.js';
import bahaRouter from './routes/bahaRoutes.js';
import ehRouter from './routes/ehRoutes.js';
import pchomeRouter from './routes/pchomeRoutes.js';
import misskeyRouter from './routes/misskeyRoutes.js';
import tiktokRouter from './routes/tiktokRoutes.js';
import bilibiliRouter from './routes/bilibiliRoutes.js';
import instagramRouter from './routes/instagramRoutes.js';
import threadsRouter from './routes/threadsRoutes.js';
import pttRouter from './routes/pttRoutes.js';
import weiboRouter from './routes/weiboRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ipAllowlist } from './middlewares/ipAllowlist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Trust proxy so req.ip reflects the original client IP when behind proxies/tunnels (e.g., Cloudflare Tunnel)
app.set('trust proxy', true);
const config = await configManager();
const PORT = config.API_PORT || 3000;

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Allow external analytics script from Cloudflare Insights and inline scripts
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://static.cloudflareinsights.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:', 'http:'],
    },
  },
}));
app.use(cors());
app.use(express.json());
// IP allowlist: only localhost and configured API_WHITELIST IPs can access the API
app.use(ipAllowlist);

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve runtime config to the client (returns JS setting window.__API_BASE_URL__)
// If API_BASE_URL env var is set, use it; otherwise empty string (client will use relative paths)
app.get('/config.js', (req, res) => {
  const raw = process.env.API_BASE_URL || '';
  // 只允許空字串或 http/https URL（基本驗證）
  const safe = (raw === '' || /^https?:\/\/[^\s/]+/.test(raw)) ? raw : '';
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(`window.__API_BASE_URL__ = ${JSON.stringify(safe)};`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Documentation page (serve at root)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.use('/api/v1/twitter', twitterRouter);
app.use('/api/v1/pixiv', pixivRouter);
app.use('/api/v1/plurk', plurkRouter);
app.use('/api/v1/bluesky', blueskyRouter);
app.use('/api/v1/baha', bahaRouter);
app.use('/api/v1/eh', ehRouter);
app.use('/api/v1/pchome', pchomeRouter);
app.use('/api/v1/misskey', misskeyRouter);
app.use('/api/v1/tiktok', tiktokRouter);
app.use('/api/v1/bilibili', bilibiliRouter);
app.use('/api/v1/instagram', instagramRouter);
app.use('/api/v1/threads', threadsRouter);
app.use('/api/v1/ptt', pttRouter);
app.use('/api/v1/weibo', weiboRouter);

// API Documentation
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      twitter: '/api/v1/twitter/:statusId',
      pixiv: '/api/v1/pixiv/:illustId',
      plurk: '/api/v1/plurk/:plurkId',
      bluesky: '/api/v1/bluesky/:handle/:postId',
      baha: '/api/v1/baha/:postId',
      eh: '/api/v1/eh/:galleryId/:token',
      pchome: '/api/v1/pchome/:productId',
      misskey: '/api/v1/misskey/:noteId',
      tiktok: '/api/v1/tiktok',
      bilibili: '/api/v1/bilibili/:opusId',
      instagram: '/api/v1/instagram/:postId',
      threads: '/api/v1/threads (POST with url)',
      ptt: '/api/v1/ptt/:board/:postId',
      weibo: '/api/v1/weibo/:statusId',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize Baha authentication and start server
app.listen(PORT, async () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  // Initialize Baha authentication (login and setup cron job)
  try {
    await initializeBahaAuth();
  } catch (error) {
    console.error('Failed to initialize Baha authentication:', error.message);
  }
});

export default app;
