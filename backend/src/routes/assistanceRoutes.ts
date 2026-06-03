import express from 'express';
import {
    createAssistanceRequest,
    getMyAssistanceRequest,
    updateAssistanceStep,
    getAllAssistanceRequests,
    verifyAssistanceStep
} from '../controllers/assistanceController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/request', protect, createAssistanceRequest);
router.get('/my-request', protect, getMyAssistanceRequest);
router.put('/update-step', protect, updateAssistanceStep);

router.get('/all', protect, adminOnly, getAllAssistanceRequests);
router.put('/verify-step', protect, adminOnly, verifyAssistanceStep);

export default router;
