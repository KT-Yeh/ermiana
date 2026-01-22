import { handleAPIRequest } from './apiHandlerHelper.js';

export async function bahaHandler(result, message, spoiler) {
  const bahaId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/baha/${bahaId}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
