import { handleAPIRequest, typingSender, embedSuppresser } from './apiHandlerHelper.js';

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
