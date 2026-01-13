import express from 'express';
import { TiktokService } from '../services/tiktokService.js';

const router = express.Router();

/**
 * GET /api/v1/tiktok?url=xxx
 * Get TikTok video data
 * Query: { url: string }
 */
router.get('/', async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url || !url.includes('tiktok.com')) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid TikTok URL',
          code: 'INVALID_PARAMETER',
        },
      });
    }

    const result = await TiktokService.getVideoData(url);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
