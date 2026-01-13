import { EmbedBuilder } from 'discord.js';

/**
 * 建立社群媒體類型的 Embed（如 Twitter, Bluesky, Threads）
 * @param {Object} options - Embed 建立選項
 * @param {string} options.authorId - 作者 ID 或用戶名
 * @param {string} [options.authorIconURL] - 作者頭像 URL
 * @param {string} [options.authorName] - 作者顯示名稱
 * @param {string} [options.postURL] - 貼文完整 URL
 * @param {string} [options.postText] - 貼文內文
 * @param {string} [options.imageURL] - 圖片 URL
 * @param {number} [options.timestamp] - 貼文時間戳記
 * @param {number} [options.color] - Embed 顏色（十六進位）
 * @param {string} [options.platformName] - 平台名稱（用於標題）
 * @returns {EmbedBuilder} Discord Embed 物件
 */
export function createSocialMediaEmbed(options) {
  const {
    authorId,
    authorIconURL,
    authorName,
    postURL,
    postText,
    imageURL,
    timestamp,
    color = 0x1DA1F2,
    platformName = 'Social Media',
  } = options;

  const embed = new EmbedBuilder();
  embed.setColor(color);

  // 設定作者資訊
  if (authorId && authorIconURL) {
    embed.setAuthor({ name: '@' + authorId, iconURL: authorIconURL });
  } else if (authorId) {
    embed.setAuthor({ name: '@' + authorId });
  }

  // 設定標題
  if (authorName) {
    embed.setTitle(authorName);
  } else {
    embed.setTitle(platformName);
  }

  // 設定 URL
  if (postURL) {
    embed.setURL(postURL);
  }

  // 設定描述文字
  if (postText) {
    embed.setDescription(postText.substring(0, 4080));
  }

  // 設定圖片
  if (imageURL) {
    embed.setImage(imageURL);
  }

  // 設定時間戳記
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}

/**
 * 建立 Twitter 特定的 Embed
 * @param {string} authorID - Twitter 用戶 ID
 * @param {string} autherIconURL - 用戶頭像 URL
 * @param {string} autherName - 用戶顯示名稱
 * @param {string} tweetURL - 推文 URL
 * @param {string} tweetText - 推文內容
 * @param {string} tweetImage - 推文圖片
 * @param {number} tweetTimestamp - 推文時間戳記
 * @returns {EmbedBuilder} Twitter Embed 物件
 */
export function createTwitterEmbed(
  authorID,
  autherIconURL,
  autherName,
  tweetURL,
  tweetText,
  tweetImage,
  tweetTimestamp,
) {
  return createSocialMediaEmbed({
    authorId: authorID,
    authorIconURL: autherIconURL,
    authorName: autherName || 'Twitter.com',
    postURL: tweetURL,
    postText: tweetText,
    imageURL: tweetImage,
    timestamp: tweetTimestamp,
    color: 0x1DA1F2,
  });
}

/**
 * 建立 Bluesky 特定的 Embed
 * @param {Object} options - Bluesky Embed 選項
 * @returns {EmbedBuilder} Bluesky Embed 物件
 */
export function createBlueskyEmbed(options) {
  return createSocialMediaEmbed({
    ...options,
    color: 0x53b4ff,
    platformName: 'Bluesky',
  });
}

/**
 * 建立 Threads 特定的 Embed
 * @param {Object} options - Threads Embed 選項
 * @returns {EmbedBuilder} Threads Embed 物件
 */
export function createThreadsEmbed(options) {
  return createSocialMediaEmbed({
    ...options,
    color: 0x000000,
    platformName: 'Threads',
  });
}
