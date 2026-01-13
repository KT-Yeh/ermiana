# API 統一回傳格式修改指南

## 統一格式規範

所有 API 必須回傳以下格式（所有欄位皆為**字串**）：

```javascript
{
  success: true | false,                // 必填，布林值
  style: "normal" | "more" | "pixiv" | "backup",  // 必填，預設 "normal"
  color: 0x1DA1F2,                      // 必填，數字 (hex 轉整數)
  author: {                             // 可選
    text: "作者名稱",
    iconurl: "作者頭像 URL"
  },
  name: {                             // 必填
    title: "標題",
    url: "連結 URL"
  },
  description: "描述文字",             // 可選
  image: "圖片 URL",                  // 可選 (style = normal)
  imageArray: ["圖1", "圖2"...],      // 可選 (style = more)
  imagePixiv: {                       // 可選 (style = pixiv)
    url: "第一張圖 URL",
    count: 5                          // 總數
  },
  fields: [                           // 可選
    {
      name: "欄位名稱",
      value: "欄位值",
      inline: true | false
    }
  ],
  footer: {                           // 必填
    text: "ermiana",                  // 預設值
    iconurl: "https://ermiana.canaria.cc/pic/canaria.png"  // 預設值
  },
  rollback: "備用連結 URL",            // 可選 (style = backup 時使用)
  timestamp: 1234567890               // 可選，毫秒時間戳記
}
```

## 平台配置

### Twitter (`0x1DA1F2`)
- **style**: 
  - `normal` - 有圖片或文字
  - `backup` - 純影片或 API 失敗
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/twitter.png`
- **author**: `@screenName`
- **description**: 推文內容 + 引用推文
- **footer.text**: `💬{replies} 🔁{retweets} ❤️{likes}`

### Pixiv (`0x0096fa`)
- **style**:
  - `normal` - 單圖作品
  - `pixiv` - 多圖作品
  - `backup` - API 失敗
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/pixiv.png`
- **fields**: 作者、收藏、標籤
- **imagePixiv**: 多圖時使用

### Bilibili (`0x00aeec`)
- **style**:
  - `normal` - 無圖或單圖
  - `more` - 多張圖片
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/bilibili.png`
- **author**: 用戶 mid 和頭像
- **imageArray**: 多張圖片時使用（2-4張）

### Bluesky (`0x53b4ff`)
- **style**:
  - `normal` - 一般貼文
  - `more` - 多圖貼文
  - `backup` - 影片或 API 失敗
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/bluesky.png`
- **author**: `@handle`
- **footer.text**: `💬{replies} 🔁{reposts} ❤️{likes}`

### Plurk (`0xefa54c`)
- **style**:
  - `normal` - 無圖或單圖
  - `more` - 多張圖片
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/plurk.png`
- **author**: `@nickname`
- **footer.text**: `💬{responses} 🔁{replurks} ❤️{favorites}`

### Threads (`0x000000`)
- **style**: `backup` (使用 fixthreads.net)
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/threads.png`

### Instagram (`0xE4405F`)
- **style**: `backup` (使用代理服務)
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/instagram.png`

### TikTok (`0x000000`)
- **style**: `backup` (使用代理服務)
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/tiktok.png`

### Misskey (`0x99c539`)
- **style**: `normal` 或 `more`
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/misskey.png`

### PTT (`0x013370`)
- **style**: `normal`
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/ptt.png`

### Baha (`0x3578cd`)
- **style**: `normal`
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/baha.png`

### PChome (`0xff6600`)
- **style**: `normal`
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/pchome.png`

### E-Hentai (`0xe95959`)
- **style**: `normal` 或 `more`
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/eh.png`

### Weibo (`0xe6162d`)
- **style**: `normal` 或 `more`
- **footer.iconurl**: `https://ermiana.canaria.cc/pic/weibo.png`

## 使用 responseFormatter

```javascript
import { createStandardResponse, createErrorResponse } from '../utils/responseFormatter.js';

// 成功回應
return createStandardResponse({
  success: true,
  style: 'normal',
  color: '0x1DA1F2',
  author: {
    text: '@username',
    iconurl: 'https://...'
  },
  name: {
    title: '標題',
    url: 'https://...'
  },
  description: '內容',
  image: 'https://...',
  footer: {
    text: 'ermiana',
    iconurl: 'https://ermiana.canaria.cc/pic/canaria.png'
  },
  timestamp: Date.now()
});

// Backup 樣式回應
return createStandardResponse({
  success: true,
  style: 'backup',
  color: '0x1DA1F2',
  name: {
    title: '標題',
    url: 'https://...'
  },
  footer: {
    text: 'ermiana',
    iconurl: 'https://ermiana.canaria.cc/pic/twitter.png'
  },
  rollback: 'https://backup-url...'
});

// 錯誤回應
return createErrorResponse('錯誤訊息', 'ERROR_CODE');
```

## 修改檢查清單

為每個 service 文件：

1. ✅ 導入 `responseFormatter`
2. ✅ 確定平台顏色和圖標
3. ✅ 設定正確的 style
4. ✅ 添加 author 資訊（如適用）
5. ✅ 設定 name (title + url)
6. ✅ 添加 description
7. ✅ 根據 style 添加對應的圖片欄位
8. ✅ 設定 footer（平台特定）
9. ✅ 添加 timestamp（如適用）
10. ✅ 使用 `createStandardResponse()` 回傳
11. ✅ 錯誤處理使用 `createErrorResponse()`

## 已完成的修改

- ✅ Twitter Service
- ✅ Pixiv Service
- ✅ Bilibili Service
- ⏳ Bluesky Service (進行中)
- ⏳ Plurk Service (進行中)
- ⏳ Threads Service
- ⏳ Instagram Service
- ⏳ TikTok Service
- ⏳ Misskey Service
- ⏳ PTT Service
- ⏳ Baha Service
- ⏳ PChome Service
- ⏳ E-Hentai Service
- ⏳ Weibo Service
