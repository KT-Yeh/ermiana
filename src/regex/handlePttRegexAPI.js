import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { backupLinkSender } from '../events/backupLinkSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function pttHandler(result, message, spoiler) {
  const board = result[1];
  const postId = result[2];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/ptt/${board}/${postId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://www.pttweb.cc/bbs/${board}/${postId}`);
      embedSuppresser(message);
    } catch {
      // backup link failed; no further action
    }
  }
}
