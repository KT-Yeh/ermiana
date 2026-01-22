import { handleAPIRequest } from './apiHandlerHelper.js';

export async function ehHandler(result, message, spoiler) {
  const gid = result[1];
  const token = result[2];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/eh/${gid}/${token}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
