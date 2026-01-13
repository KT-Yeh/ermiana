# Embed Makers 中介層

這個目錄包含了用於建立 Discord Embed 的中介層函式，將原本分散在各個 regex handler 中的 embed 建立邏輯統一管理。

## 檔案結構

```
embedMakers/
├── index.js                        # 統一導出檔案
├── socialMediaEmbedMaker.js        # 社群媒體平台（Twitter, Bluesky, Threads）
├── contentPlatformEmbedMaker.js    # 內容平台（Pixiv, Bilibili, Plurk, Misskey, PTT）
├── basicEmbedMaker.js              # 基礎平台（PChome, Baha, EH, TikTok, Instagram, Weibo）
├── mediaEmbedMaker.js              # 媒體處理（多圖、影片、混合媒體）
└── README.md                       # 說明文件
```

## 設計理念

### 參考自 src/events 的架構
就像 `src/events` 將訊息發送邏輯抽離成獨立模組（`messageSender.js`, `embedSuppresser.js` 等），這個 `embedMakers` 目錄將 Embed 建立邏輯從各個 regex handler 中抽離出來，提供：

- **模組化**：每個平台類型有自己的檔案
- **可重用性**：相同的 embed 建立邏輯可以在多個地方使用
- **易維護性**：修改 embed 樣式時只需要改一個地方
- **統一介面**：所有 embed maker 都遵循相似的參數結構

## 使用方式

### 基本導入

```javascript
// 從統一導出檔導入
import { createTwitterEmbed, createPixivEmbed } from '../embedMakers/index.js';

// 或從個別檔案導入
import { createTwitterEmbed } from '../embedMakers/socialMediaEmbedMaker.js';
```

### 使用範例

#### 1. Twitter Embed（社群媒體類型）

**原本在 handleTwitterRegexV2.js 中：**
```javascript
function twitterEmbedMaker(autherID, autherIconURL, autherName, tweetURL, tweetText, tweetImage, tweetTimestamp) {
  const twitterEmbed = new EmbedBuilder();
  twitterEmbed.setColor(0x1DA1F2);
  if (autherID && autherIconURL) {
    twitterEmbed.setAuthor({ name: '@' + autherID, iconURL: autherIconURL });
  }
  // ... 更多程式碼
}
```

**使用新的中介層：**
```javascript
import { createTwitterEmbed } from '../embedMakers/index.js';

const twitterEmbed = createTwitterEmbed(
  authorID,
  authorIconURL,
  authorName,
  tweetURL,
  tweetText,
  tweetImage,
  tweetTimestamp
);
```

#### 2. Pixiv Embed（內容平台類型）

```javascript
import { createPixivEmbed } from '../embedMakers/index.js';

const pixivEmbed = createPixivEmbed({
  title: '作品標題',
  url: 'https://www.pixiv.net/artworks/12345',
  description: '作品描述',
  userId: '123456',
  userName: '作者名稱',
  bookmarkCount: 1000,
  tags: '[tag1](url1), [tag2](url2)',
  imageURL: 'https://pixiv.canaria.cc/...',
});
```

#### 3. Bilibili Embed（內容平台類型）

```javascript
import { createBilibiliEmbed } from '../embedMakers/index.js';

const bilibiliEmbed = createBilibiliEmbed({
  title: '用戶名稱',
  url: 'https://t.bilibili.com/...',
  description: '動態內容',
  authorId: '123456',
  authorIconURL: 'https://...',
  imageURL: 'https://...',
});
```

#### 4. 多圖處理（媒體類型）

```javascript
import { createMultiImageEmbed } from '../embedMakers/index.js';

const multiImageEmbed = createMultiImageEmbed({
  title: '標題',
  url: 'https://...',
  description: '描述',
  authorName: '作者',
  authorIconURL: 'https://...',
  color: 0x0096fa,
  mainImageURL: 'https://...', // 第一張圖片
  imageCount: 5, // 會自動顯示 "📷 共有 5 張圖片"
});
```

## 檔案說明

### socialMediaEmbedMaker.js
處理社群媒體平台的 Embed，特色是強調作者資訊和互動數據。

**包含函式：**
- `createSocialMediaEmbed()` - 通用社群媒體 embed
- `createTwitterEmbed()` - Twitter 專用
- `createBlueskyEmbed()` - Bluesky 專用
- `createThreadsEmbed()` - Threads 專用

**適用於：** Twitter, Bluesky, Threads

### contentPlatformEmbedMaker.js
處理內容分享平台的 Embed，強調作品資訊和標籤。

