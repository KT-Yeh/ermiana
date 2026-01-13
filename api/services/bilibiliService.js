import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class BilibiliService {
  static async getOpusData(opusId) {
    try {
      const response = await axios.request({
        url: `https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${opusId}`,
        method: 'get',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'zh-TW,zh;q=0.8,ja;q=0.6,en-US;q=0.4,en;q=0.2',
          'Connection': 'keep-alive',
          'Host': 'api.bilibili.com',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0',
        },
        timeout: 2500,
      });

      // Bilibili API code: 0 表示成功，其他表示錯誤
      if (response.status !== 200 || response.data?.code !== 0 || !response.data?.data) {
        throw new Error(`Bilibili API Error: ${response.data?.message || response.data?.code || 'Unknown error'}`);
      }

      const item = response.data.data.item;
      if (!item || !item.modules) {
        throw new Error('Invalid Bilibili data structure');
      }

      const type = item.type;

      // 作者資訊
      const author = {
        text: item.modules.module_author?.mid?.toString() || '',
        iconurl: item.modules.module_author?.face || '',
      };

      // 基本回應資料
      const responseData = {
        success: true,
        style: 'normal',
        color: '0x00aeec',
        author,
        name: {
          title: item.modules.module_author?.name?.toString() || 'Bilibili',
          url: `https://www.bilibili.com/opus/${opusId}`,
        },
        description: '',
        footer: {
          text: 'ermiana',
          iconurl: 'https://ermiana.canaria.cc/pic/bilibili.png',
        },
      };

      if (type === 'DYNAMIC_TYPE_DRAW') {
        // 圖片動態
        const pics = item.modules.module_dynamic.major?.draw?.items || [];
        responseData.description = item.modules.module_dynamic.desc?.text || '';

        if (pics.length === 0) {
          responseData.style = 'normal';
        } else if (pics.length === 1) {
          responseData.style = 'normal';
          responseData.image = pics[0].src;
        } else {
          responseData.style = 'more';
          responseData.imageArray = pics.slice(1, 4).map((pic) => pic.src);
          responseData.image = pics[0].src; // 第一張圖放在主要位置
        }
      } else if (type === 'DYNAMIC_TYPE_ARTICLE') {
        // 文章動態
        const article = item.modules.module_dynamic.major.article;
        responseData.description = article?.title || '';
        const covers = article?.covers || [];
        if (covers.length > 0) {
          responseData.image = covers[0];
        }
      } else {
        // 其他類型
        responseData.description = item.modules.module_dynamic.desc?.text || '';
      }

      return createStandardResponse(responseData);
    } catch (error) {
      console.error('Bilibili API Error:', error.message);
      throw createErrorResponse(
        error.message || 'Failed to fetch Bilibili data',
        'BILIBILI_API_ERROR',
      );
    }
  }
}
