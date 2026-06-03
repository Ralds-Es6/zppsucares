import { Router } from 'express';
import {
    createCase,
    getCases,
    getCaseById,
    addCaseNote,
    updateReferral,
    scheduleFollowUp,
    updateCaseStatus
} from '../controllers/caseController';
import { protect, adminOnly, staffOnly } from '../middlewares/authMiddleware';

const router = Router();

router.route('/')
    .get(protect, getCases)
    .post(protect, adminOnly, createCase);

router.route('/:id')
    .get(protect, getCaseById);

router.route('/:id/notes')
    .post(protect, adminOnly, addCaseNote);

router.route('/:id/referral')
    .patch(protect, adminOnly, updateReferral);

router.route('/:id/follow-up')
    .post(protect, adminOnly, scheduleFollowUp);

router.route('/:id/status')
    .patch(protect, adminOnly, updateCaseStatus);

export default router;
