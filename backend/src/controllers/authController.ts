import { Request, Response } from 'express';
import { AdminUser, MainUser } from '../models/DatabaseRouter';
import generateToken from '../utils/generateToken';
import { UserRole } from '../models/UserModel';
import { Student } from '../models/StudentModel';
import { Faculty } from '../models/FacultyModel';

// @desc    Auth admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await AdminUser.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth student/faculty & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await MainUser.findOne({ email })
            .select('+password')
            .populate('studentProfile')
            .populate('facultyProfile');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                studentProfile: user.studentProfile,
                facultyProfile: user.facultyProfile,
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register student & get token
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, studentId, course, yearLevel, section } = req.body;

    try {
        const userExists = await MainUser.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await MainUser.create({
            firstName,
            lastName,
            email,
            password,
            role: UserRole.STUDENT,
            isActive: true
        });

        if (user) {
            // Create Student Profile
            const student = await Student.create({
                user: user._id,
                studentId,
                course,
                yearLevel: yearLevel || 1,
                section: section || 'A'
            });

            user.studentProfile = student._id as any;
            await user.save();

            // Populate profile before sending response
            const populatedUser = await MainUser.findById(user._id).populate('studentProfile');

            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                studentProfile: populatedUser?.studentProfile,
                token: generateToken(user._id.toString(), user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/auth/students
// @access  Admin
export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await MainUser.find({ role: UserRole.STUDENT }).populate('studentProfile');
        res.json(students);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
