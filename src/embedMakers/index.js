/**
 * Embed Makers 中介層統一導出檔案
 *
 * 此模組提供了一個統一的介面來建立不同平台的 Discord Embed 物件
 * 將原本分散在各個 regex handler 中的 embed 建立邏輯抽離成獨立的中介層
 *
 * 使用範例：
 * import { createTwitterEmbed, createPixivEmbed } from '../embedMakers/index.js';
 */

// 社群媒體平台 Embed Makers
export {
  createSocialMediaEmbed,
  createTwitterEmbed,
  createBlueskyEmbed,
  createThreadsEmbed,
} from './socialMediaEmbedMaker.js';

// 內容平台 Embed Makers
export {
  createContentPlatformEmbed,
  createPixivEmbed,
  createBilibiliEmbed,
  createPlurkEmbed,
  createMisskeyEmbed,
  createPttEmbed,
} from './contentPlatformEmbedMaker.js';

// 基礎平台 Embed Makers
export {
  createBasicEmbed,
  createPchomeEmbed,
  createBahaEmbed,
  createEhEmbed,
  createTiktokEmbed,
  createInstagramEmbed,
  createWeiboEmbed,
} from './basicEmbedMaker.js';

// 媒體處理 Embed Makers
export {
  createMultiImageEmbed,
  createVideoEmbed,
  createMixedMediaEmbed,
  createPixivMultiImageEmbed,
} from './mediaEmbedMaker.js';
