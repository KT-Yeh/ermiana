import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

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
