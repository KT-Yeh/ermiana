// import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function instagramHandler(result, message, spoiler) {
  const postId = result[1];

  typingSender(message);

  try {
    await backupLinkSender(message, spoiler, `https://www.ddinstagram.com/p/${postId}/`);
    embedSuppresser(message);
  } catch {
    // backup link failed; no further action
  }
}
