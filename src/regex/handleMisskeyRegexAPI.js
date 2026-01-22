import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

export async function misskeyHandler(result, message, spoiler) {
  const noteId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/misskey/${noteId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
