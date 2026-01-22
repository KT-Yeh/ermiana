// import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function threadsHandler(result, message, spoiler) {
  const url = result[0];

  typingSender(message);

  try {
    await backupLinkSender(message, spoiler, url.replace(/threads\.net/, 'fixthreads.net'));
    embedSuppresser(message);
  } catch {
    // backup link failed; no further action
  }
}
