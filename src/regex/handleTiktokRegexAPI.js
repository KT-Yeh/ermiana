import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

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
