import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function misskeyHandler(result, message, spoiler) {
  const instanceHost = result[1];
  const noteId = result[2];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/misskey/${instanceHost}/${noteId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
