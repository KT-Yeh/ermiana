import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class InstagramService {
  static async getInstagramData(postId) {
    let proxyUrl = `https://www.fxstagram.com/p/${postId}/`;

    // Try fxstagram first
    try {
      const fxstagramUrl = `https://www.fxstagram.com/p/${postId}/`;
      const response = await axios.request({
        url: 'https://www.fxstagram.com/',
        method: 'get',
        timeout: 1500,
      });

      if (response.status === 200) {
        proxyUrl = fxstagramUrl;
      } else {
        // Try zzinstagram as backup
        const zzinstagramUrl = `https://www.zzinstagram.com/p/${postId}/`;
        const response2 = await axios.request({
          url: 'https://www.zzinstagram.com/',
          method: 'get',
          timeout: 1500,
        });

        if (response2.status === 200) {
          proxyUrl = zzinstagramUrl;
        } else {
          return createErrorResponse('Instagram API Error: Unable to reach proxy services.');
        }
      }
    } catch {
    // Use default fxstagram URL
      proxyUrl = `https://www.fxstagram.com/p/${postId}/`;
    }

    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0xE4405F',
      name: {
        title: 'Instagram',
        url: `https://www.instagram.com/p/${postId}/`,
      },
      rollback: proxyUrl,
    });
  }
}
