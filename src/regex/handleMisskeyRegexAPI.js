import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

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
