import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

export async function bahaHandler(result, message, spoiler) {
  const bahaId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/baha/${bahaId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
