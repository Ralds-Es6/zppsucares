import { Request, Response } from 'express';
import { Student } from '../models/StudentModel';
import { MainUser } from '../models/DatabaseRouter';

// @desc    Get all student registration verifications with filters
// @route   GET /api/admin/verifications
// @access  Protected (Admin only)
export const getVerifications = async (req: Request, res: Response) => {
    try {
        const { status, department, yearLevel, search } = req.query;

        // Build base filter for Student
        const filter: Record<string, unknown> = {};

        if (status && status !== 'all') {
            if (status === 'resubmitted') {
                filter.verificationStatus = 'pending';
                filter.isResubmitted = true;
            } else {
                filter.verificationStatus = status;
            }
        }

        if (department && department !== 'all') {
            filter.department = department;
        }

        if (yearLevel && yearLevel !== 'all') {
            filter.yearLevel = Number(yearLevel);
        }

        // Fetch students and populate user using .lean() to eliminate Mongoose document overhead and reduce GC pressure
        let students = await Student.find(filter)
            .populate('user', 'firstName lastName email role isActive createdAt')
            .populate('verificationDetails.reviewedBy', 'firstName lastName email')
            .sort({ updatedAt: -1 })
            .lean();

        // Apply search query if provided (matches name, email, studentId)
        if (search && typeof search === 'string' && search.trim() !== '') {
            const query = search.toLowerCase().trim();
            students = students.filter((s) => {
                const user = s.user as { firstName?: string; lastName?: string; email?: string } | null;
                const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase() : '';
                const email = user ? (user.email || '').toLowerCase() : '';
                const studentId = s.studentId ? s.studentId.toLowerCase() : '';
                const course = s.course ? s.course.toLowerCase() : '';
                return (
                    fullName.includes(query) ||
                    email.includes(query) ||
                    studentId.includes(query) ||
                    course.includes(query)
                );
            });
        }

        // Calculate counts across the database for status chips
        const [totalCount, pendingCount, approvedCount, declinedCount, resubmittedCount] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ verificationStatus: 'pending' }),
            Student.countDocuments({ verificationStatus: 'approved' }),
            Student.countDocuments({ verificationStatus: 'declined' }),
            Student.countDocuments({ verificationStatus: 'pending', isResubmitted: true })
        ]);

        res.status(200).json({
            students,
            counts: {
                total: totalCount,
                pending: pendingCount,
                approved: approvedCount,
                declined: declinedCount,
                resubmitted: resubmittedCount
            }
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error in getVerifications:', error);
        res.status(500).json({ message: err.message || 'Failed to fetch verifications' });
    }
};

// @desc    Approve student verification
// @route   PUT /api/admin/verifications/:id/approve
// @access  Protected (Admin only)
export const approveVerification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id).populate('user');
        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        student.verificationStatus = 'approved';
        student.isResubmitted = false;
        student.verificationDetails = {
            reviewedAt: new Date(),
            reviewedBy: req.user._id,
            declineReason: ''
        };

        await student.save();

        // Ensure associated user is active
        if (student.user) {
            await MainUser.findByIdAndUpdate((student.user as any)._id, { isActive: true });
        }

        res.status(200).json({
            message: 'Student registration officially approved & verified!',
            student
        });
    } catch (error: any) {
        console.error('Error approving verification:', error);
        res.status(500).json({ message: error.message || 'Failed to approve verification' });
    }
};

// @desc    Decline student verification
// @route   PUT /api/admin/verifications/:id/decline
// @access  Protected (Admin only)
export const declineVerification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({ message: 'A reason for declining the registration is required' });
        }

        const student = await Student.findById(id).populate('user');
        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        student.verificationStatus = 'declined';
        student.isResubmitted = false;
        student.verificationDetails = {
            reviewedAt: new Date(),
            reviewedBy: req.user._id,
            declineReason: reason.trim()
        };

        await student.save();

        res.status(200).json({
            message: 'Student registration declined with feedback provided.',
            student
        });
    } catch (error: any) {
        console.error('Error declining verification:', error);
        res.status(500).json({ message: error.message || 'Failed to decline verification' });
    }
};
