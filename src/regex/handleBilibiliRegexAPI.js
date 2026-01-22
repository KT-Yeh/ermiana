import { handleAPIRequest } from './apiHandlerHelper.js';

export async function bilibiliHandler(result, message, spoiler) {
  const bvId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/bilibili/${bvId}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
