import axios from 'axios';
import * as cheerio from 'cheerio';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

function sanitizeHtmlContent(input) {
  let previous;
  do {
    previous = input;
    input = input.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '');
  } while (input !== previous);
  return input;
}

export class PlurkService {
  static async getPlurkData(plurkId) {
    try {
      const response = await axios.request({
        url: `https://www.plurk.com/p/${plurkId}`,
        method: 'get',
        timeout: 5000,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch Plurk data');
      }

      const $ = cheerio.load(response.data);
      const scriptText = $('script').text();

      // Extract data from script
      const rePlurk = scriptText.match(/"replurkers_count": (\d+),/)?.[1] || '0';
      const favPlurk = scriptText.match(/"favorite_count": (\d+),/)?.[1] || '0';
      const respPlurk = scriptText.match(/"response_count": (\d+),/)?.[1] || '0';

      const plurkName = $('.name').text() || '噗浪使用者';
      const plurkContent = sanitizeHtmlContent($('.text_holder').html()) || '';

      const rawPlurkIndex = scriptText.indexOf('content_raw');
      const picPlurk = scriptText.slice(rawPlurkIndex).match(/https:\/\/images\.plurk\.com\/[^\\"\s]+/g) || [];

      const plurkUserId = scriptText.match(/"page_user":\s*{"id":\s*(\d+),/)?.[1] || '17527487';
      const plurkAvatar = scriptText.match(/"avatar":\s*(\d+)/)?.[1] || '79721750';
      const plurkNickName = scriptText.match(/"nick_name":\s*"([^"]+)"/)?.[1] || 'plurkuser';

      // 統計資訊
      const statsInfo = `💬${respPlurk} 🔁${rePlurk} ❤️${favPlurk}`;

      // 決定 style
      let style = 'normal';
      let image = null;
      let imageArray = null;

      if (picPlurk.length === 0) {
        style = 'normal';
      } else if (picPlurk.length === 1) {
        style = 'normal';
        image = picPlurk[0];
      } else {
        style = 'more';
        image = picPlurk[0];
        imageArray = picPlurk.slice(1, 4);
      }

      // 建立標準回應
      const responseData = {
        success: true,
        style,
        color: '0xefa54c',
        author: {
          text: `@${plurkNickName}`,
          iconurl: `https://avatars.plurk.com/${plurkUserId}-medium${plurkAvatar}.gif`,
        },
        name: {
          title: plurkName,
          url: `https://www.plurk.com/p/${plurkId}`,
        },
        description: plurkContent,
        footer: {
          text: statsInfo,
          iconurl: 'https://ermiana.canaria.cc/pic/plurk.png',
        },
      };

      if (image) {
        responseData.image = image;
      }
      if (imageArray) {
        responseData.imageArray = imageArray;
      }

      return createStandardResponse(responseData);
    } catch (error) {
      console.error('Plurk API Error:', error.message);
      throw createErrorResponse(
        error.message || 'Failed to fetch Plurk data',
        'PLURK_API_ERROR',
      );
    }
  }
}
