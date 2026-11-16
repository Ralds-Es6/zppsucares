import { Request, Response } from 'express';
import { AdminUser, MainUser } from '../models/DatabaseRouter';
import generateToken from '../utils/generateToken';
import { UserRole } from '../models/UserModel';
import { Student } from '../models/StudentModel';
import { Faculty } from '../models/FacultyModel';
import { SystemSettings } from '../models/SystemSettingsModel';

// @desc    Auth admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await AdminUser.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (user.isActive === false) {
                return res.status(403).json({ message: 'This administrative account has been deactivated. Please contact the Super Administrator.' });
            }
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
    } catch (error: unknown) {
        const err = error as { message?: string };
        res.status(500).json({ message: err.message || 'Internal server error' });
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
            // Check individual account suspension
            if (user.isActive === false) {
                return res.status(403).json({
                    message: 'Your account has been deactivated or suspended by the University Administration. Please visit the Guidance Office.'
                });
            }

            // If user is a student, enforce system-wide portal login toggle
            if (user.role === UserRole.STUDENT) {
                const settings = await SystemSettings.findOne().lean();
                if (settings && settings.studentLoginAccess === false) {
                    return res.status(403).json({
                        message: settings.maintenanceMessage || 'Student Portal is temporarily closed for term processing. Please check back later.'
                    });
                }
            }

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
    } catch (error: unknown) {
        const err = error as { message?: string };
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
};

// @desc    Register student & get token
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, studentId, department, course, yearLevel, section, corUrl, idCardUrl } = req.body;

    try {
        // Enforce system-wide student self-registration toggle
        const settings = await SystemSettings.findOne().lean();
        if (settings && settings.allowStudentRegistration === false) {
            return res.status(403).json({
                message: settings.registrationClosedMessage || 'Student self-registration is currently closed by the University Administration for this academic term.'
            });
        }

        const userExists = await MainUser.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let finalStudentId = studentId;
        if (!finalStudentId) {
            const currentYear = new Date().getFullYear();
            const latestStudent = await Student.findOne({
                studentId: new RegExp(`^${currentYear}-`)
            }).sort({ createdAt: -1 });

            let nextNumber = 1;
            if (latestStudent) {
                const parts = latestStudent.studentId.split('-');
                if (parts.length === 3 && parts[2]) {
                    const lastNum = parseInt(parts[2], 10);
                    if (!isNaN(lastNum)) {
                        nextNumber = lastNum + 1;
                    }
                } else if (parts.length === 2 && parts[1]) {
                    const lastNum = parseInt(parts[1], 10);
                    if (!isNaN(lastNum)) {
                        nextNumber = lastNum + 1;
                    }
                }
            }

            const firstInitial = firstName ? firstName.trim().charAt(0) : 'X';
            const lastInitial = lastName ? lastName.trim().charAt(0) : 'X';
            const initials = `${firstInitial}${lastInitial}`.toUpperCase();
            const formattedNumber = String(nextNumber).padStart(4, '0');
            finalStudentId = `${currentYear}-${initials}-${formattedNumber}`;
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
            // Create Student Profile with pending verification status and submitted documents
            const student = await Student.create({
                user: user._id,
                studentId: finalStudentId,
                department: department || '',
                course,
                yearLevel: yearLevel || 1,
                section: section || 'A',
                verificationStatus: 'pending',
                documents: {
                    corUrl: corUrl || '',
                    idCardUrl: idCardUrl || '',
                    submittedAt: new Date()
                },
                isResubmitted: false
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

// @desc    Generate a new unique sequential student ID
// @route   GET /api/auth/generate-student-id
// @access  Public
export const generateStudentId = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName } = req.query;
        const currentYear = new Date().getFullYear();
        // Find the latest student ID for the current year
        const latestStudent = await Student.findOne({
            studentId: new RegExp(`^${currentYear}-`)
        }).sort({ createdAt: -1 });

        let nextNumber = 1;
        if (latestStudent) {
            const parts = latestStudent.studentId.split('-');
            if (parts.length === 3 && parts[2]) {
                const lastNum = parseInt(parts[2], 10);
                if (!isNaN(lastNum)) {
                    nextNumber = lastNum + 1;
                }
            } else if (parts.length === 2 && parts[1]) {
                const lastNum = parseInt(parts[1], 10);
                if (!isNaN(lastNum)) {
                    nextNumber = lastNum + 1;
                }
            }
        }

        const firstStr = typeof firstName === 'string' ? firstName.trim().charAt(0) : '';
        const lastStr = typeof lastName === 'string' ? lastName.trim().charAt(0) : '';
        const initials = `${firstStr || 'X'}${lastStr || 'X'}`.toUpperCase();

        // Format number with leading zeros (e.g., 0001, 0002)
        const formattedNumber = String(nextNumber).padStart(4, '0');
        const generatedId = `${currentYear}-${initials}-${formattedNumber}`;

        res.json({ studentId: generatedId });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload student verification document (COR or ID)
// @route   POST /api/auth/upload-document
// @access  Public
export const uploadDocumentFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const relativePath = `/uploads/documents/${req.file.filename}`;
        res.status(200).json({
            url: relativePath,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'File upload failed' });
    }
};

// @desc    Resubmit student verification documents and updated info
// @route   PUT /api/auth/student/resubmit
// @access  Protected (Student)
export const resubmitVerification = async (req: Request, res: Response) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const { corUrl, idCardUrl } = req.body;

        // Academic identity fields are strictly immutable on resubmission
        student.documents = {
            corUrl: corUrl || student.documents?.corUrl || '',
            idCardUrl: idCardUrl || student.documents?.idCardUrl || '',
            submittedAt: new Date()
        };

        student.verificationStatus = 'pending';
        student.isResubmitted = true;

        if (!student.verificationDetails) {
            student.verificationDetails = {};
        }

        await student.save();

        res.status(200).json({
            message: 'Replacement documents resubmitted successfully for GCTSO review',
            student
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all faculty members with profile
// @route   GET /api/auth/faculty
// @access  Private (Staff/Admin)
export const getFacultyMembers = async (req: Request, res: Response) => {
    try {
        const facultyList = await MainUser.find({ role: UserRole.FACULTY })
            .populate('facultyProfile')
            .sort({ createdAt: -1 })
            .lean();

        const formatted = facultyList.map((f: any) => {
            const profile = f.facultyProfile || {};
            return {
                _id: f._id,
                firstName: f.firstName,
                lastName: f.lastName,
                email: f.email,
                role: f.role,
                isActive: f.isActive,
                createdAt: f.createdAt,
                department: profile.department || 'General Faculty',
                designation: profile.designation || 'Counselor / Instructor',
                employeeId: profile.employeeId || 'N/A'
            };
        });

        res.json(formatted);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch faculty list' });
    }
};

// @desc    Generate sequential faculty ID
// @route   GET /api/auth/generate-faculty-id
// @access  Private (Super Admin)
export const generateFacultyId = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName } = req.query;
        const currentYear = new Date().getFullYear();

        const latestFaculty = await Faculty.findOne({
            employeeId: new RegExp(`^FAC-${currentYear}-`)
        }).sort({ createdAt: -1 });

        let nextNumber = 1;
        if (latestFaculty && latestFaculty.employeeId) {
            const parts = latestFaculty.employeeId.split('-');
            const lastPart = parts[parts.length - 1];
            const parsed = lastPart ? parseInt(lastPart, 10) : NaN;
            if (!isNaN(parsed)) {
                nextNumber = parsed + 1;
            }
        }

        const firstStr = typeof firstName === 'string' ? firstName.trim().charAt(0) : '';
        const lastStr = typeof lastName === 'string' ? lastName.trim().charAt(0) : '';
        const initials = `${firstStr || 'F'}${lastStr || 'C'}`.toUpperCase();

        const formattedNumber = String(nextNumber).padStart(4, '0');
        const generatedId = `FAC-${currentYear}-${initials}-${formattedNumber}`;

        res.json({ employeeId: generatedId });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to generate faculty ID' });
    }
};

