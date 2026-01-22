import { handleAPIRequest, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function blueskyHandler(result, message, spoiler) {
  const did = result[1];
  const rkey = result[2];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/bluesky/${did}/${rkey}`,
      message,
      spoiler,
    });
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://bskx.app/profile/${did}/post/${rkey}`).then(() => {
        embedSuppresser(message);
      });
    } catch {
      // backup link failed; no further action
    }
  }
}
