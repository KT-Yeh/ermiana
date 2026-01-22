import { handleAPIRequest } from './apiHandlerHelper.js';

export async function weiboHandler(result, message, spoiler) {
  const statusId = result[1];

  try {
    await handleAPIRequest({
      apiPath: `/api/v1/weibo/${statusId}`,
      message,
      spoiler,
    });
  } catch {
    // no backup flow; no further action
  }
}
