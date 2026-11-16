import { Router } from 'express';
import {
    loginAdmin,
    loginUser,
    registerUser,
    getStudents,
    generateStudentId,
    uploadDocumentFile,
    resubmitVerification,
    getFacultyMembers,
    generateFacultyId,
    onboardFaculty
} from '../controllers/authController';
import { protect, staffOnly, adminOnly, superAdminOnly } from '../middlewares/authMiddleware';
import { uploadDocument } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/admin/login', loginAdmin);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/upload-document', uploadDocument.single('document'), uploadDocumentFile);
router.put('/student/resubmit', protect, resubmitVerification);
router.get('/students', protect, staffOnly, getStudents);
router.get('/generate-student-id', generateStudentId);

// Faculty Management Endpoints
router.get('/faculty', protect, adminOnly, getFacultyMembers);
router.get('/generate-faculty-id', protect, superAdminOnly, generateFacultyId);
router.post('/faculty/onboard', protect, superAdminOnly, onboardFaculty);

export default router;
