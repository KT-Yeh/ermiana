import { EmbedBuilder } from 'discord.js';

/**
 * 建立含有多張圖片的 Embed
 * @param {Object} options - Embed 建立選項
 * @param {string} [options.title] - 標題
 * @param {string} [options.url] - URL
 * @param {string} [options.description] - 描述
 * @param {string} [options.authorName] - 作者名稱
 * @param {string} [options.authorIconURL] - 作者頭像 URL
 * @param {number} [options.color] - Embed 顏色（十六進位）
 * @param {string} options.mainImageURL - 主要顯示的圖片 URL
 * @param {number} [options.imageCount] - 圖片總數
 * @param {number} [options.timestamp] - 時間戳記
 * @returns {EmbedBuilder} Discord Embed 物件
 */
export function createMultiImageEmbed(options) {
  const {
    title,
    url,
    description,
    authorName,
    authorIconURL,
    color = 0x5865F2,
    mainImageURL,
    imageCount,
    timestamp,
  } = options;

  const embed = new EmbedBuilder();
  embed.setColor(color);

  // 設定作者資訊
  if (authorName && authorIconURL) {
    embed.setAuthor({
      name: authorName,
      iconURL: authorIconURL,
    });
  } else if (authorName) {
    embed.setAuthor({ name: authorName });
  }

  // 設定標題和 URL
  if (title) {
    embed.setTitle(title);
  }
  if (url) {
    embed.setURL(url);
  }

  // 設定描述
  let finalDescription = description || '';
  if (imageCount && imageCount > 1) {
    finalDescription += `\n\n📷 共有 ${imageCount} 張圖片`;
  }
  if (finalDescription) {
    embed.setDescription(finalDescription.substring(0, 4080));
  }

  // 設定主要圖片
  if (mainImageURL) {
    embed.setImage(mainImageURL);
  }

  // 設定時間戳記
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}

/**
 * 建立含有影片的 Embed
 * @param {Object} options - Embed 建立選項
 * @param {string} [options.title] - 標題
 * @param {string} [options.url] - URL
 * @param {string} [options.description] - 描述
 * @param {string} [options.authorName] - 作者名稱
 * @param {string} [options.authorIconURL] - 作者頭像 URL
 * @param {number} [options.color] - Embed 顏色（十六進位）
 * @param {string} [options.thumbnailURL] - 影片縮圖 URL
 * @param {number} [options.videoCount] - 影片總數
 * @param {number} [options.timestamp] - 時間戳記
 * @returns {EmbedBuilder} Discord Embed 物件
 */
export function createVideoEmbed(options) {
  const {
    title,
    url,
    description,
    authorName,
    authorIconURL,
    color = 0x5865F2,
    thumbnailURL,
    videoCount,
    timestamp,
  } = options;

  const embed = new EmbedBuilder();
  embed.setColor(color);

  // 設定作者資訊
  if (authorName && authorIconURL) {
    embed.setAuthor({
      name: authorName,
      iconURL: authorIconURL,
    });
  } else if (authorName) {
    embed.setAuthor({ name: authorName });
  }

  // 設定標題和 URL
  if (title) {
    embed.setTitle(title);
  }
  if (url) {
    embed.setURL(url);
  }

  // 設定描述
  let finalDescription = description || '';
  if (videoCount && videoCount > 1) {
    finalDescription += `\n\n🎥 共有 ${videoCount} 個影片`;
  }
  if (finalDescription) {
    embed.setDescription(finalDescription.substring(0, 4080));
  }

  // 設定影片縮圖
  if (thumbnailURL) {
    embed.setImage(thumbnailURL);
  }

  // 設定時間戳記
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}

/**
 * 建立混合媒體（圖片+影片）的 Embed
 * @param {Object} options - Embed 建立選項
 * @param {string} [options.title] - 標題
 * @param {string} [options.url] - URL
 * @param {string} [options.description] - 描述
 * @param {string} [options.authorName] - 作者名稱
 * @param {string} [options.authorIconURL] - 作者頭像 URL
 * @param {number} [options.color] - Embed 顏色（十六進位）
 * @param {string} options.mainImageURL - 主要顯示的圖片 URL
 * @param {number} [options.imageCount] - 圖片總數
 * @param {number} [options.videoCount] - 影片總數
 * @param {number} [options.timestamp] - 時間戳記
 * @returns {EmbedBuilder} Discord Embed 物件
 */
export function createMixedMediaEmbed(options) {
  const {
    title,
    url,
    description,
    authorName,
    authorIconURL,
    color = 0x5865F2,
    mainImageURL,
    imageCount = 0,
    videoCount = 0,
    timestamp,
  } = options;

  const embed = new EmbedBuilder();
  embed.setColor(color);

  // 設定作者資訊
  if (authorName && authorIconURL) {
    embed.setAuthor({
      name: authorName,
      iconURL: authorIconURL,
    });
  } else if (authorName) {
    embed.setAuthor({ name: authorName });
  }

  // 設定標題和 URL
  if (title) {
    embed.setTitle(title);
  }
  if (url) {
    embed.setURL(url);
  }

  // 設定描述
  let finalDescription = description || '';
  const mediaInfo = [];
  if (imageCount > 0) {
    mediaInfo.push(`📷 ${imageCount} 張圖片`);
  }
  if (videoCount > 0) {
    mediaInfo.push(`🎥 ${videoCount} 個影片`);
  }
  if (mediaInfo.length > 0) {
    finalDescription += `\n\n${mediaInfo.join(' | ')}`;
  }
  if (finalDescription) {
    embed.setDescription(finalDescription.substring(0, 4080));
  }

  // 設定主要圖片
  if (mainImageURL) {
    embed.setImage(mainImageURL);
  }

  // 設定時間戳記
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}

/**
 * 建立 Pixiv 多圖作品的 Embed
 * @param {Object} options - Pixiv 多圖 Embed 選項
 * @returns {EmbedBuilder} Pixiv Embed 物件
 */
export function createPixivMultiImageEmbed(options) {
  return createMultiImageEmbed({
    ...options,
    color: 0x0096fa,
  });
}
