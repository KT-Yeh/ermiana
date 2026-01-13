import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

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
