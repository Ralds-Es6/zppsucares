import { Request, Response } from 'express';
import { WellnessProfile } from '../models/WellnessProfile';
import { UserRole } from '../models/UserModel';
import { Notification } from '../models/NotificationModel';

// @desc    Submit or update student wellness profile for the current term
// @route   POST /api/wellness
// @access  Private (Student)
export const submitProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { physical, mental, academicTerm } = req.body;
        // @ts-ignore
        const user = req.user;

        if (user.role !== UserRole.STUDENT) {
            res.status(403).json({ message: 'Only students can submit a wellness profile' });
            return;
        }

        // Try to update existing for the term, or create new
        const term = academicTerm || '1st Semester 2026-2027';

        const profile = await WellnessProfile.findOneAndUpdate(
            { studentId: user.studentProfile, academicTerm: term },
            { physical, mental, status: 'Pending' }, // Reset status on resubmit
            { new: true, upsert: true }
        );

        // Notify student of successful submission
        try {
            await Notification.create({
                user: user._id,
                title: 'Wellness Profile Lodged',
                message: `Your updated wellness profile for ${term} has been submitted for faculty review.`,
                type: 'Update',
                relatedId: profile?._id
            });
        } catch (notifErr: any) {
            console.error("Failed to notify wellness submission:", notifErr);
        }

        res.status(201).json(profile);
    } catch (error) {
        console.error('Error submitting wellness profile:', error);
        res.status(500).json({ message: 'Server error while submitting profile' });
    }
};

// @desc    Get current student's wellness profile
// @route   GET /api/wellness/me
// @access  Private (Student)
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const user = req.user;

        // Return latest submitted profile
        const profile = await WellnessProfile.findOne({ studentId: user.studentProfile })
            .sort({ createdAt: -1 });

        if (!profile) {
            res.status(404).json({ message: 'No wellness profile found' });
            return;
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching wellness profile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// @desc    Get all student wellness profiles
// @route   GET /api/wellness
// @access  Private (Admin/Faculty)
export const getAllProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const profiles = await WellnessProfile.find({})
            .populate({
                path: 'studentId',
                populate: { path: 'user', select: 'firstName lastName email' }
            })
            .sort({ createdAt: -1 });

        res.json(profiles);
    } catch (error) {
        console.error('Error fetching all profiles:', error);
        res.status(500).json({ message: 'Server error while fetching profiles' });
    }
};

// @desc    Update a profile status and leave feedback
// @route   PUT /api/wellness/:id/status
// @access  Private (Admin)
export const updateProfileStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, adminNotes, studentFeedback } = req.body;

        const profile = await WellnessProfile.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes, studentFeedback },
            { new: true }
        ).populate({
            path: 'studentId'
        });

        if (!profile) {
            res.status(404).json({ message: 'Profile not found' });
            return;
        }

        // Notify student of evaluation feedback
        try {
            // @ts-ignore
            const studentUser = profile.studentId.user;
            await Notification.create({
                user: studentUser,
                title: 'Wellness Evaluation Update',
                message: `Your wellness profile status has been updated to "${status}". ${studentFeedback ? 'A feedback note has been attached.' : ''}`,
                type: 'Update',
                relatedId: profile._id
            });
        } catch (notifErr: any) {
            console.error("Failed to notify wellness status update:", notifErr);
        }

        res.json(profile);
    } catch (error) {
        console.error('Error updating profile status:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};
