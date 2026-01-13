import axios from 'axios';
import { createStandardResponse } from '../utils/responseFormatter.js';

export async function getInstagramData(postId) {
  let proxyUrl = `https://www.ddinstagram.com/p/${postId}/`;

  try {
    // Try ddinstagram first
    const ddResp = await axios.request({
      url: 'https://www.ddinstagram.com/',
      method: 'get',
      timeout: 4400,
    });

    if (ddResp.status === 200) {
      proxyUrl = `https://www.ddinstagram.com/p/${postId}/`;
    } else {
      throw new Error('ddinstagram not available');
    }
  } catch (error) {
    // Fallback to instagramez
    try {
      const ezResp = await axios.request({
        url: `https://www.instagramez.com/p/${postId}/`,
        method: 'get',
        timeout: 2500,
      });

      if (ezResp.status === 200) {
        proxyUrl = `https://www.instagramez.com/p/${postId}/`;
      }
    } catch (fallbackError) {
      // Use default ddinstagram URL
      proxyUrl = `https://www.ddinstagram.com/p/${postId}/`;
    }
  }

  return createStandardResponse({
    success: true,
    style: 'backup',
    color: '0xE4405F',
    name: {
      title: 'Instagram',
      url: `https://www.instagram.com/p/${postId}/`,
    },
    footer: {
      text: 'ermiana',
      iconurl: 'https://ermiana.canaria.cc/pic/instagram.png',
    },
    rollback: proxyUrl,
  });
}
