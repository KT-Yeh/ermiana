import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

export async function tiktokHandler(result, message, spoiler) {
  const url = result[0];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/tiktok/${encodeURIComponent(url)}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
