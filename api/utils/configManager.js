import dotenv from 'dotenv';

dotenv.config();

export async function configManager() {
  const config = {
    API_PORT: process.env.API_PORT || 3000,
    // Public URL exposed by the API server (preferred): API_PUBLIC_URL
    API_PUBLIC_URL: process.env.API_PUBLIC_URL || 'http://localhost:3000',
    API_WHITELIST: process.env.API_WHITELIST || '',
    // Baha credentials used by the API (moved from src to api-level config)
    BHUD: process.env.BHUD,
    BHPD: process.env.BHPD,
  };
  return config;
}
