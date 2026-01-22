import { handleAPIRequest } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function threadsHandler(result, message, spoiler) {
  const url = result[0];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/threads?url=${encodeURIComponent(url)}`,
      message,
      spoiler,
    });
  } catch {
    // send backup link with domain-agnostic replacement
    try {
      await backupLinkSender(message, spoiler, url.replace(/threads\.(?:net|com)/, 'fixthreads.net'));
    } catch {
      // ignore backup send errors
    }
  }
}
