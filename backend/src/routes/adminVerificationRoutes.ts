import { Router } from 'express';
import {
    getVerifications,
    approveVerification,
    declineVerification
} from '../controllers/adminVerificationController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getVerifications);
router.put('/:id/approve', approveVerification);
router.put('/:id/decline', declineVerification);

export default router;
