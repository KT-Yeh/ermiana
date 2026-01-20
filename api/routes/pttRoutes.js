import express from 'express';
import { PttService } from '../services/pttService.js';

const router = express.Router();

/**
 * GET /api/v1/ptt/:board/:postId
 * Get PTT post data
 * Params: { board: string, postId: string }
 */
router.get('/:board/:postId', async (req, res, next) => {
  try {
    const { board, postId } = req.params;

    if (!board || !postId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid PTT URL',
          code: 'Board and post ID are required',
        },
      });
    }

    const result = await PttService.getPttData(board, postId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
