import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function bilibiliHandler(result, message, spoiler) {
  const bvId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/bilibili/${bvId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
