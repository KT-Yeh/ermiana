import { performance } from 'perf_hooks';

const ITERATIONS = parseInt(process.argv[2], 10) || 5000000; // default 5M for higher load
const LOCALHOST_IPS = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

function buildWhitelistSet() {
  const env = process.env.API_WHITELIST || '';
  const envWhitelist = env.split(',').map((s) => s.trim()).filter(Boolean);
  return new Set([...LOCALHOST_IPS, ...envWhitelist]);
}

const WHITELIST_IPS = buildWhitelistSet();

function getClientIpFromReqMock({ ip, connectionRemote, xff }) {
  // simulate retrieval order used in ipAllowlist middleware
  if (ip) return ip;
  if (connectionRemote) return connectionRemote;
  if (xff) return xff.split(',')[0].trim();
  return undefined;
}

function isWhitelisted(ip) {
  return WHITELIST_IPS.has(ip);
}


function bench(name, fn) {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    fn();
  }
  const end = performance.now();
  const ms = end - start;
  const ops = (ITERATIONS / (ms / 1000));
  console.log(`${name}: ${ms.toFixed(2)} ms — ${Math.round(ops).toLocaleString()} ops/sec — ${ (ms / ITERATIONS * 1000).toFixed(3) } µs/op`);
  return { ms, ops };
}

console.log(`Iterations: ${ITERATIONS}`);
console.log(`API_WHITELIST env: ${JSON.stringify(process.env.API_WHITELIST)}`);

const ipLocal = '127.0.0.1';
const ipExternal = '192.168.1.100';
const headerLocal = '127.0.0.1, 10.0.0.2';
const headerExternal = '192.168.1.100, 10.0.0.2';

// Fast path: whitelisted local
const r1 = bench('fast - whitelisted local (get+check)', () => {
  const ip = getClientIpFromReqMock({ ip: ipLocal });
  isWhitelisted(ip);
});

// Fast path: whitelisted external (if present in env)
const r2 = bench('fast - whitelisted external (get+check)', () => {
  const ip = getClientIpFromReqMock({ ip: ipExternal });
  isWhitelisted(ip);
});


// X-Forwarded-For header parse + check
const r4 = bench('xff parse + check (headerExternal)', () => {
  const ip = getClientIpFromReqMock({ xff: headerExternal });
  isWhitelisted(ip);
});

// Summary estimate: cores required for 800k QPS for each path
function estimateCores(opsPerSec) {
  if (!opsPerSec || isNaN(opsPerSec)) return 'N/A';
  const cores = Math.ceil(800000 / opsPerSec);
  return cores;
}

console.log('\nEstimated cores to handle 800,000 req/s (pure allowlist check + parsing):');
console.log('whitelisted local:', estimateCores(r1.ops));
console.log('whitelisted external:', estimateCores(r2.ops));
console.log('xff parse + check:', estimateCores(r4.ops));

console.log('\nNote: This is a microbenchmark. Real HTTP/server overhead and I/O will reduce achievable QPS per core.');

console.log('Done');
