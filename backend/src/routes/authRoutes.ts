import { Router } from 'express';
import { loginAdmin, loginUser, registerUser, getStudents } from '../controllers/authController';
import { protect, adminOnly, staffOnly } from '../middlewares/authMiddleware';

const router = Router();

router.post('/admin/login', loginAdmin);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/students', protect, staffOnly, getStudents);

export default router;
