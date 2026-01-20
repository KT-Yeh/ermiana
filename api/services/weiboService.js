import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class WeiboService {
  static async getWeiboData(statusId) {
    let proxyUrl = `https://m.weibo.cn/detail/${statusId}/`;

    // Try weiboez.com
    try {
      const weiboezUrl = `https://weiboez.com/detail/${statusId}/`;
      const response = await axios.request({
        url: 'https://status.embedez.com/api/status/bots',
        method: 'get',
        timeout: 1500,
      });

      if (response.status === 200) {
        proxyUrl = weiboezUrl;
      } else {
        return createErrorResponse('Instagram API Error: Unable to reach proxy services.');
      }
    } catch {
    // Use default weiboez URL
      proxyUrl = `https://weiboez.com/detail/${statusId}/`;
    }

    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0x000000',
      name: {
        title: 'Weibo',
        url: `https://m.weibo.cn/detail/${statusId}/`,
      },
      rollback: proxyUrl,
    });
  }
}
