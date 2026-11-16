import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Department } from '../models/DepartmentModel';
import { Course } from '../models/CourseModel';

// @desc    Get all active academic departments / colleges
// @route   GET /api/academic/departments
// @access  Public
export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await Department.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();
        res.json(departments);
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Failed to fetch departments', error: err.message });
    }
};

// @desc    Get courses belonging to a specific department
// @route   GET /api/academic/departments/:departmentId/courses
// @route   GET /api/academic/courses?departmentId=...
// @access  Public
export const getCoursesByDepartment = async (req: Request, res: Response) => {
    try {
        const rawIdentifier = req.params.departmentId || req.query.departmentId || req.query.department;

        if (!rawIdentifier || typeof rawIdentifier !== 'string') {
            return res.status(400).json({ message: 'Valid department identifier is required' });
        }

        const departmentIdentifier = rawIdentifier.trim();

        let department = null;
        if (mongoose.Types.ObjectId.isValid(departmentIdentifier)) {
            department = await Department.findById(departmentIdentifier).lean();
        }

        if (!department) {
            // Check by code (case-insensitive) or name
            department = await Department.findOne({
                $or: [
                    { code: departmentIdentifier.toUpperCase() },
                    { name: departmentIdentifier }
                ]
            }).lean();
        }

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const courses = await Course.find({
            department: department._id,
            isActive: true
        }).sort({ order: 1, name: 1 }).lean();

        res.json({
            department: {
                _id: department._id,
                name: department.name,
                code: department.code
            },
            courses
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error fetching courses by department:', error);
        res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
    }
};

// @desc    Get all academic departments with their respective courses grouped
// @route   GET /api/academic/all
// @access  Public
export const getAllAcademicStructure = async (req: Request, res: Response) => {
    try {
        const departments = await Department.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();
        const courses = await Course.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();

        const structured = departments.map(dept => ({
            ...dept,
            courses: courses.filter(course => course.department.toString() === dept._id.toString())
        }));

        res.json(structured);
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error fetching complete academic structure:', error);
        res.status(500).json({ message: 'Failed to fetch academic structure', error: err.message });
    }
};
