/* eslint-env browser */
// API Configuration
// Runtime-configurable API base: server may inject `window.__API_BASE_URL__` via /config.js
// If not provided, use relative paths (production-safe)
const API_BASE_URL = (typeof window !== 'undefined' && typeof window.__API_BASE_URL__ !== 'undefined') ? window.__API_BASE_URL__ : '';

// API Endpoints Configuration
const API_ENDPOINTS = [
  {
    id: 'twitter',
    name: 'Twitter',
    method: 'GET',
    path: '/api/v1/twitter/:statusId',
    examples: [
      'https://x.com/yuki_sakuna/status/2010691597260976328',
      'https://x.com/yuki_sakuna/status/2010874508421579177',
      'https://x.com/yuki_sakuna/status/2010654097020731517',
      'https://x.com/Hina_Youmiya/status/2010681473054204014',
      'https://x.com/SaotomeOtoha/status/2010667480432410638',
      'https://x.com/chizutodesign/status/2010570188962570520',
      'https://x.com/desumura/status/1996901194225389953',
      'https://x.com/saruyes3/status/1885678067739431225',
      'https://twitter.com/0712_heron/status/1846496455521091850',
    ],
    parameters: [
      { name: 'statusId', label: 'Status ID', type: 'text', required: true, placeholder: '1861318090836787295' },
    ],
    buildUrl: (params) => `/api/v1/twitter/${params.statusId}`,
  },
  {
    id: 'pixiv',
    name: 'Pixiv',
    method: 'GET',
    path: '/api/v1/pixiv/:illustId',
    examples: [
      'https://www.pixiv.net/artworks/119640142',
      'https://www.pixiv.net/artworks/108022680',
      'https://www.pixiv.net/artworks/118612962',
    ],
    parameters: [
      { name: 'illustId', label: 'Illustration ID', type: 'text', required: true, placeholder: '124747892' },
    ],
    buildUrl: (params) => `/api/v1/pixiv/${params.illustId}`,
  },
  {
    id: 'plurk',
    name: 'Plurk',
    method: 'GET',
    path: '/api/v1/plurk/:plurkId',
    examples: [
      'https://www.plurk.com/p/3hm9hb4cbe',
      'https://www.plurk.com/p/3gugymyask',
      'https://www.plurk.com/p/3g7k197wby',
      'https://www.plurk.com/p/3fhsihswfi',
    ],
    parameters: [
      { name: 'plurkId', label: 'Plurk ID', type: 'text', required: true, placeholder: '2rr6gw9mkn' },
    ],
    buildUrl: (params) => `/api/v1/plurk/${params.plurkId}`,
  },
  {
    id: 'baha',
    name: '巴哈姆特',
    method: 'GET',
    path: '/api/v1/baha/:postId',
    examples: [
      'https://forum.gamer.com.tw/C.php?bsn=60076&snA=8993965',
      'https://forum.gamer.com.tw/C.php?bsn=60076&snA=8187231',
    ],
    parameters: [
      { name: 'postId', label: 'Post ID', type: 'text', required: true, placeholder: 'C.php?bsn=60076&snA=123456' },
    ],
    buildUrl: (params) => `/api/v1/baha/${params.postId}`,
  },
  {
    id: 'eh',
    name: 'E-Hentai',
    method: 'GET',
    path: '/api/v1/eh/:galleryId/:token',
    examples: [
      'https://exhentai.org/g/2435734/2cfa96d15c',
      'https://exhentai.org/g/1937299/11f58cce1d',
    ],
    parameters: [
      { name: 'galleryId', label: 'Gallery ID', type: 'text', required: true, placeholder: '123456' },
      { name: 'token', label: 'Token', type: 'text', required: true, placeholder: 'abcdef1234' },
    ],
    buildUrl: (params) => `/api/v1/eh/${params.galleryId}/${params.token}`,
  },
  {
    id: 'pchome',
    name: 'PChome 24h',
    method: 'GET',
    path: '/api/v1/pchome/:productId',
    examples: [
      'https://24h.pchome.com.tw/prod/DAAG8W-A900GP1PQ',
      'https://24h.pchome.com.tw/prod/DGBQ97-A900JIZR3',
      'https://24h.pchome.com.tw/prod/DYAJ2X-A900J9CTH',
    ],
    parameters: [
      { name: 'productId', label: 'Product ID', type: 'text', required: true, placeholder: 'ABCDEF-ABC123456' },
    ],
    buildUrl: (params) => `/api/v1/pchome/${params.productId}`,
  },
  {
    id: 'ptt',
    name: 'PTT',
    method: 'GET',
    path: '/api/v1/ptt/:board/:postId',
    examples: [
      'https://www.ptt.cc/bbs/C_Chat/M.1767604234.A.400.html',
      'https://www.ptt.cc/bbs/Gossiping/M.1768278783.A.336.html',
    ],
    parameters: [
      { name: 'board', label: 'Board', type: 'text', required: true, placeholder: 'Gossiping' },
      { name: 'postId', label: 'Post ID', type: 'text', required: true, placeholder: 'M.1234567890.A.123' },
    ],
    buildUrl: (params) => `/api/v1/ptt/${params.board}/${params.postId}`,
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    method: 'GET',
    path: '/api/v1/bluesky/:handle/:postId',
    examples: [
      'https://bsky.app/profile/asagi0398.bsky.social/post/3mcb3ny2jxk2b',
      'https://bsky.app/profile/asagi0398.bsky.social/post/3mcb3qmmeus2b',
      'https://bsky.app/profile/asagi0398.bsky.social/post/3mbjengg4ts2s',
      'https://bsky.app/profile/milkshakework.bsky.social/post/3mbg3z4by4s27',
    ],
    parameters: [
      { name: 'handle', label: 'Handle', type: 'text', required: true, placeholder: 'bsky.app' },
      { name: 'postId', label: 'Post ID', type: 'text', required: true, placeholder: '3lbfb7aq2ds2u' },
    ],
    buildUrl: (params) => `/api/v1/bluesky/${params.handle}/${params.postId}`,
  },
  {
    id: 'misskey',
    name: 'Misskey',
    method: 'GET',
    path: '/api/v1/misskey/:host/:noteId',
    examples: [
      'https://misskey.io/notes/9tlxngdewhcp0bf4',
      'https://misskey.io/notes/9nwyhphjic2106u5',
    ],
    parameters: [
      { name: 'host', label: 'Host', type: 'text', required: true, placeholder: 'misskey.io' },
      { name: 'noteId', label: 'Note ID', type: 'text', required: true, placeholder: 'abc123xyz' },
    ],
    buildUrl: (params) => `/api/v1/misskey/${params.host}/${params.noteId}`,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    method: 'GET',
    path: '/api/v1/tiktok?url=xxx',
    examples: [
      'https://www.tiktok.com/@tuknekona/video/7569193652854066452',
      'https://www.tiktok.com/@tuknekona/video/7568128141491817748',
    ],
    parameters: [
      { name: 'url', label: 'TikTok URL', type: 'text', required: true, placeholder: 'https://www.tiktok.com/@username/video/1234567890123456789' },
    ],
    buildUrl: (params) => `/api/v1/tiktok?url=${encodeURIComponent(params.url)}`,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    method: 'GET',
    path: '/api/v1/instagram/:postId',
    examples: [
      'https://www.instagram.com/p/DTSSrlbERxJ/',
      'https://www.instagram.com/ringring_rin/p/DKpQ1yLT5SJ/',
      'https://www.instagram.com/p/DRPk2kOExKA/',
    ],
    parameters: [
      { name: 'postId', label: 'Post ID', type: 'text', required: true, placeholder: 'ABC123xyz' },
    ],
    buildUrl: (params) => `/api/v1/instagram/${params.postId}`,
  },
  {
    id: 'threads',
    name: 'Threads',
    method: 'GET',
    path: '/api/v1/threads?url=xxx',
    examples: [
      'https://www.threads.com/@kawin.travel/post/DTaC6CXk50M',
      'https://www.threads.com/@yaywusiiszd6924842/post/DTaUvHrD1Sg',
      'https://www.threads.com/@money85cc/post/DTagbAlEs1m',
    ],
    parameters: [
      { name: 'url', label: 'Threads URL', type: 'text', required: true, placeholder: 'https://www.threads.net/@username/post/ABC123xyz' },
    ],
    buildUrl: (params) => `/api/v1/threads?url=${encodeURIComponent(params.url)}`,
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    method: 'GET',
    path: '/api/v1/bilibili/:opusId',
    examples: [
      'https://www.bilibili.com/opus/1031137638211387398',
      'https://www.bilibili.com/opus/1110569897275949064',
    ],
    parameters: [
      { name: 'opusId', label: 'Opus ID', type: 'text', required: true, placeholder: '1087896863688556544' },
    ],
    buildUrl: (params) => `/api/v1/bilibili/${params.opusId}`,
  },
  {
    id: 'weibo',
    name: 'Weibo',
    method: 'GET',
    path: '/api/v1/weibo/:statusId',
    examples: [
      'https://m.weibo.cn/detail/5003631202402724',
      'https://m.weibo.cn/detail/4757909902724330',
      'https://m.weibo.cn/detail/4980354175993175',
    ],
    parameters: [
      { name: 'statusId', label: 'Status ID', type: 'text', required: true, placeholder: '1234567890123456' },
    ],
    buildUrl: (params) => `/api/v1/weibo/${params.statusId}`,
  },
];

