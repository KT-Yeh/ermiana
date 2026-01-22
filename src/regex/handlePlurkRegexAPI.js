import { handleAPIRequest } from './apiHandlerHelper.js';

export async function plurkHandler(result, message, spoiler) {
  const plurkId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/plurk/${plurkId}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
