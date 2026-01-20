import express from 'express';
import { WeiboService } from '../services/weiboService.js';

const router = express.Router();

/**
 * GET /api/v1/weibo/:statusId
 * Get Weibo video data
 * Query: { url: string }
 */
router.get('/:statusId', async (req, res, next) => {
  try {
    const { statusId } = req.params;

    if (!statusId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid Weibo URL',
          code: 'Status ID is required',
        },
      });
    }

    const result = await WeiboService.getWeiboData(statusId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
