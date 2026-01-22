import { handleAPIRequest, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function pttHandler(result, message, spoiler) {
  const board = result[1];
  const postId = result[2];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/ptt/${board}/${postId}`,
      message,
      spoiler,
    });
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://www.pttweb.cc/bbs/${board}/${postId}`).then(() => {
        embedSuppresser(message);
      });
    } catch {
      // backup link failed; no further action
    }
  }
}
