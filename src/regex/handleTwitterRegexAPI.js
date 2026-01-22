import { handleAPIRequest, embedSuppresser } from './apiHandlerHelper.js';
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
      await backupLinkSender(message, spoiler, `https://fxtwitter.com/i/status/${statusId}`).then(() => {
        embedSuppresser(message);
      });
    } catch {
      // backup link failed; no further action
    }
  }
}
