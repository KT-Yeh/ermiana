import { handleAPIRequest } from './apiHandlerHelper.js';

export async function tiktokHandler(result, message, spoiler) {
  const url = result[0];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/tiktok?url=${encodeURIComponent(url)}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
