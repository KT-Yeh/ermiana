import { handleAPIRequest } from './apiHandlerHelper.js';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';

export async function weiboHandler(result, message, spoiler) {
  const statusId = result[1];

  typingSender(message);
  try {
    await handleAPIRequest({
      apiPath: `/api/v1/weibo/${statusId}`,
      message,
      spoiler,
    });
    embedSuppresser(message);
  } catch {
    // no backup flow; no further action
  }
}
