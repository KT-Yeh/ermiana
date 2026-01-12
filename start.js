import { spawn } from 'child_process';

// 啟動 API 服務器
const api = spawn('node', ['api/server.js'], {
  stdio: 'inherit',
  shell: true,
});

// 等待1秒後啟動 Discord.js bot
setTimeout(() => {
  const bot = spawn('node', ['index.js'], {
    stdio: 'inherit',
    shell: true,
  });

  bot.on('error', (err) => {
    console.error('Bot 啟動錯誤:', err);
  });
}, 1000);

api.on('error', (err) => {
  console.error('API 啟動錯誤:', err);
});

// 處理退出信號
process.on('SIGINT', () => {
  console.log('\n正在關閉服務...');
  process.exit();
});
