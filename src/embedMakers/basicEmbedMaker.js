import { EmbedBuilder } from 'discord.js';

/**
 * 建立基礎簡易的 Embed
 * @param {Object} options - Embed 建立選項
 * @param {string} [options.title] - 標題
 * @param {string} [options.url] - URL
 * @param {string} [options.description] - 描述
 * @param {number} [options.color] - Embed 顏色（十六進位）
 * @param {string} [options.imageURL] - 圖片 URL
 * @param {string} [options.thumbnailURL] - 縮圖 URL
 * @param {Array<Object>} [options.fields] - 欄位陣列
 * @param {string} [options.footer] - 頁尾文字
 * @param {string} [options.footerIconURL] - 頁尾圖示 URL
 * @param {number} [options.timestamp] - 時間戳記
 * @returns {EmbedBuilder} Discord Embed 物件
 */
export function createBasicEmbed(options) {
  const {
    title,
    url,
    description,
    color = 0x5865F2,
    imageURL,
    thumbnailURL,
    fields = [],
    footer,
    footerIconURL,
    timestamp,
  } = options;

  const embed = new EmbedBuilder();

  // 設定顏色
  embed.setColor(color);

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

  // 設定圖片
  if (imageURL) {
    embed.setImage(imageURL);
  }

  // 設定縮圖
  if (thumbnailURL) {
    embed.setThumbnail(thumbnailURL);
  }

  // 添加欄位
  if (fields && fields.length > 0) {
    embed.addFields(fields);
  }

  // 設定頁尾
  if (footer) {
    if (footerIconURL) {
      embed.setFooter({ text: footer, iconURL: footerIconURL });
    } else {
      embed.setFooter({ text: footer });
    }
  }

  // 設定時間戳記
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}

/**
 * 建立 PChome 特定的 Embed
 * @param {Object} options - PChome Embed 選項
 * @returns {EmbedBuilder} PChome Embed 物件
 */
export function createPchomeEmbed(options) {
  return createBasicEmbed({
    ...options,
    color: 0xff6600,
  });
}

/**
 * 建立 Baha（巴哈姆特）特定的 Embed
 * @param {Object} options - Baha Embed 選項
 * @returns {EmbedBuilder} Baha Embed 物件
 */
export function createBahaEmbed(options) {
  return createBasicEmbed({
    ...options,
    color: 0x3578cd,
  });
}

/**
 * 建立 EH（E-Hentai）特定的 Embed
 * @param {Object} options - EH Embed 選項
 * @returns {EmbedBuilder} EH Embed 物件
 */
export function createEhEmbed(options) {
  return createBasicEmbed({
    ...options,
    color: 0xe95959,
  });
}

/**
 * 建立 TikTok 特定的 Embed
 * @param {Object} options - TikTok Embed 選項
 * @returns {EmbedBuilder} TikTok Embed 物件
 */
export function createTiktokEmbed(options) {
  return createBasicEmbed({
    ...options,
    color: 0x000000,
  });
}

/**
 * 建立 Instagram 特定的 Embed
 * @param {Object} options - Instagram Embed 選項
 * @returns {EmbedBuilder} Instagram Embed 物件
 */
export function createInstagramEmbed(options) {
  return createBasicEmbed({
    ...options,
    color: 0xE4405F,
  });
}

/**
 * 建立 Weibo（微博）特定的 Embed
 * @param {Object} options - Weibo Embed 選項
 * @returns {EmbedBuilder} Weibo Embed 物件
 */
export function createWeiboEmbed(options) {
  return createBasicEmbed({
    ...options,
    color: 0xe6162d,
  });
}
