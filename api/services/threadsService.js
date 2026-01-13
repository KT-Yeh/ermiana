import { createStandardResponse } from '../utils/responseFormatter.js';

export async function getThreadsData(url) {
  try {
    // Threads uses fixthreads.net as proxy
    const fixedUrl = url.replace(/threads\.net/, 'fixthreads.net');

    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0x000000',
      name: {
        title: 'Threads',
        url: url,
      },
      footer: {
        text: 'ermiana',
        iconurl: 'https://ermiana.canaria.cc/pic/threads.png',
      },
      rollback: fixedUrl,
    });
  } catch (error) {
    return createStandardResponse({
      success: true,
      style: 'backup',
      color: '0x000000',
      name: {
        title: 'Threads',
        url: url,
      },
      footer: {
        text: 'ermiana',
        iconurl: 'https://ermiana.canaria.cc/pic/threads.png',
      },
      rollback: url,
    });
  }
}
