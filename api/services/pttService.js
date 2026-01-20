import axios from 'axios';
import * as cheerio from 'cheerio';
import { createStandardResponse } from '../utils/responseFormatter.js';

function boardNameStandardization(boardName) {
  const boardNameStandardized = boardName.toLowerCase();
  const boardMap = {
    'gossiping': 'Gossiping',
    'c_chat': 'C_Chat',
    'ac_in': 'AC_In',
    'h-game': 'H-GAME',
    'sex': 'sex',
    'hatepolitics': 'HatePolitics',
    'beauty': 'Beauty',
    'japanavgirls': 'japanavgirls',
    'dmm_games': 'DMM_GAMES',
  };
  return boardMap[boardNameStandardized] || boardName;
}

const supportedBoards = [
  'Gossiping', 'C_Chat', 'AC_In', 'H-GAME', 'sex',
  'HatePolitics', 'Beauty', 'japanavgirls', 'DMM_GAMES',
];

function getPictures(text) {
  const pattern = /https:\/\/.*\.(jpg|jpeg|png|gif|webp)/;
  const result = text.match(pattern);
  return result ? result[0] : '';
}

function getMainContent(text) {
  const pattern = /^(.|\n)+批踢踢實業坊\(ptt\.cc\)/;
  const result = text.match(pattern);
  return result ? getPictures(result[0]) : getPictures(text);
}

function getDescription(text) {
  const matches = (text + '5.完整新聞連結').match(/4\.完整新聞內文:[\s\S]+?5.完整新聞連結/) ||
                  (text + '5.完整新聞連結').match(/2\.記者署名:[\s\S]+?5.完整新聞連結/);
  const newsContent = matches ? matches[0].replace('4.完整新聞內文:\n', '').trim() : '';
  return newsContent.replace(/^※.*$/gm, '').replace(/^\s*[\r\n]/gm, '').substring(0, 160);
}

export class PttService {
  static async getPttData(board, postId) {
    const standardizedBoard = boardNameStandardization(board);

    if (!supportedBoards.includes(standardizedBoard)) {
      return createStandardResponse({
        success: true,
        style: 'backup',
        color: '0x013370',
        name: {
          title: 'PTT',
          url: `https://www.ptt.cc/bbs/${standardizedBoard}/${postId}.html`,
        },
        rollback: `https://www.pttweb.cc/bbs/${standardizedBoard}/${postId}`,
      });
    }

    try {
    // Try primary PTT source
      const pttHTML = await axios.request({
        url: `https://www.ptt.cc/bbs/${standardizedBoard}/${postId}.html`,
        method: 'get',
        headers: {
          'Host': 'www.ptt.cc',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
          'Accept': 'text/html',
          'Cookie': 'over18=1;',
        },
        timeout: 2000,
      });

      if (pttHTML.status === 200) {
        const $ = cheerio.load(pttHTML.data);
        const title = $('meta[property=og:title]').attr('content') || 'PTT.cc';
        const description = $('meta[property=og:description]').attr('content') || '';
        const mainContent = $('#main-content').text().substring(0, 1000) || '';

        let image = '';
        let enhancedDescription = description;

        // Try to get enhanced data from moptt
        try {
          const mopttResp = await axios.request({
            method: 'get',
            url: `https://moptt.tw/ptt/${standardizedBoard}.${postId}`,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
            },
            timeout: 2000,
          });

          if (mopttResp.status === 200 && mopttResp.data) {
            if (mopttResp.data.imageSource) {
              image = mopttResp.data.imageSource;
            }
            if (mopttResp.data.description) {
              enhancedDescription = mopttResp.data.description;
            }
          }
        } catch (mopttError) {
        // Use content from main PTT if moptt fails
          if (mainContent) {
            const contentPic = getMainContent(mainContent);
            if (contentPic) {
              image = contentPic;
            }
          }
        }

        // Parse description for news articles
        if (description.match(/1\.媒體來源:/)) {
          const newsDesc = getDescription(mainContent);
          if (newsDesc) {
            enhancedDescription = newsDesc;
          }
        }

        return createStandardResponse({
          success: true,
          style: 'normal',
          color: '0x013370',
          name: {
            title: title,
            url: `https://www.ptt.cc/bbs/${standardizedBoard}/${postId}.html`,
          },
          description: enhancedDescription,
          image: image || null,
          footer: {
            text: 'ermiana',
            iconurl: 'https://ermiana.canaria.cc/pic/ptt.png',
          },
        });
      }

      throw new Error('Primary PTT source failed');
    } catch (error) {
    // Try backup PTT source
      try {
        await new Promise((resolve) => setTimeout(resolve, 1800));

        const pttHTML2 = await axios.request({
          url: `https://ptt-demo.canaria.cc/bbs/${standardizedBoard}/${postId}.html`,
          method: 'get',
          headers: {
            'Host': 'www.ptt.cc',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
            'Cookie': 'over18=1;',
          },
          timeout: 3000,
        });

        if (pttHTML2.status === 200) {
          const $ = cheerio.load(pttHTML2.data);
          const title = $('meta[property=og:title]').attr('content') || 'PTT.cc';
          const description = $('meta[property=og:description]').attr('content') || '';
          const mainContent = $('#main-content').text().substring(0, 1000) || '';

          let image = '';
          let enhancedDescription = description;

          // Try moptt again
          try {
            const mopttResp2 = await axios.request({
              method: 'get',
              url: `https://moptt.tw/ptt/${standardizedBoard}.${postId}`,
              timeout: 3000,
            });

            if (mopttResp2.status === 200 && mopttResp2.data) {
              if (mopttResp2.data.imageSource) {
                image = mopttResp2.data.imageSource;
              }
              if (mopttResp2.data.description) {
                enhancedDescription = mopttResp2.data.description;
              }
            }
          } catch {
            if (mainContent) {
              const contentPic = getMainContent(mainContent);
              if (contentPic) {
                image = contentPic;
              }
            }
          }

          if (description.match(/1\.媒體來源:/)) {
            const newsDesc = getDescription(mainContent);
            if (newsDesc) {
              enhancedDescription = newsDesc;
            }
          }

          return createStandardResponse({
            success: true,
            style: 'normal',
            color: '0x013370',
            name: {
              title: title,
              url: `https://www.ptt.cc/bbs/${standardizedBoard}/${postId}.html`,
            },
            description: enhancedDescription,
            image: image || null,
            footer: {
              text: 'ermiana',
              iconurl: 'https://ermiana.canaria.cc/pic/ptt.png',
            },
          });
        }

        throw new Error('Backup PTT source failed');
      } catch (backupError) {
        return createStandardResponse({
          success: true,
          style: 'backup',
          color: '0x013370',
          name: {
            title: 'PTT',
            url: `https://www.ptt.cc/bbs/${standardizedBoard}/${postId}.html`,
          },
          footer: {
            text: 'ermiana',
            iconurl: 'https://ermiana.canaria.cc/pic/ptt.png',
          },
          rollback: `https://www.pttweb.cc/bbs/${standardizedBoard}/${postId}`,
        });
      }
    }
  }
}
