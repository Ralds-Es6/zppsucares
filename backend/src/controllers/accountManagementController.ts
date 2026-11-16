import { Request, Response } from 'express';
import { MainUser, AdminUser } from '../models/DatabaseRouter';
import { UserRole } from '../models/UserModel';

// @desc    Get complete account directory summary for Super Admin
// @route   GET /api/admin/accounts/summary
// @access  Private (Super Admin)
export const getAccountsSummary = async (req: Request, res: Response) => {
    try {
        const { search = '', studentPage = 1, studentLimit = 50 } = req.query;

        // 1. Fetch Sub-Admins
        const subadmins = await AdminUser.find({ role: UserRole.SUBADMIN })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        // 2. Fetch Faculty Members
        const facultyRaw = await MainUser.find({ role: UserRole.FACULTY })
            .select('-password')
            .populate('facultyProfile')
            .sort({ createdAt: -1 })
            .lean();

        const faculty = facultyRaw.map((f: any) => ({
            _id: f._id,
            firstName: f.firstName,
            lastName: f.lastName,
            email: f.email,
            role: f.role,
            isActive: f.isActive !== false,
            createdAt: f.createdAt,
            department: f.facultyProfile?.department || 'General Faculty',
            designation: f.facultyProfile?.designation || 'Instructor / Counselor',
            employeeId: f.facultyProfile?.employeeId || 'N/A'
        }));

        // 3. Search & Fetch Students
        const studentFilter: any = { role: UserRole.STUDENT };
        if (typeof search === 'string' && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            studentFilter.$or = [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ];
        }

        const skip = (Number(studentPage) - 1) * Number(studentLimit);
        const [studentsRaw, totalStudentMatches] = await Promise.all([
            MainUser.find(studentFilter)
                .select('-password')
                .populate('studentProfile')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(studentLimit))
                .lean(),
            MainUser.countDocuments(studentFilter)
        ]);

        const students = studentsRaw.map((s: any) => ({
            _id: s._id,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
            role: s.role,
            isActive: s.isActive !== false,
            createdAt: s.createdAt,
            studentId: s.studentProfile?.studentId || 'N/A',
            department: s.studentProfile?.department || 'N/A',
            course: s.studentProfile?.course || 'N/A',
            yearLevel: s.studentProfile?.yearLevel || 'N/A',
            section: s.studentProfile?.section || 'N/A',
            verificationStatus: s.studentProfile?.verificationStatus || 'unverified'
        }));

        // 4. Compute Counts
        const [
            totalSubAdmins,
            activeSubAdmins,
            totalFaculty,
            activeFaculty,
            totalStudents,
            activeStudents
        ] = await Promise.all([
            AdminUser.countDocuments({ role: UserRole.SUBADMIN }),
            AdminUser.countDocuments({ role: UserRole.SUBADMIN, isActive: true }),
            MainUser.countDocuments({ role: UserRole.FACULTY }),
            MainUser.countDocuments({ role: UserRole.FACULTY, isActive: { $ne: false } }),
            MainUser.countDocuments({ role: UserRole.STUDENT }),
            MainUser.countDocuments({ role: UserRole.STUDENT, isActive: { $ne: false } })
        ]);

        res.json({
            stats: {
                totalSubAdmins,
                activeSubAdmins,
                inactiveSubAdmins: totalSubAdmins - activeSubAdmins,
                totalFaculty,
                activeFaculty,
                inactiveFaculty: totalFaculty - activeFaculty,
                totalStudents,
                activeStudents,
                suspendedStudents: totalStudents - activeStudents
            },
            subadmins,
            faculty,
            students,
            pagination: {
                page: Number(studentPage),
                limit: Number(studentLimit),
                totalStudents: totalStudentMatches
            }
        });
    } catch (error: any) {
        console.error('Error fetching account summary:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch accounts summary' });
    }
};

// @desc    Create a new Sub-Admin account (Super Admin Only)
// @route   POST /api/admin/accounts/subadmin
// @access  Private (Super Admin)
export const createSubAdmin = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'First name, last name, email, and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if email already in AdminUser
        const existingAdmin = await AdminUser.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            return res.status(400).json({ message: 'An administrative account with this email already exists' });
        }

        // Create new Sub-Admin in Admin database
        const subAdmin = await AdminUser.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: password.trim(), // Encrypted via UserSchema pre-save
            role: UserRole.SUBADMIN,
            isActive: true
        });

        res.status(201).json({
            message: 'Sub-Admin staff account created successfully',
            subadmin: {
                _id: subAdmin._id,
                firstName: subAdmin.firstName,
                lastName: subAdmin.lastName,
                email: subAdmin.email,
                role: subAdmin.role,
                isActive: subAdmin.isActive,
                createdAt: (subAdmin as any).createdAt
            }
        });
    } catch (error: any) {
        console.error('Error creating subadmin:', error);
        res.status(500).json({ message: error.message || 'Failed to create subadmin account' });
    }
};

// @desc    Toggle account active/suspended status (Super Admin Only)
// @route   PUT /api/admin/accounts/toggle-status
// @access  Private (Super Admin)
export const toggleUserStatus = async (req: Request, res: Response) => {
    const { userId, userType, isActive } = req.body;

    try {
        if (!userId || typeof isActive !== 'boolean' || !userType) {
            return res.status(400).json({ message: 'userId, userType, and isActive boolean are required' });
        }

        // Prevent self-deactivation by Super Admin
        if (req.user?._id?.toString() === userId.toString()) {
            return res.status(400).json({ message: 'You cannot deactivate your own Super Administrator account' });
        }

        let updatedUser: any = null;

        if (userType === 'subadmin') {
            updatedUser = await AdminUser.findByIdAndUpdate(
                userId,
                { isActive },
                { new: true }
            ).select('-password');
        } else if (userType === 'faculty' || userType === 'student') {
            updatedUser = await MainUser.findByIdAndUpdate(
                userId,
                { isActive },
                { new: true }
            ).select('-password');
        } else {
            return res.status(400).json({ message: 'Invalid userType specified' });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: 'Target user account not found' });
        }

        res.json({
            message: `Account status updated to ${isActive ? 'ACTIVE' : 'SUSPENDED'} successfully`,
            user: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive
            }
        });
    } catch (error: any) {
        console.error('Error toggling user status:', error);
        res.status(500).json({ message: error.message || 'Failed to update user status' });
    }
};
