import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { backupLinkSender } from '../events/backupLinkSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function blueskyHandler(result, message, spoiler) {
  const did = result[1];
  const rkey = result[2];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/bluesky/${did}/${rkey}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://bskx.app/profile/${did}/post/${rkey}`);
      embedSuppresser(message);
    } catch {
      // backup link failed; no further action
    }
  }
}
