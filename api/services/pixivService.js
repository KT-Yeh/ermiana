import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class PixivService {
  static async getIllustData(illustId) {
    try {
      const response = await axios.request({
        method: 'get',
        url: `https://www.pixiv.net/ajax/illust/${illustId}`,
        timeout: 2500,
      });

      if (response.status !== 200 || !response.data.body) {
        throw new Error('Failed to fetch Pixiv data');
      }

      const illust = response.data.body;

      // Extract tags
      const tags = illust.tags.tags.map((tag) => ({
        name: tag.tag,
        translatedName: tag.translation?.en || null,
      }));

      // Process image URLs
      const getProxiedUrl = (url) => url ? url.replace('i.pximg.net', 'pixiv.canaria.cc') : null;

      const images = [];
      const pageCount = illust.pageCount || 1;

      // Try regular URLs first
      if (illust.urls.regular && /i\.pximg\.net/.test(illust.urls.regular)) {
        const baseUrl = getProxiedUrl(illust.urls.regular);
        for (let i = 0; i < pageCount; i++) {
          images.push(baseUrl.replace('_p0', `_p${i}`));
        }
      } else if (illust.userIllusts[illustId]?.url && /p0/.test(illust.userIllusts[illustId]?.url)) {
        // Try userIllusts as backup
        const userIllustsRegex = /\/img\/.*p0/;
        const match = illust.userIllusts[illustId].url.match(userIllustsRegex);
        if (match) {
          const baseUrl = 'https://pixiv.canaria.cc/img-master' + match[0] + '_master1200.jpg';
          for (let i = 0; i < pageCount; i++) {
            images.push(baseUrl.replace('_p0', `_p${i}`));
          }
        }
      } else {
        // Try pixiv.cat API as last resort
        try {
          const catResp = await axios.request({
            method: 'post',
            url: 'https://api.pixiv.cat/v1/generate',
            data: {
              p: `https://www.pixiv.net/artworks/${illustId}`,
            },
            timeout: 2500,
          });

          if (catResp.data?.original_url) {
            images.push(getProxiedUrl(catResp.data.original_url));
          } else if (catResp.data?.original_urls) {
            catResp.data.original_urls.forEach((url) => {
              images.push(getProxiedUrl(url));
            });
          }
        } catch (catError) {
          console.error('Pixiv.cat backup API also failed:', catError.message);
        }
      }

      // Extract description
      const description = illust.extraData?.meta?.twitter?.description || illust.description || '';

      // Extract tags
      const tagsString = illust.tags.tags.map((tag) => `[${tag.tag}](https://www.pixiv.net/tags/${tag.tag}/artworks)`).join(', ');

      // 決定 style
      const style = pageCount > 1 ? 'pixiv' : 'normal';

      // 建立標準回應
      const responseData = {
        success: true,
        style,
        color: '0x0096fa',
        name: {
          title: illust.title,
          url: `https://www.pixiv.net/artworks/${illustId}`,
        },
        description: description.substring(0, 300),
        fields: [
          {
            name: '作者',
            value: `[${illust.userName}](https://www.pixiv.net/users/${illust.userId})`,
            inline: true,
          },
          {
            name: '收藏',
            value: String(illust.bookmarkCount),
            inline: true,
          },
        ],
        footer: {
          text: 'ermiana',
          iconurl: 'https://ermiana.canaria.cc/pic/pixiv.png',
        },
      };

      // 添加標籤欄位
      if (tagsString) {
        responseData.fields.push({
          name: '標籤',
          value: tagsString,
          inline: false,
        });
      }

      // 根據 style 添加圖片
      if (style === 'pixiv' && images.length > 0) {
        responseData.imagePixiv = {
          url: images[0],
          count: pageCount,
        };
      } else if (style === 'normal' && images.length > 0) {
        responseData.image = images[0];
      }

      return createStandardResponse(responseData);
    } catch (error) {
      console.error('Pixiv API Error:', error.message);
      // Return fallback
      return createStandardResponse({
        success: true,
        style: 'backup',
        color: '0x0096fa',
        name: {
          title: 'Pixiv',
          url: `https://www.pixiv.net/artworks/${illustId}`,
        },
        footer: {
          text: 'ermiana',
          iconurl: 'https://ermiana.canaria.cc/pic/pixiv.png',
        },
        rollback: `https://www.phixiv.net/artworks/${illustId}`,
      });
    }
  }
}
