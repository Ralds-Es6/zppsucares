import express from 'express';
import { getAdminStats, getAdminTrends } from '../controllers/statsController';
import { protect, adminOnly, staffOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/admin', protect, staffOnly, getAdminStats);
router.get('/trends', protect, staffOnly, getAdminTrends);
router.get('/test-stats', getAdminStats);

export default router;
