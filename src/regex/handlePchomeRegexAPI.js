import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

export async function pchomeHandler(result, message, spoiler) {
  const productId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/pchome/${productId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
