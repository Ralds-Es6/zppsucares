import express from 'express';
import { createReport, getReports, updateReportStatus } from '../controllers/reportController';
import { protect, adminOnly, staffOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createReport)
    .get(protect, getReports);

router.patch('/:id/status', protect, adminOnly, updateReportStatus);

export default router;
