import express from 'express';
import {
    applyForAssistance,
    getMyAssistanceRequest,
    getAllAssistanceRequests,
    reviewAssistanceRequest
} from '../controllers/assistanceController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/apply', protect, applyForAssistance);
router.get('/my-request', protect, getMyAssistanceRequest);
router.get('/all', protect, adminOnly, getAllAssistanceRequests);
router.put('/review', protect, adminOnly, reviewAssistanceRequest);

export default router;
