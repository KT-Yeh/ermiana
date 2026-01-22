import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function pixivHandler(result, message, spoiler) {
  const illustId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/pixiv/${illustId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://www.phixiv.net/artworks/${illustId}`);
      embedSuppresser(message);
    } catch {
      // backup link failed; no further action
    }
  }
}
