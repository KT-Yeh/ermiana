import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class TiktokService {
  static async getTiktokData(videoUrl) {
    let proxyUrl = videoUrl;

    // Try tnktok.com first
    try {
      const tnktokUrl = videoUrl.replace(/tiktok\.com/, 'tnktok.com');
      const response = await axios.request({
        url: 'https://offload.tnktok.com/',
        method: 'get',
        timeout: 1500,
      });

      if (response.status === 200) {
        proxyUrl = tnktokUrl;
      } else {
        // Try tiktxk.com as backup
        const tiktxkUrl = videoUrl.replace(/tiktok\.com/, 'tiktxk.com');
        const response = await axios.request({
          url: 'https://tiktxk.com/crab',
          method: 'get',
          timeout: 1500,
        });

        if (response.status === 200) {
          proxyUrl = tiktxkUrl;
        } else {
          return createErrorResponse('TikTok API Error: Unable to reach proxy services.');
        }
      }
    } catch {
      // Use default tnktok URL
      console.error('TikTok API Error (both proxies failed):' + videoUrl);
      proxyUrl = videoUrl.replace(/tiktok\.com/, 'tnktok.com');
    }

    if (proxyUrl === videoUrl) {
      return createErrorResponse('TikTok API Error: Unable to reach proxy services.');
    }

    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0x000000',
      name: {
        title: 'TikTok',
        url: videoUrl,
      },
      rollback: proxyUrl,
    });
  }
}
