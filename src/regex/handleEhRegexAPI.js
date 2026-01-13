import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function ehHandler(result, message, spoiler) {
  const gid = result[1];
  const token = result[2];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/eh/${gid}/${token}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
