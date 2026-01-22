import express from 'express';
import { ThreadsService } from '../services/threadsService.js';

const router = express.Router();

/**
 * GET /api/v1/threads?url=xxx
 * Get Threads video data
 * Query: { url: string }
 */
router.get('/', async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url || (!url.includes('threads.com') && !url.includes('threads.net'))) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid Threads URL',
          code: 'INVALID_PARAMETER',
        },
      });
    }

    const result = await ThreadsService.getThreadsData(url);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
