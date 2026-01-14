// Preprocess environment variables and normalize values used by the API server
export function preprocessEnv() {
  const result = {};

  // Normalize API_ALLOW_ALL: strip surrounding quotes and accept only the literal 'true'
  const raw = process.env.API_ALLOW_ALL ? String(process.env.API_ALLOW_ALL) : undefined;
  const normalized = raw ? raw.replace(/(^['"]|['"]$)/g, '') : undefined;

  if (normalized && normalized !== 'true') {
    console.warn("API_ALLOW_ALL set but not equal to 'true'; only the literal string 'true' enables bypass.");
  }

  result.API_ALLOW_ALL = normalized === 'true';

  // Write back normalized value into process.env for consistency across modules
  if (normalized !== undefined) {
    process.env.API_ALLOW_ALL = normalized;
  }

  return result;
}