**包含函式：**
- `createContentPlatformEmbed()` - 通用內容平台 embed
- `createPixivEmbed()` - Pixiv 專用（含收藏數、標籤）
- `createBilibiliEmbed()` - Bilibili 專用
- `createPlurkEmbed()` - Plurk 專用
- `createMisskeyEmbed()` - Misskey 專用
- `createPttEmbed()` - PTT 專用

**適用於：** Pixiv, Bilibili, Plurk, Misskey, PTT

### basicEmbedMaker.js
提供基礎的 Embed 建立功能，適合簡單的平台。

**包含函式：**
- `createBasicEmbed()` - 通用基礎 embed
- `createPchomeEmbed()` - PChome 專用
- `createBahaEmbed()` - 巴哈姆特專用
- `createEhEmbed()` - E-Hentai 專用
- `createTiktokEmbed()` - TikTok 專用
- `createInstagramEmbed()` - Instagram 專用
- `createWeiboEmbed()` - 微博專用

**適用於：** PChome, Baha, EH, TikTok, Instagram, Weibo

### mediaEmbedMaker.js
專門處理多媒體內容（多圖、影片、混合）。

**包含函式：**
- `createMultiImageEmbed()` - 多張圖片
- `createVideoEmbed()` - 影片內容
- `createMixedMediaEmbed()` - 混合媒體（圖片+影片）
- `createPixivMultiImageEmbed()` - Pixiv 多圖專用

**適用於：** 需要處理多張圖片或影片的任何平台

## 遷移指南

如果你想將現有的 regex handler 遷移到使用這些 embed makers：

### 步驟 1：導入需要的函式
```javascript
import { createTwitterEmbed } from '../embedMakers/index.js';
```

### 步驟 2：找出原本的 embed 建立邏輯
通常是一個 `new EmbedBuilder()` 開始，然後設定各種屬性。

### 步驟 3：準備參數物件
根據你選擇的 embed maker 函式，準備對應的參數。

### 步驟 4：替換原本的程式碼
```javascript
// 原本的程式碼
const embed = new EmbedBuilder();
embed.setColor(0x1DA1F2);
embed.setTitle(name);
// ...

// 替換成
const embed = createTwitterEmbed(
  authorID,
  authorIconURL,
  authorName,
  tweetURL,
  tweetText,
  tweetImage,
  tweetTimestamp
);
```

## 平台顏色參考

每個平台都有其專屬的品牌顏色：

- Twitter: `0x1DA1F2` (淺藍色)
- Bluesky: `0x53b4ff` (天藍色)
- Pixiv: `0x0096fa` (藍色)
- Bilibili: `0x00aeec` (粉藍色)
- Plurk: `0xefa54c` (橘色)
- Misskey: `0x99c539` (綠色)
- PTT: `0x013370` (深藍色)
- PChome: `0xff6600` (橘紅色)
- Baha: `0x3578cd` (藍色)
- EH: `0xe95959` (紅色)
- TikTok: `0x000000` (黑色)
- Instagram: `0xE4405F` (粉紅色)
- Weibo: `0xe6162d` (紅色)

## 優點

1. **程式碼重用**：相同的 embed 邏輯不需要重複寫
2. **統一風格**：所有平台的 embed 遵循一致的格式
3. **易於維護**：要修改某個平台的 embed 樣式，只需要改一個地方
4. **類型安全**：所有函式都有完整的 JSDoc 註解
5. **模組化設計**：按平台類型分類，容易找到需要的函式

## 與 src/events 的關係

這個 `embedMakers` 目錄與 `src/events` 目錄相輔相成：

- **embedMakers**: 負責**建立** Embed 物件
- **events**: 負責**發送** Embed 訊息

典型使用流程：
```javascript
import { createTwitterEmbed } from '../embedMakers/index.js';
import { messageSender } from '../events/messageSender.js';

// 1. 建立 Embed
const embed = createTwitterEmbed(...);

// 2. 發送 Embed
messageSender(message, spoiler, iconURL, embed, tweetInfo);
```

## 未來擴充

如果需要新增其他平台的 embed maker：

1. 判斷平台類型（社群媒體、內容平台、基礎平台、媒體處理）
2. 在對應的檔案中新增函式
3. 在 `index.js` 中新增導出
4. 在這個 README 中更新文件

## 貢獻

如果你發現某個平台的 embed 需要特殊處理，歡迎：
1. 在對應的檔案中新增專用函式
2. 更新這個 README
3. 在相關的 regex handler 中使用新函式
