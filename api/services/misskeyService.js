import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class MisskeyService {
  static async getNoteData(noteId) {
    try {
      const response = await axios.request({
        method: 'post',
        url: 'https://misskey.io/api/notes/show',
        data: { noteId },
        timeout: 5000,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch Misskey data');
      }

      const note = response.data;

      // 處理媒體檔案
      const images = note.files?.filter((f) => f.type.startsWith('image/')) || [];
      const videos = note.files?.filter((f) => f.type.startsWith('video/')) || [];

      // 統計資訊（反應總數）
      const totalReactions = Object.values(note.reactions || {}).reduce((a, b) => a + b, 0);
      const statsInfo = `💬${note.repliesCount || 0} 🔁${note.renoteCount || 0} ❤️${totalReactions}`;

      // 決定 style
      let style = 'normal';
      let image = null;
      let imageArray = null;

      if (images.length === 0) {
        style = 'normal';
      } else if (images.length === 1) {
        style = 'normal';
        image = images[0].url;
      } else {
        style = 'more';
        image = images[0].url;
        imageArray = images.slice(1, 4).map((img) => img.url);
      }

      // 建立標準回應
      const responseData = {
        success: true,
        style,
        color: '0x99c539',
        author: {
          text: `@${note.user.username}`,
          iconurl: note.user.avatarUrl || '',
        },
        name: {
          title: note.user.name || note.user.username,
          url: `https://misskey.io/notes/${noteId}`,
        },
        description: note.text || '',
        footer: {
          text: statsInfo,
          iconurl: 'https://ermiana.canaria.cc/pic/misskey.png',
        },
      };

      if (image) {
        responseData.image = image;
      }
      if (imageArray) {
        responseData.imageArray = imageArray;
      }
      if (note.createdAt) {
        responseData.timestamp = new Date(note.createdAt).getTime();
      }

      return createStandardResponse(responseData);
    } catch (error) {
      console.error('Misskey API Error:', error.message);
      throw createErrorResponse(
        error.message || 'Failed to fetch Misskey data',
        'MISSKEY_API_ERROR',
      );
    }
  }
}
