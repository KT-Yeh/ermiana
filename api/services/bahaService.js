import axios from 'axios';
import * as cheerio from 'cheerio';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';
import { getBahaTokens, reloadBahaTK } from '../utils/bahaAuth.js';

export class BahaService {
  static async getPostData(postId) {
    try {
      // Step 1: 從conf取得ENUR RUNE兩個值
      const { BAHAENUR, BAHARUNE } = getBahaTokens();

      // Step 2: 向伺服器端利用 ENUR RUNE兩個值取得內容
      const bahaHTML = await axios.request({
        url: `https://forum.gamer.com.tw/${postId}`,
        method: 'get',
        headers: { Cookie: 'BAHAENUR=' + BAHAENUR + '; BAHARUNE=' + BAHARUNE + ';' },
        timeout: 2500,
      });

      const $ = cheerio.load(bahaHTML.data);

      const title = $('meta[property=og:title]').attr('content');
      const description = $('meta[property=og:description]').attr('content') || '';
      const image = $('meta[property=og:image]').attr('content') || null;

      // Step 3-1: if 成功 輸出結果
      if (title && title !== '巴哈姆特電玩資訊站 - 系統訊息') {
        return createStandardResponse({
          success: true,
          style: 'normal',
          color: '0x17cc8c',
          name: {
            title: title,
            url: `https://forum.gamer.com.tw/${postId}`,
          },
          description: description,
          image: image,
          footer: {
            text: 'ermiana',
            iconurl: 'https://ermiana.canaria.cc/pic/baha.png',
          },
        });
      }

      // Step 3-2: if 失敗 > Step 4: 執行 reloadtoken()
      await reloadBahaTK();

      // Step 5-1 & 6: 檢查是否成功取得新token並從conf取得ENUR RUNE兩個值
      const { BAHAENUR: BAHAENUR2, BAHARUNE: BAHARUNE2 } = getBahaTokens();

      if (!BAHAENUR2 || !BAHARUNE2 || BAHAENUR2 === BAHAENUR) {
        throw new Error('Failed to reload tokens - tokens unchanged or empty');
      }

      // Step 7: 向伺服器端利用 ENUR RUNE兩個值取得內容
      const retryHTML = await axios.request({
        url: `https://forum.gamer.com.tw/${postId}`,
        method: 'get',
        headers: { Cookie: 'BAHAENUR=' + BAHAENUR2 + '; BAHARUNE=' + BAHARUNE2 + ';' },
        timeout: 2500,
      });

      const $retry = cheerio.load(retryHTML.data);

      const retryTitle = $retry('meta[property=og:title]').attr('content');
      const retryDescription = $retry('meta[property=og:description]').attr('content') || '';
      const retryImage = $retry('meta[property=og:image]').attr('content') || null;

      // Step 8-1: if 成功 輸出結果
      if (retryTitle && retryTitle !== '巴哈姆特電玩資訊站 - 系統訊息') {
        return createStandardResponse({
          success: true,
          style: 'normal',
          color: '0x17cc8c',
          name: {
            title: retryTitle,
            url: `https://forum.gamer.com.tw/${postId}`,
          },
          description: retryDescription,
          image: retryImage,
          footer: {
            text: 'ermiana',
            iconurl: 'https://ermiana.canaria.cc/pic/baha.png',
          },
        });
      }

      // Step 8-2: if 失敗 > END API ERROR
      throw new Error('Failed to fetch valid Baha data after retry');

    } catch (error) {
      console.error('Baha API Error:', error.message);
      throw createErrorResponse(
        error.message || 'Failed to fetch Baha data',
        'BAHA_API_ERROR',
      );
    }
  }
}
