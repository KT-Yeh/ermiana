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

// Final allowlist set (includes localhost)
const ALLOWLIST_IPS = new Set([...LOCALHOST_IPS, ...envWhitelist]);

export function ipAllowlist(req, res, next) {
  const clientIp = req.ip || (req.connection && req.connection.remoteAddress) || (req.headers && req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : undefined);

  if (clientIp && ALLOWLIST_IPS.has(clientIp)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: {
      message: 'Forbidden: IP not allowed',
      code: 'IP_NOT_ALLOWLISTED',
    },
  });
}
