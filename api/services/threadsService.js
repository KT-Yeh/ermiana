import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class ThreadsService {
  static async getThreadsData(videoUrl) {
    let proxyUrl = videoUrl;

    // Try fixthreads.net
    try {
      const fixedUrl = videoUrl.replace(/threads\.com/, 'fixthreads.net');
      const response = await axios.request({
        url: 'https://fixthreads.net/health',
        method: 'get',
        timeout: 1500,
      });

      if (response.status === 200) {
        proxyUrl = fixedUrl;
      } else {
        return createErrorResponse('Threads API Error: Unable to reach proxy services.');
      }
    } catch {
      // Use default fixthreads URL
      console.error('Threads API Error: ' + videoUrl);
      proxyUrl = videoUrl.replace(/threads\.com/, 'fixthreads.net');
    }

    if (proxyUrl === videoUrl) {
      return createErrorResponse('Threads API Error: Unable to reach proxy services.');
    }

    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0x000000',
      name: {
        title: 'Threads',
        url: videoUrl,
      },
      rollback: proxyUrl,
    });
  }
}
