// IP allowlist middleware
// Behaviour: only requests from localhost or IPs in API_WHITELIST are allowed.

// Localhost IPs
const LOCALHOST_IPS = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

// Parse whitelist from env (comma-separated IPs). If empty, only localhost is allowed.
const envWhitelistRaw = process.env.API_WHITELIST || '';
const envWhitelist = envWhitelistRaw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Support a bypass (useful for tunnels) when set to 'true' or '1'
const ALLOW_ALL = process.env.API_ALLOW_ALL === 'true' || process.env.API_ALLOW_ALL === '1';

// Final allowlist set (includes localhost)
const ALLOWLIST_IPS = new Set([...LOCALHOST_IPS, ...envWhitelist]);

export function ipAllowlist(req, res, next) {
  if (ALLOW_ALL) return next();

  // Prefer headers commonly set by proxies and CDNs
  const headers = req.headers || {};
  const forwarded = headers['x-forwarded-for'] || headers['cf-connecting-ip'] || headers['x-real-ip'];
  const clientIpFromHeader = forwarded ? forwarded.split(',')[0].trim() : undefined;

  const clientIp = clientIpFromHeader || req.ip || (req.connection && req.connection.remoteAddress);

  if (clientIp && ALLOWLIST_IPS.has(clientIp)) {
    return next();
  }

  // Log for debugging (admin use) but avoid leaking sensitive data in responses
  console.warn('Forbidden request from IP:', clientIp);

  return res.status(403).json({
    success: false,
    error: {
      message: 'Forbidden: IP not allowed',
      code: 'IP_NOT_ALLOWLISTED',
    },
  });
}
