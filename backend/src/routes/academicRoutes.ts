import { Router } from 'express';
import {
    getDepartments,
    getCoursesByDepartment,
    getAllAcademicStructure
} from '../controllers/academicController';

const router = Router();

// Public routes for registration and dropdowns
router.get('/departments', getDepartments);
router.get('/departments/:departmentId/courses', getCoursesByDepartment);
router.get('/courses', getCoursesByDepartment);
router.get('/structure', getAllAcademicStructure);

export default router;
