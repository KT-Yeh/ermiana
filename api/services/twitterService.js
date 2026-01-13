import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class TwitterService {
  static async getPostData(statusId) {
    // Try fxtwitter first
    try {
      const response = await axios.request({
        method: 'get',
        url: `https://api.fxtwitter.com/i/status/${statusId}`,
        timeout: 2500,
      });

      if (response.status !== 200) {
        throw new Error('fxtwitter api error');
      }

      const tweet = response.data.tweet;

      // 處理引用推文資訊
      const quoteText = tweet.quote ? `\n> RT: [@${tweet.quote.author.screen_name}](${tweet.quote.url})\n` + (tweet.quote.text ? tweet.quote.text.replace(/^/gm, '> ') : '') : '';
      const quoteMediaUrl = tweet.quote ?
        (tweet.quote.media?.mosaic ?
          (tweet.quote.media.mosaic.formats.jpeg + '?name=large').replace(/\?.*$/, '') + '?name=large' :
          (tweet.quote.media?.photos ?
            (tweet.quote.media.photos[0].url + '?name=large').replace(/\?.*$/, '') + '?name=large' :
            '')) : '';

      // 處理媒體
      const hasPhotos = tweet.media?.photos && tweet.media.photos.length > 0;
      const hasMosaic = tweet.media?.mosaic && tweet.media.mosaic.type === 'mosaic_photo';
      const hasVideos = tweet.media?.all && tweet.media.all.some((m) => m.type !== 'photo');

      // 統計資訊
      const statsInfo = `💬${tweet.replies || 0} 🔁${tweet.retweets || 0} ❤️${tweet.likes || 0}`;

      // 決定 style
      let style = 'normal';
      if (hasVideos && !hasPhotos) {
        style = 'backup'; // 純影片使用 backup link
      }

      // 建立標準回應
      const responseData = {
        success: true,
        style,
        color: '0x1DA1F2',
        author: {
          text: `@${tweet.author.screen_name}`,
          iconurl: tweet.author.avatar_url || '',
        },
        name: {
          title: tweet.author.name || 'Twitter.com',
          url: tweet.url || `https://twitter.com/i/status/${statusId}`,
        },
        description: (tweet.text + quoteText) || '',
        footer: {
          text: statsInfo,
          iconurl: 'https://ermiana.canaria.cc/pic/twitter.png',
        },
        timestamp: tweet.created_timestamp * 1000,
      };

      // 根據媒體類型添加圖片
      if (hasMosaic) {
        responseData.image = tweet.media.mosaic.formats.jpeg;
      } else if (hasPhotos && tweet.media.photos.length === 1) {
        responseData.image = (tweet.media.photos[0].url + '?name=large').replace(/\?.*$/, '') + '?name=large';
      } else if (hasPhotos && tweet.media.photos.length > 1) {
        // 多張圖片時使用組合圖
        responseData.image = tweet.media.photos[0] ? (tweet.media.photos[0].url + '?name=large').replace(/\?.*$/, '') + '?name=large' : '';
      } else if (!hasPhotos && quoteMediaUrl) {
        // 沒有圖片但有引用媒體
        responseData.image = quoteMediaUrl;
      }

      // 如果是 backup style，提供備用連結
      if (style === 'backup') {
        responseData.rollback = `https://d.vxtwitter.com/i/status/${statusId}`;
      }

      return createStandardResponse(responseData);
    } catch (fxError) {
      // Try vxtwitter as backup
      try {
        const response = await axios.request({
          method: 'get',
          url: `https://api.vxtwitter.com/i/status/${statusId}`,
          timeout: 2500,
        });

        if (response.status !== 200) {
          throw new Error('vxtwitter api error');
        }

        const vxData = response.data;

        // 處理引用推文
        const quoteText = vxData.qrt ? `\n> RT: [@${vxData.qrt.user_screen_name}](${vxData.qrt.tweetURL})\n` + (vxData.qrt.text ? vxData.qrt.text.replace(/^/gm, '> ') : '') : '';
        const quoteMediaUrl = vxData.qrt ?
          (vxData.qrt.combinedMediaUrl ||
            (Array.isArray(vxData.qrt.media_extended) && vxData.qrt.media_extended.length && vxData.qrt.media_extended[0].type === 'image' ?
              vxData.qrt.media_extended[0].url : '')) : '';

        // 處理媒體
        const hasMedia = Array.isArray(vxData.media_extended) && vxData.media_extended.length > 0;
        const images = hasMedia ? vxData.media_extended.filter((m) => m.type === 'image') : [];
        const videos = hasMedia ? vxData.media_extended.filter((m) => m.type !== 'image') : [];

        // 統計資訊
        const statsInfo = `💬${vxData.replies || 0} 🔁${vxData.retweets || 0} ❤️${vxData.likes || 0}`;

        // 決定 style
        let style = 'normal';
        if (videos.length > 0 && images.length === 0) {
          style = 'backup';
        }

        // 建立標準回應
        const responseData = {
          success: true,
          style,
          color: '0x1DA1F2',
          author: {
            text: `@${vxData.user_screen_name}`,
            iconurl: vxData.user_profile_image_url || '',
          },
          name: {
            title: vxData.user_name || 'Twitter.com',
            url: vxData.tweetURL || `https://twitter.com/i/status/${statusId}`,
          },
          description: (vxData.text + quoteText) || '',
          footer: {
            text: statsInfo,
            iconurl: 'https://ermiana.canaria.cc/pic/twitter.png',
          },
          timestamp: vxData.date_epoch * 1000,
        };

        // 添加圖片
        if (images.length === 1) {
          responseData.image = (images[0].url + '?name=large').replace(/\?.*$/, '') + '?name=large';
        } else if (images.length > 1) {
          responseData.image = vxData.combinedMediaUrl || '';
        } else if (!images.length && quoteMediaUrl) {
          responseData.image = quoteMediaUrl;
        }

        // 如果是 backup style
        if (style === 'backup') {
          responseData.rollback = `https://vxtwitter.com/i/status/${statusId}`;
        }

        return createStandardResponse(responseData);
      } catch (vxError) {
        console.error('Twitter API Error (both fx and vx failed):', vxError.message);
        // Return backup style with fallback URL
        return createStandardResponse({
          success: true,
          style: 'backup',
          color: '0x1DA1F2',
          name: {
            title: 'Twitter.com',
            url: `https://twitter.com/i/status/${statusId}`,
          },
          footer: {
            text: 'ermiana',
            iconurl: 'https://ermiana.canaria.cc/pic/twitter.png',
          },
          rollback: `https://vxtwitter.com/i/status/${statusId}`,
        });
      }
    }
  }
}