// Statistics
const stats = {
  total: 0,
  success: 0,
  error: 0,
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkServerStatus();
  renderEndpoints();
  setupNavigation();
});

// Check Server Status
async function checkServerStatus() {
  const statusIndicator = document.getElementById('serverStatus');
  const statusText = document.getElementById('serverStatusText');

  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      statusIndicator.classList.add('online');
      statusText.textContent = 'API 正常';
    } else {
      statusIndicator.classList.add('offline');
      statusText.textContent = 'API 異常';
    }
  } catch {
    statusIndicator.classList.add('offline');
    statusText.textContent = 'API 離線';
  }
}

// Render All Endpoints
function renderEndpoints() {
  const container = document.getElementById('endpointsContainer');

  API_ENDPOINTS.forEach((endpoint) => {
    const card = createEndpointCard(endpoint);
    container.appendChild(card);
  });
}

function renderParamInput(param, endpointId) {
  const id = `${endpointId}-${param.name}`;
  const requiredAttr = param.required ? 'required' : '';
  const requiredMark = param.required ? '<span class="required">*</span>' : '';
  if (param.type === 'textarea') {
    return `
      <div class="form-group">
        <label class="form-label" for="${id}">
          ${param.label}
          ${requiredMark}
        </label>
        <textarea id="${id}" class="form-textarea" name="${param.name}" placeholder="${param.placeholder}" ${requiredAttr}></textarea>
      </div>
    `;
  }
  return `
    <div class="form-group">
      <label class="form-label" for="${id}">
        ${param.label}
        ${requiredMark}
      </label>
      <input id="${id}" type="text" class="form-input" name="${param.name}" placeholder="${param.placeholder}" ${requiredAttr}>
    </div>
  `;
}

