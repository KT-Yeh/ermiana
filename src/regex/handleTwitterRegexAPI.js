import { handleAPIRequest } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function twitterHandler(result, message, spoiler) {
  const statusId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/twitter/${statusId}`,
      message,
      spoiler,
    });
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://fxtwitter.com/i/status/${statusId}`);
    } catch {
      // backup link failed; no further action
    }
  }
}
