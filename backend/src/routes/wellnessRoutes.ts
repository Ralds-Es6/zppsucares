import { Router } from 'express';
import { submitProfile, getMyProfile, getAllProfiles, updateProfileStatus } from '../controllers/wellnessController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.route('/')
    .post(protect, submitProfile)
    .get(protect, adminOnly, getAllProfiles);

router.route('/me')
    .get(protect, getMyProfile);

router.route('/:id/status')
    .put(protect, adminOnly, updateProfileStatus);

export default router;
