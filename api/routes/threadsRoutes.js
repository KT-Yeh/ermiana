import express from 'express';
import { getThreadsData } from '../services/threadsService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
      });
    }

    const data = await getThreadsData(url);

    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
