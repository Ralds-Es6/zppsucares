import express from 'express';
import {
    getAvailableSlots,
    requestAppointment,
    getMyAppointments,
    getAllAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

// Faculty explicitly blocked: this is a completely separate route namespace and they don't have access.
// Student routes for their own appointments
router.get('/available-slots', protect, getAvailableSlots);
router.post('/request', protect, requestAppointment);
router.get('/my-appointments', protect, getMyAppointments);

// Admin routes
router.get('/all', protect, adminOnly, getAllAppointments);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);

export default router;
