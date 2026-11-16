import { Router } from 'express';
import { getPublicSettings, getAdminSettings, updateAdminSettings } from '../controllers/settingsController';
import { protect, superAdminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Public route for landing page, registration modal, and student portal banner
router.get('/public', getPublicSettings);

// Protected routes for Super Admin settings configuration
router.get('/admin', protect, superAdminOnly, getAdminSettings);
router.put('/admin', protect, superAdminOnly, updateAdminSettings);

export default router;
