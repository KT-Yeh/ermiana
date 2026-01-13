import { EmbedBuilder } from 'discord.js';
import axios from 'axios';
import { typingSender } from '../events/typingSender.js';
import { embedSuppresser } from '../events/embedSuppresser.js';
import { messageSender } from '../events/messageSender.js';
import { messageSenderMore } from '../events/messageSenderMore.js';
import { messageSenderPixiv } from '../events/messageSenderPixiv.js';
import { backupLinkSender } from '../events/backupLinkSender.js';
import { configManager } from '../utils/configManager.js';

/**
 * 根據標準化 API 回應創建 Embed
 * @param {Object} data - API 返回的標準化數據
 * @returns {EmbedBuilder} Discord Embed 物件
 */
function createEmbedFromAPI(data) {
  const embed = new EmbedBuilder();

  // 設定顏色
  if (data.color) {
    embed.setColor(data.color);
  }

  // 設定標題和 URL
  if (data.name && data.name.title) {
    embed.setTitle(data.name.title);
  }
  if (data.name && data.name.url) {
    embed.setURL(data.name.url);
  }

  // 設定作者
  if (data.author && data.author.text) {
    embed.setAuthor({
      name: data.author.text,
      iconURL: data.author.iconurl,
    });
  }

  // 設定描述
  if (data.description) {
    embed.setDescription(data.description.substring(0, 4080));
  }

  // 根據 style 添加圖片
  if (data.style === 'normal' && data.image) {
    embed.setImage(data.image);
  } else if (data.style === 'pixiv' && data.imagePixiv) {
    embed.setImage(data.imagePixiv.url);
  }

  // 添加額外欄位
  if (data.fields && Array.isArray(data.fields)) {
    data.fields.forEach((field) => {
      embed.addFields({
        name: field.name,
        value: field.value,
        inline: field.inline || false,
      });
    });
  }

  // 設定頁尾（稍後由 messageSender 函數覆蓋）
  if (data.footer) {
    embed.setFooter({
      text: data.footer.text,
      iconURL: data.footer.iconurl,
    });
  }

  return embed;
}

/**
 * 統一的 API 調用處理器（新標準化格式）
 * @param {Object} options - 處理選項
 * @param {string} options.apiPath - API 路徑
 * @param {Object} options.message - Discord 訊息對象
 * @param {boolean} options.spoiler - 是否使用劇透標籤
 */
export async function handleAPIRequest(options) {
  const { apiPath, message, spoiler } = options;

  typingSender(message);
  const config = await configManager();

  try {
    const apiResp = await axios.request({
      method: 'get',
      url: `${config.API_URL}${apiPath}`,
      timeout: 5000,
    });

    if (apiResp.status === 200 && apiResp.data.success) {
      const data = apiResp.data;
      const embed = createEmbedFromAPI(data);

      // 根據 style 選擇對應的發送函數
      switch (data.style) {
        case 'normal':
          await messageSender(message, spoiler, embed);
          break;

        case 'more':
          if (data.imageArray && Array.isArray(data.imageArray)) {
            await messageSenderMore(message, spoiler, embed, data.imageArray);
          } else {
            await messageSender(message, spoiler, embed);
          }
          break;

        case 'pixiv':
          if (data.imagePixiv && data.imagePixiv.count) {
            await messageSenderPixiv(message, spoiler, embed, data.imagePixiv.count);
          } else {
            await messageSender(message, spoiler, embed);
          }
          break;

        case 'backup':
          if (data.rollback) {
            await backupLinkSender(message, spoiler, data.rollback);
            embedSuppresser(message);
          } else {
            await messageSender(message, spoiler, embed);
          }
          break;

        default:
          await messageSender(message, spoiler, embed);
      }
    } else {
      embedSuppresser(message);
    }
  } catch {
    embedSuppresser(message);
  }
}

/* 統一的 POST API 調用處理器 */
export async function handleAPIPostRequest(options) {
  const { platform, apiPath, message, spoiler, postData, buildEmbed, sendMessage } = options;

  typingSender(message);
  const config = await configManager();

  try {
    const apiResp = await axios.request({
      method: 'post',
      url: `${config.API_URL}${apiPath}`,
      data: postData,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (apiResp.status === 200 && apiResp.data.success) {
      const data = apiResp.data.data;
      const platformConfig = apiResp.data.platform;

      const embed = new EmbedBuilder();
      embed.setColor(platformConfig.color);

      await buildEmbed(embed, data, platformConfig);
      await sendMessage(message, spoiler, platformConfig.iconURL, embed, data);

      embedSuppresser(message);
    } else {
      throw new Error('API returned unsuccessful response');
    }
  } catch (error) {
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    console.error(`${platformName} API handler error:`, error.message);
    console.log(`${platform} error: ${message.guild.name}`);
  }
}
