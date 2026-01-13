const env = process.env.API_WHITELIST || '';
const envWhitelist = env.split(',').map((s) => s.trim()).filter(Boolean);
const LOCALHOST = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
const set = new Set([...LOCALHOST, ...envWhitelist]);
console.log('API_WHITELIST =', JSON.stringify(process.env.API_WHITELIST));
console.log('127.0.0.1 ->', set.has('127.0.0.1') ? 'ALLOWED' : 'BLOCKED');
console.log('192.168.1.100 ->', set.has('192.168.1.100') ? 'ALLOWED' : 'BLOCKED');
console.log('10.0.0.2 ->', set.has('10.0.0.2') ? 'ALLOWED' : 'BLOCKED');
