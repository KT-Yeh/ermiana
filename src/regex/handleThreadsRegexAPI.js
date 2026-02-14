import { handleAPIRequest, embedSuppresser } from './apiHandlerHelper.js';
import { backupLinkSender } from '../events/backupLinkSender.js';

export async function threadsHandler(result, message, spoiler) {
  // 暫不處理 threads.com：不請求 API、不發備援連結
  // const url = result[0];
  // try {
  //   await handleAPIRequest({
  //     apiPath: `/api/v1/threads?url=${encodeURIComponent(url)}`,
  //     message,
  //     spoiler,
  //   });
  // } catch {
  //   try {
  //     await backupLinkSender(message, spoiler, url).then(() => {
  //       embedSuppresser(message);
  //     });
  //   } catch {
  //     // ignore backup send errors
  //   }
  // }
}