// Create Endpoint Card
function createEndpointCard(endpoint) {
  const card = document.createElement('div');
  card.className = 'endpoint-card';
  card.id = endpoint.id;

  // Header
  const header = document.createElement('div');
  header.className = 'endpoint-header';
  header.innerHTML = `
    <div class="endpoint-title">
      <h3 class="endpoint-name">${endpoint.name}</h3>
    </div>
    <div class="endpoint-meta">
      <span class="method-badge ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
      <code class="endpoint-path">${endpoint.path}</code>
    </div>
  `;

  // Body
  const body = document.createElement('div');
  body.className = 'endpoint-body';

  // Examples
  const examplesHtml = `
    <div class="section">
      <div class="section-header">範例網址</div>
      <div class="example-urls">
        ${endpoint.examples.map((url) => `<div class="example-url">${url}</div>`).join('')}
      </div>
    </div>
  `;

  // Parameters Form (robust + accessible)
  const parameters = endpoint.parameters || [];
  const formHtml = `
    <div class="section">
      <div class="section-header">參數</div>
      <form class="test-form" data-endpoint-id="${endpoint.id}">
        ${parameters.map((param) => renderParamInput(param, endpoint.id)).join('')}
        <div class="button-group">
          <button type="submit" class="btn btn-primary">
            <span class="btn-text">測試 API</span>
          </button>
          <button type="button" class="btn btn-secondary btn-clear">清除結果</button>
        </div>
      </form>
    </div>
  `;

  // Response Container
  const responseHtml = `
    <div class="response-container" data-response-id="${endpoint.id}">
      <div class="response-header">
        <div class="response-status"></div>
        <div class="response-time"></div>
      </div>
      <div class="response-body"><pre></pre></div>
    </div>
  `;

  body.innerHTML = examplesHtml + formHtml + responseHtml;

  card.appendChild(header);
  card.appendChild(body);

  // Toggle expand/collapse
  header.addEventListener('click', () => {
    body.classList.toggle('expanded');
  });

  // Handle form submission
  const form = body.querySelector('.test-form');
  form.addEventListener('submit', (e) => handleFormSubmit(e, endpoint));

  // Handle clear button
  const clearBtn = body.querySelector('.btn-clear');
  clearBtn.addEventListener('click', () => clearResponse(endpoint.id));

  return card;
}

