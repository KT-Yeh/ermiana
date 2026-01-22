import { handleAPIRequest } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function pixivHandler(result, message, spoiler) {
  const illustId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/pixiv/${illustId}`,
      message,
      spoiler,
    });
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://www.phixiv.net/artworks/${illustId}`);
    } catch {
      // backup link failed; no further action
    }
  }
}
