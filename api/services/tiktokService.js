import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class TiktokService {
  static async getVideoData(videoUrl) {
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
        throw new Error('tnktok failed');
      }
    } catch {
      // Try tiktokez.com as backup
      try {
        const tiktxkUrl = videoUrl.replace(/tiktok\.com/, 'tiktxk.com');
        const response = await axios.request({
          url: 'https://tiktxk.com/crab',
          method: 'get',
          timeout: 1500,
        });

        if (response.status === 200) {
          proxyUrl = tiktxkUrl;
        } else {
          throw new Error('tiktxk failed');
        }
      } catch {
        console.error('TikTok API Error (both proxies failed):' + videoUrl);
        // Use default tnktok URL
        proxyUrl = videoUrl.replace(/tiktok\.com/, 'tnktok.com');
      }
    }

    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0x000000',
      name: {
        title: 'TikTok',
        url: videoUrl,
      },
      footer: {
        text: 'ermiana',
        iconurl: 'https://ermiana.canaria.cc/pic/tiktok.png',
      },
      rollback: proxyUrl,
    });
  }
}
