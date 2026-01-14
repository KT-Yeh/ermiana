import dotenv from 'dotenv';

export async function configManager() {
  // Ensure env is loaded, but do NOT perform API-specific preprocessing here.
  dotenv.config();

  const config = {
    DCTK: process.env.DCTK,
    DCID: process.env.DCID,
    DCWH: process.env.DCWH,
    // Bot/client API URL (preferred): BOT_USE_API_URL
    BOT_USE_API_URL: process.env.BOT_USE_API_URL || 'http://localhost:3000',
  };
  return config;
}
