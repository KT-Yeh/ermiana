import axios from 'axios';
import * as cheerio from 'cheerio';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export async function getWeiboData(statusId) {
  try {
    const weiboResp = await axios.request({
      method: 'get',
      url: 'https://m.weibo.cn/statuses/show',
      params: {
        id: statusId,
      },
      timeout: 2000,
    });

    if (weiboResp.status === 200 && weiboResp.data && weiboResp.data.data) {
      const data = weiboResp.data.data;

      // Parse text content (remove HTML tags)
      let text = '';
      if (data.text) {
        const $ = cheerio.load(data.text);
        text = $.text();
      }

      // Process images - convert to proxy URLs
      const images = [];
      if (data.pics && Array.isArray(data.pics)) {
        data.pics.forEach((pic) => {
          if (pic.large && pic.large.url) {
            const match = pic.large.url.match(/https:\/\/(\w+)\.sinaimg\.cn\/(.+)/);
            if (match) {
              images.push(`https://weibo-pic.canaria.cc/${match[1]}/${match[2]}`);
            }
          }
        });
      }

      // 統計資訊格式化
      const statsText = `💬 ${data.comments_count || 0} | 🔁 ${data.reposts_count || 0} | ❤️ ${data.attitudes_count || 0}`;

      return createStandardResponse({
        success: true,
        style: images.length > 1 ? 'more' : 'normal',
        color: '0xe6162d',
        author: {
          text: data.user?.screen_name || 'Unknown',
          iconurl: data.user?.profile_image_url || '',
        },
        name: {
          title: '微博動態',
          url: `https://m.weibo.cn/detail/${statusId}`,
        },
        description: text,
        ...(images.length === 1
          ? { image: images[0] }
          : images.length > 1
            ? { imageArray: images }
            : {}),
        fields: [
          {
            name: '互動數據',
            value: statsText,
            inline: false,
          },
        ],
        footer: {
          text: 'ermiana',
          iconurl: 'https://ermiana.canaria.cc/pic/weibo.png',
        },
        timestamp: new Date(data.created_at).getTime(),
      });
    }

    throw new Error('Weibo API returned invalid data');
  } catch (error) {
    console.error('Weibo API Error:', error.message);
    throw createErrorResponse(
      error.message || 'Failed to fetch Weibo data',
      'WEIBO_API_ERROR',
    );
  }
}
