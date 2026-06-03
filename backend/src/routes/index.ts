import { Router } from 'express';
import { getExample } from '../controllers/exampleController';
import { getAdminStats } from '../controllers/statsController';
import authRoutes from './authRoutes';
import casesRoutes from './caseRoutes';
import statsRoutes from './statsRoutes';
import reportsRoutes from './reportRoutes';
import wellnessRoutes from './wellnessRoutes';
import notificationRoutes from './notificationRoutes';
import appointmentRoutes from './appointmentRoutes';
import assistanceRoutes from './assistanceRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cases', casesRoutes);
router.use('/stats', statsRoutes);
router.use('/reports', reportsRoutes);
router.use('/wellness', wellnessRoutes);
router.use('/notifications', notificationRoutes);
router.use('/counseling', appointmentRoutes);
router.use('/assistance', assistanceRoutes);
router.get('/test-stats', getAdminStats);
router.get('/example', getExample);

export default router;
