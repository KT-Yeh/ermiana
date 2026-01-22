import { handleAPIRequest } from './apiHandlerHelper.js';

export async function pchomeHandler(result, message, spoiler) {
  const productId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/pchome/${productId}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
