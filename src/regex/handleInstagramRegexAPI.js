import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function instagramHandler(result, message, spoiler) {
  const postId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/instagram/${postId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://www.fxstagram.com/p/${postId}/`);
      embedSuppresser(message);
    } catch {
    // backup link failed; no further action
    }
  }
}
