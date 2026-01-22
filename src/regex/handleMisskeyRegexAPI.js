import { handleAPIRequest } from './apiHandlerHelper.js';

export async function misskeyHandler(result, message, spoiler) {
  const noteId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/misskey/${noteId}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
