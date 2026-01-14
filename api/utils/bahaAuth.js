import axios from 'axios';
import Conf from 'conf';
import { CronJob } from 'cron';

/**
 * 重新載入巴哈姆特登入 Token
 */
export async function reloadBahaTK() {
  const { configManager } = await import('./configManager.js');
  const config = await configManager();

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'ckAPP_VCODE=9487',
  };

  const data = `uid=${config.BHUD}&passwd=${config.BHPD}&vcode=9487`;

  await axios.request({
    method: 'post',
    url: 'https://api.gamer.com.tw/mobile_app/user/v3/do_login.php',
    headers: headers,
    data: data,
    timeout: 2500,
  })
    .then((response) => {
      const ermianaBH = new Conf({ projectName: 'ermianaAPI' });
      const cookies = response.headers['set-cookie'];
      cookies.forEach((element) => {
        if (element.startsWith('BAHAENUR=')) {
          ermianaBH.set('BAHAENUR', element.split('BAHAENUR=')[1].split(';')[0]);
        }
        if (element.startsWith('BAHARUNE=')) {
          ermianaBH.set('BAHARUNE', element.split('BAHARUNE=')[1].split(';')[0]);
        }
      });
    })
    .catch((error) => {
      console.error('baha api error : ' + error);
    });
}

/**
 * 設定定時更新 Token 的 Cron Job
 */
export function setupBahaCronJob() {
  const bahaJob = new CronJob(
    '00 30 15 * * 0,2,4,6',
    async function() {
      try {
        console.log('Baha Cronjob running...');
        await reloadBahaTK();
      } catch (error) {
        console.error('Failed to reload BahaTK in cron:', error.message);
      }
    },
    null,
    true,
    'Asia/Taipei',
  );

  bahaJob.start();
  return bahaJob;
}

/**
 * 取得儲存的 Token
 */
export function getBahaTokens() {
  const ermianaBH = new Conf({ projectName: 'ermianaAPI' });
  return {
    BAHAENUR: ermianaBH.get('BAHAENUR'),
    BAHARUNE: ermianaBH.get('BAHARUNE'),
  };
}

/**
 * 初始化巴哈認證系統
 */
export async function initializeBahaAuth() {
  await reloadBahaTK();
  setupBahaCronJob();
  console.log('Baha authentication initialized');
}