// Handle Form Submit
async function handleFormSubmit(event, endpoint) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');

  // Collect form data
  const formData = new FormData(form);
  const params = {};
  for (const [key, value] of formData.entries()) {
    params[key] = value.trim();
  }

  // Validate (handle missing parameters safely)
  const parameters = endpoint.parameters || [];
  if (parameters.some((p) => p.required && !params[p.name])) {
    alert('請填寫所有必填欄位');
    return;
  }

  // Show loading
  submitBtn.disabled = true;
  btnText.innerHTML = '<span class="loading-spinner"></span>測試中...';

  // Build request
  const url = endpoint.buildUrl(params);
  const body = endpoint.buildBody ? endpoint.buildBody(params) : null;

  // Make request
  const startTime = Date.now();
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: endpoint.method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : null,
    });

    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    const time = Date.now() - startTime;

    displayResponse(endpoint.id, response.ok, data, time);
    updateStats(response.ok);
  } catch (error) {
    const time = Date.now() - startTime;
    displayResponse(endpoint.id, false, { error: error.message }, time);
    updateStats(false);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = '測試 API';
  }
}

// Display Response
function displayResponse(endpointId, success, data, time) {
  const container = document.querySelector(`[data-response-id="${endpointId}"]`);
  const statusEl = container.querySelector('.response-status');
  const timeEl = container.querySelector('.response-time');
  const bodyEl = container.querySelector('.response-body pre');

  container.classList.add('show');

  statusEl.className = `response-status ${success ? 'success' : 'error'}`;
  statusEl.textContent = success ? '✓ 成功' : '✗ 失敗';

  timeEl.textContent = `⏱ ${time}ms`;

  bodyEl.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

// Clear Response
function clearResponse(endpointId) {
  const container = document.querySelector(`[data-response-id="${endpointId}"]`);
  container.classList.remove('show');
}

// Update Statistics
function updateStats(success) {
  stats.total++;
  if (success) {
    stats.success++;
  } else {
    stats.error++;
  }

  document.getElementById('totalTests').textContent = stats.total;
  document.getElementById('successTests').textContent = stats.success;
  document.getElementById('errorTests').textContent = stats.error;
}

// Setup Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Update active state
      navItems.forEach((n) => n.classList.remove('active'));
      item.classList.add('active');

      // Scroll to endpoint
      const targetId = item.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Expand the endpoint
        const body = targetElement.querySelector('.endpoint-body');
        if (!body.classList.contains('expanded')) {
          body.classList.add('expanded');
        }
      }
    });
  });
}
