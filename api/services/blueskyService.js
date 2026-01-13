import axios from 'axios';
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

export class BlueskyService {
  static async getPostData(handle, postId) {
    // Try bskx.app API first
    try {
      const response = await axios.request({
        method: 'get',
        url: `https://bskx.app/profile/${handle}/post/${postId}/json`,
        timeout: 2500,
        headers: {
          'User-Agent': 'ermiana (https://github.com/canaria3406/ermiana)',
        },
      });

      if (response.status !== 200 || !response.data.posts || response.data.posts.length === 0) {
        throw new Error('bskx.app failed');
      }

      const post = response.data.posts[0];

      // Extract media
      const media = {
        type: post.embed?.$type || null,
        images: [],
        videos: [],
        thumbnail: null,
      };

      if (post.embed?.$type === 'app.bsky.embed.images#view' && post.embed.images) {
        media.images = post.embed.images.map((img) => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || '',
        }));
      } else if (post.embed?.$type === 'app.bsky.embed.video#view') {
        media.thumbnail = post.embed.thumbnail;
        media.videos.push({
          directUrl: `https://r.bskx.app/profile/${handle}/post/${postId}`,
        });
      } else if (post.embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
        if (post.embed.media?.images) {
          media.images = post.embed.media.images.map((img) => ({
            thumb: img.thumb,
            fullsize: img.fullsize,
            alt: img.alt || '',
          }));
        }
      }

      // 統計資訊
      const statsInfo = `💬${post.replyCount || 0} 🔁${post.repostCount || 0} ❤️${post.likeCount || 0}`;

      // 決定 style
      let style = 'normal';
      let image = null;
      let imageArray = null;

      if (media.type === 'app.bsky.embed.video#view') {
        style = 'backup';
      } else if (media.images && media.images.length > 1) {
        style = 'more';
        image = media.images[0].fullsize;
        imageArray = media.images.slice(1, 4).map((img) => img.fullsize);
      } else if (media.images && media.images.length === 1) {
        style = 'normal';
        image = media.images[0].fullsize;
      }

      // 建立標準回應
      const responseData = {
        success: true,
        style,
        color: '0x53b4ff',
        author: {
          text: `@${handle}`,
          iconurl: post.author?.avatar || '',
        },
        name: {
          title: post.author?.displayName || handle,
          url: `https://bsky.app/profile/${handle}/post/${postId}`,
        },
        description: post.record?.text || '',
        footer: {
          text: statsInfo,
          iconurl: 'https://ermiana.canaria.cc/pic/bluesky.png',
        },
      };

      if (image) {
        responseData.image = image;
      }
      if (imageArray) {
        responseData.imageArray = imageArray;
      }
      if (style === 'backup') {
        responseData.rollback = `https://r.bskx.app/profile/${handle}/post/${postId}`;
      }
      if (post.record?.createdAt) {
        responseData.timestamp = new Date(post.record.createdAt).getTime();
      }

      return createStandardResponse(responseData);
    } catch (bskxError) {
      // Try official Bluesky API as backup
      try {
        console.log('bskx.app failed, trying official Bluesky API...');
        const threadResponse = await axios.request({
          method: 'get',
          url: `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${postId}`,
          timeout: 2500,
          headers: {
            'User-Agent': 'ermiana (https://github.com/canaria3406/ermiana)',
          },
        });

        if (!threadResponse.data.thread?.post) {
          throw new Error('Bluesky Thread API failed');
        }

        const threadPost = threadResponse.data.thread.post;

        // Extract media from thread response
        const media = {
          type: threadPost.embed?.$type || null,
          images: [],
          videos: [],
          thumbnail: null,
        };

        if (threadPost.embed?.images) {
          media.images = threadPost.embed.images.map((img) => ({
            thumb: img.thumb,
            fullsize: img.fullsize,
            alt: img.alt || '',
          }));
        } else if (threadPost.embed?.$type === 'app.bsky.embed.video#view') {
          media.thumbnail = threadPost.embed.thumbnail;
          media.videos.push({
            directUrl: `https://r.bskx.app/profile/${handle}/post/${postId}`,
          });
        }

        // 統計資訊
        const statsInfo = `💬${threadPost.replyCount || 0} 🔁${threadPost.repostCount || 0} ❤️${threadPost.likeCount || 0}`;

        // 決定 style
        let style = 'normal';
        let image = null;
        let imageArray = null;

        if (media.type === 'app.bsky.embed.video#view') {
          style = 'backup';
        } else if (media.images && media.images.length > 1) {
          style = 'more';
          image = media.images[0].fullsize;
          imageArray = media.images.slice(1, 4).map((img) => img.fullsize);
        } else if (media.images && media.images.length === 1) {
          style = 'normal';
          image = media.images[0].fullsize;
        }

        // 建立標準回應
        const responseData = {
          success: true,
          style,
          color: '0x53b4ff',
          author: {
            text: `@${handle}`,
            iconurl: threadPost.author?.avatar || '',
          },
          name: {
            title: threadPost.author?.displayName || handle,
            url: `https://bsky.app/profile/${handle}/post/${postId}`,
          },
          description: threadPost.record?.text || '',
          footer: {
            text: statsInfo,
            iconurl: 'https://ermiana.canaria.cc/pic/bluesky.png',
          },
        };

        if (image) {
          responseData.image = image;
        }
        if (imageArray) {
          responseData.imageArray = imageArray;
        }
        if (style === 'backup') {
          responseData.rollback = `https://r.bskx.app/profile/${handle}/post/${postId}`;
        }
        if (threadPost.record?.createdAt) {
          responseData.timestamp = new Date(threadPost.record.createdAt).getTime();
        }

        return createStandardResponse(responseData);
      } catch (threadError) {
        console.error('Bluesky API Error (both APIs failed):', threadError.message);
        // Return backup style
        return createStandardResponse({
          success: true,
          style: 'backup',
          color: '0x53b4ff',
          name: {
            title: 'Bluesky',
            url: `https://bsky.app/profile/${handle}/post/${postId}`,
          },
          footer: {
            text: 'ermiana',
            iconurl: 'https://ermiana.canaria.cc/pic/bluesky.png',
          },
          rollback: `https://bskx.app/profile/${handle}/post/${postId}`,
        });
      }
    }
  }
}
