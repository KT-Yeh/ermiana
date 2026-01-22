import { handleAPIRequest, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function instagramHandler(result, message, spoiler) {
  const postId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/instagram/${postId}`,
      message,
      spoiler,
    });
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://www.fxstagram.com/p/${postId}/`).then(() => {
        embedSuppresser(message);
      });
    } catch {
    // backup link failed; no further action
    }
  }
}
