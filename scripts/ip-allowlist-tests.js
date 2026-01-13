import { spawnSync } from 'child_process';
import path from 'path';
import { pathToFileURL } from 'url';

const moduleUrl = new URL('../api/middlewares/ipAllowlist.js', import.meta.url).href;

function runTest(envObj, req) {
  const env = { ...process.env, ...envObj };
  const code = `
    import('${moduleUrl}').then(({ ipAllowlist }) => {
      const req = ${JSON.stringify(req)};
      const res = { status: (s) => ({ json: (o) => console.log(JSON.stringify({ status: s, body: o })) }) };
      const next = () => console.log('NEXT');
      try {
        ipAllowlist(req, res, next);
      } catch (err) {
        console.error('ERR', err && err.message);
      }
    }).catch(e => console.error('IMPORT_ERR', e && e.message));
  `;

  const r = spawnSync('node', ['-e', code], { env, encoding: 'utf8', cwd: process.cwd() });
  return { stdout: r.stdout, stderr: r.stderr };
}

const scenarios = [
  { name: 'Default (no API_WHITELIST)', env: {}, req: { ip: '127.0.0.1', headers: {}, connection: {} } },
  { name: 'Default - external IP blocked', env: {}, req: { ip: '192.168.1.100', headers: {}, connection: {} } },
  { name: 'Whitelist contains external', env: { API_WHITELIST: '192.168.1.100' }, req: { ip: '192.168.1.100', headers: {}, connection: {} } },
  { name: 'X-Forwarded-For header - first IP whitelisted', env: { API_WHITELIST: '10.0.0.2' }, req: { ip: undefined, headers: { 'x-forwarded-for': '10.0.0.2, 9.9.9.9' }, connection: {} } },
  { name: 'X-Forwarded-For header - not whitelisted', env: { API_WHITELIST: '10.0.0.3' }, req: { ip: undefined, headers: { 'x-forwarded-for': '10.0.0.2, 9.9.9.9' }, connection: {} } },
  { name: 'IPv6 mapped localhost', env: {}, req: { ip: '::ffff:127.0.0.1', headers: {}, connection: {} } },
  { name: 'No IP (blocked)', env: {}, req: { ip: undefined, headers: {}, connection: {} } },
];

console.log('Running ip-allowlist tests...');
for (const s of scenarios) {
  console.log('\n===', s.name, '===');
  const r = runTest(s.env, s.req);
  if (r.stdout) console.log(r.stdout.trim());
  if (r.stderr) console.error('ERR:', r.stderr.trim());
}

console.log('\nDone.');
