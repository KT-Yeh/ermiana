import { EmbedBuilder } from 'discord.js';

/**
 * 建立內容平台類型的 Embed（如 Pixiv, Bilibili, Plurk 等）
 * @param {Object} options - Embed 建立選項
 * @param {string} [options.title] - 作品/內容標題
 * @param {string} [options.url] - 內容 URL
 * @param {string} [options.description] - 內容描述
 * @param {string} [options.authorName] - 作者名稱
 * @param {string} [options.authorId] - 作者 ID
 * @param {string} [options.authorURL] - 作者頁面 URL
 * @param {string} [options.authorIconURL] - 作者頭像 URL
 * @param {string} [options.imageURL] - 主要圖片 URL
 * @param {number} [options.color] - Embed 顏色（十六進位）
 * @param {Array<Object>} [options.fields] - 額外欄位陣列
 * @param {number} [options.timestamp] - 時間戳記
 * @returns {EmbedBuilder} Discord Embed 物件
 */
export function createContentPlatformEmbed(options) {
  const {
    title,
    url,
    description,
    authorName,
    authorId,
    authorURL,
    authorIconURL,
    imageURL,
    color = 0x0096fa,
    fields = [],
    timestamp,
  } = options;

  const embed = new EmbedBuilder();
  embed.setColor(color);

  // 設定作者資訊
  if (authorId && authorIconURL) {
    embed.setAuthor({
      name: authorId,
      iconURL: authorIconURL,
    });
  } else if (authorId) {
    embed.setAuthor({ name: authorId });
  }

  // 設定標題和 URL
  if (title) {
    embed.setTitle(title);
  }
  if (url) {
    embed.setURL(url);
  }

  // 設定描述
  if (description) {
    embed.setDescription(description.substring(0, 4080));
  }

  // 添加欄位
  if (fields && fields.length > 0) {
    embed.addFields(fields);
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
 * 建立 Pixiv 特定的 Embed
 * @param {Object} options - Pixiv Embed 選項
 * @returns {EmbedBuilder} Pixiv Embed 物件
 */
export function createPixivEmbed(options) {
  const { userId, userName, bookmarkCount, tags, ...otherOptions } = options;

  const fields = [];

  // 添加作者欄位
  if (userName && userId) {
    fields.push({
      name: '作者',
      value: `[${userName}](https://www.pixiv.net/users/${userId})`,
      inline: true,
    });
  }

  // 添加收藏欄位
  if (bookmarkCount !== undefined) {
    fields.push({
      name: '收藏',
      value: bookmarkCount.toString(),
      inline: true,
    });
  }

  // 添加標籤欄位
  if (tags) {
    fields.push({
      name: '標籤',
      value: tags,
    });
  }

  return createContentPlatformEmbed({
    ...otherOptions,
    color: 0x0096fa,
    fields,
  });
}

/**
 * 建立 Bilibili 特定的 Embed
 * @param {Object} options - Bilibili Embed 選項
 * @returns {EmbedBuilder} Bilibili Embed 物件
 */
export function createBilibiliEmbed(options) {
  return createContentPlatformEmbed({
    ...options,
    color: 0x00aeec,
  });
}

/**
 * 建立 Plurk 特定的 Embed
 * @param {Object} options - Plurk Embed 選項
 * @returns {EmbedBuilder} Plurk Embed 物件
 */
export function createPlurkEmbed(options) {
  return createContentPlatformEmbed({
    ...options,
    color: 0xefa54c,
  });
}

/**
 * 建立 Misskey 特定的 Embed
 * @param {Object} options - Misskey Embed 選項
 * @returns {EmbedBuilder} Misskey Embed 物件
 */
export function createMisskeyEmbed(options) {
  return createContentPlatformEmbed({
    ...options,
    color: 0x99c539,
  });
}

/**
 * 建立 PTT 特定的 Embed
 * @param {Object} options - PTT Embed 選項
 * @returns {EmbedBuilder} PTT Embed 物件
 */
export function createPttEmbed(options) {
  return createContentPlatformEmbed({
    ...options,
    color: 0x013370,
  });
}
