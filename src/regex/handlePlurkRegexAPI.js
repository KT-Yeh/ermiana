import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

export async function plurkHandler(result, message, spoiler) {
  const plurkId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/plurk/${plurkId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
