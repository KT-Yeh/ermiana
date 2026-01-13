import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { backupLinkSender } from '../events/backupLinkSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function twitterHandler(result, message, spoiler) {
  const statusId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/twitter/${statusId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    try {
      await backupLinkSender(message, spoiler, `https://fxtwitter.com/i/status/${statusId}`);
      embedSuppresser(message);
    } catch {
      // backup link failed; no further action
    }
  }
}