// @desc    Onboard new faculty member (Super Admin Only)
// @route   POST /api/auth/faculty/onboard
// @access  Private (Super Admin)
export const onboardFaculty = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, employeeId, department, designation } = req.body;

    try {
        if (!firstName || !lastName || !email || !department || !designation) {
            return res.status(400).json({ message: 'First name, last name, email, department, and designation are required' });
        }

        const existingUser = await MainUser.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: 'A user account with this email address already exists' });
        }

        let finalEmployeeId = employeeId;
        if (!finalEmployeeId) {
            const currentYear = new Date().getFullYear();
            const firstStr = firstName.trim().charAt(0);
            const lastStr = lastName.trim().charAt(0);
            const initials = `${firstStr || 'F'}${lastStr || 'C'}`.toUpperCase();

            const count = await Faculty.countDocuments();
            finalEmployeeId = `FAC-${currentYear}-${initials}-${String(count + 1).padStart(4, '0')}`;
        }

        const existingEmployeeId = await Faculty.findOne({ employeeId: finalEmployeeId });
        if (existingEmployeeId) {
            return res.status(400).json({ message: `Employee ID ${finalEmployeeId} is already in use` });
        }

        const rawPassword = password || `ZPPSU#${finalEmployeeId}`;

        // Create faculty user
        const newFacultyUser = await MainUser.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: rawPassword,
            role: UserRole.FACULTY,
            isActive: true,
        });

        // Create faculty profile
        const facultyProfile = await Faculty.create({
            user: newFacultyUser._id,
            employeeId: finalEmployeeId,
            department: department.trim(),
            designation: designation.trim()
        });

        // Link profile to user
        newFacultyUser.facultyProfile = facultyProfile._id as any;
        await newFacultyUser.save();

        res.status(201).json({
            message: 'Faculty account onboarded successfully',
            faculty: {
                _id: newFacultyUser._id,
                firstName: newFacultyUser.firstName,
                lastName: newFacultyUser.lastName,
                email: newFacultyUser.email,
                role: newFacultyUser.role,
                isActive: newFacultyUser.isActive,
                employeeId: facultyProfile.employeeId,
                department: facultyProfile.department,
                designation: facultyProfile.designation,
                temporaryPassword: rawPassword
            }
        });
    } catch (error: any) {
        console.error('Error onboarding faculty:', error);
        res.status(500).json({ message: error.message || 'Failed to onboard faculty member' });
    }
};


