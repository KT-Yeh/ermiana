import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class TiktokService {
  static async getVideoData(videoUrl) {
    let proxyUrl = videoUrl.replace(/tiktok\.com/, 'tnktok.com');
    
    // Try tnktok.com first
    try {
      const tnktokUrl = videoUrl.replace(/tiktok\.com/, 'tnktok.com');
      const response = await axios.request({
        url: tnktokUrl,
        method: 'get',
        timeout: 3000,
      });

      if (response.status === 200) {
        proxyUrl = tnktokUrl;
      } else {
        throw new Error('tnktok failed');
      }
    } catch (tnktokError) {
      // Try tiktokez.com as backup
      try {
        const tiktokezUrl = videoUrl.replace(/tiktok\.com/, 'tiktokez.com');
        const response = await axios.request({
          url: tiktokezUrl,
          method: 'get',
          timeout: 3000,
        });

        if (response.status === 200) {
          proxyUrl = tiktokezUrl;
        } else {
          throw new Error('tiktokez failed');
        }
      } catch (tiktokezError) {
        console.error('TikTok API Error (both proxies failed):', tiktokezError.message);
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
