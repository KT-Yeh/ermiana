/**
 * 統一的 API 回傳格式建構器
 * 將所有平台的資料轉換為標準格式
 */

/**
 * 建立標準 API 回應格式
 * @param {Object} options - 回應選項
 * @param {boolean} options.success - API 狀態 (必填)
 * @param {string} options.style - 顯示樣式 (必填，預設 'normal')
 * @param {string} options.color - 顏色 hex (必填，預設 '0x1DA1F2')
 * @param {Object} options.author - 作者資訊 (可選)
 * @param {string} options.author.text - 作者名稱
 * @param {string} options.author.iconurl - 作者圖示 URL
 * @param {Object} options.name - 名稱/標題 (必填)
 * @param {string} options.name.title - 標題文字
 * @param {string} options.name.url - 連結 URL
 * @param {string} options.description - 描述文字 (可選)
 * @param {string} options.image - 單一圖片 URL (可選，style=normal)
 * @param {Array<string>} options.imageArray - 多張圖片 URL 陣列 (可選，style=more)
 * @param {Object} options.imagePixiv - Pixiv 圖片資訊 (可選，style=pixiv)
 * @param {string} options.imagePixiv.url - 圖片 URL
 * @param {number} options.imagePixiv.count - 圖片數量
 * @param {Array<Object>} options.fields - 額外欄位 (可選)
 * @param {Object} options.footer - 頁尾資訊 (必填)
 * @param {string} options.footer.text - 頁尾文字
 * @param {string} options.footer.iconurl - 頁尾圖示 URL
 * @param {string} options.rollback - 備用連結 (可選，style=backup 時使用)
 * @param {number} options.timestamp - 時間戳記 (可選)
 * @returns {Object} 標準化的 API 回應
 */
export function createStandardResponse(options) {
  const {
    success = true,
    style = 'normal',
    color = '0x1DA1F2',
    author = null,
    name,
    description = null,
    image = null,
    imageArray = null,
    imagePixiv = null,
    fields = null,
    footer = null,
    rollback = null,
    timestamp = null,
  } = options;

  // 驗證必填欄位
  if (success === undefined || success === null) {
    throw new Error('success is required');
  }
  if (!style) {
    throw new Error('style is required');
  }
  if (!color) {
    throw new Error('color is required');
  }
  if (!name || !name.title || !name.url) {
    throw new Error('name with title and url is required');
  }

  // 建立基本回應
  const response = {
    success: Boolean(success),
    style: String(style),
    color: parseInt(String(color).replace('0x', ''), 16),
    name: {
      title: String(name.title),
      url: String(name.url),
    },
  };

  // 添加可選欄位
  if (author && author.text) {
    response.author = {
      text: String(author.text),
      iconurl: author.iconurl ? String(author.iconurl) : undefined,
    };
  }

  if (description) {
    response.description = String(description);
  }

  // 根據 style 添加對應的圖片欄位
  if (style === 'normal' && image) {
    response.image = String(image);
  } else if (style === 'more' && image && imageArray) {
    response.image = String(image);
    response.imageArray = imageArray.map((url) => String(url));
  } else if (style === 'pixiv' && imagePixiv) {
    response.imagePixiv = {
      url: String(imagePixiv.url),
      count: Number(imagePixiv.count),
    };
  }

  if (fields && Array.isArray(fields) && fields.length > 0) {
    response.fields = fields.map((field) => ({
      name: String(field.name),
      value: String(field.value),
      inline: Boolean(field.inline),
    }));
  }

  if (footer) {
    response.footer = {
      text: String(footer.text),
      iconurl: String(footer.iconurl),
    };
  }

  if (rollback) {
    response.rollback = String(rollback);
  }

  if (timestamp) {
    response.timestamp = Number(timestamp);
  }

  return response;
}

/**
 * 建立錯誤回應
 * @param {string} message - 錯誤訊息
 * @param {string} code - 錯誤代碼
 * @returns {Object} 錯誤回應
 */
export function createErrorResponse(message, code = 'API_ERROR') {
  return {
    success: false,
    error: {
      message: String(message),
      code: String(code),
    },
  };
}
