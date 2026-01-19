import express from 'express';
import { InstagramService } from '../services/instagramService.js';

const router = express.Router();

/**
 * GET /api/v1/instagram/:postId
 * Get Instagram post data
 * Params: { postId: string }
 */
router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid Instagram URL',
          code: 'Post ID is required',
        },
      });
    }

    const result = await InstagramService.getInstagramData(postId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
