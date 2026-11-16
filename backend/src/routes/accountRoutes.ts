import { Router } from 'express';
import {
    getAccountsSummary,
    createSubAdmin,
    toggleUserStatus
} from '../controllers/accountManagementController';
import { protect, superAdminOnly } from '../middlewares/authMiddleware';

const router = Router();

// All account directory management endpoints are restricted to Super Admin
router.get('/summary', protect, superAdminOnly, getAccountsSummary);
router.post('/subadmin', protect, superAdminOnly, createSubAdmin);
router.put('/toggle-status', protect, superAdminOnly, toggleUserStatus);

export default router;
