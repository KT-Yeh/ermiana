// import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { backupLinkSender } from '../events/backupLinkSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

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
