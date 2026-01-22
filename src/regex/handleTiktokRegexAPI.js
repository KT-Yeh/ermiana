import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

export async function tiktokHandler(result, message, spoiler) {
  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: '/api/v1/tiktok',
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
