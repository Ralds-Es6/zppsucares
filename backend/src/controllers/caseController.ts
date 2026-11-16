import { Request, Response } from "express";
import { Case, CaseStatus } from '../models/CaseModel';
import { Notification } from '../models/NotificationModel';

// @desc    Create new case
// @route   POST /api/cases
// @access  Admin
export const createCase = async (req: Request, res: Response) => {
    try {
        const { studentId, title, category, intakeForm, referralTracking } = req.body;

        const caseData = await Case.create({
            student: studentId,
            admin: req.user?._id,
            title,
            category,
            intakeForm,
            referralTracking
        });

        try {
            await Notification.create({
                user: studentId,
                title: 'New Profiling Record Created',
                message: `A new profiling record titled "${title}" has been filed under your name regarding ${category}.`,
                type: 'Update',
                relatedId: caseData._id
            });
        } catch (notifErr) {
            console.error("Failed to create notification for new case:", notifErr);
        }

        res.status(201).json(caseData);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all cases (Admin) or user cases (Student)
// @route   GET /api/cases
// @access  Private
export const getCases = async (req: Request, res: Response) => {
    try {
        let cases;
        if (req.user?.role === 'admin' || req.user?.role === 'subadmin' || req.user?.role === 'faculty') {
            cases = await Case.find()
                .populate({
                    path: 'student',
                    select: 'firstName lastName email',
                    populate: { path: 'studentProfile' }
                })
                .populate('admin', 'firstName lastName')
                .sort({ createdAt: -1 });
        } else {
            cases = await Case.find({ student: req.user?._id })
                .populate('admin', 'firstName lastName')
                .sort({ createdAt: -1 });
        }
        res.json(cases);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
export const getCaseById = async (req: Request, res: Response) => {
    try {
        const caseInstance = await Case.findById(req.params.id)
            .populate('student', 'firstName lastName email')
            .populate('admin', 'firstName lastName');

        if (caseInstance) {
            // Check if user is either the admin or the student of the case
            if (req.user.role === 'admin' || req.user.role === 'subadmin' || req.user.role === 'faculty' || caseInstance.student._id.toString() === req.user._id.toString()) {
                res.json(caseInstance);
            } else {
                res.status(403).json({ message: 'Not authorized to view this case' });
            }
        } else {
            res.status(404).json({ message: 'Case not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add case note
// @route   POST /api/cases/:id/notes
// @access  Admin
export const addCaseNote = async (req: Request, res: Response) => {
    try {
        const { note } = req.body;
        const caseInstance = await Case.findById(req.params.id);

        if (caseInstance) {
            caseInstance.caseNotes.push({
                admin: req.user?._id as any,
                note,
                timestamp: new Date()
            });
            await caseInstance.save();
            res.status(201).json(caseInstance);
        } else {
            res.status(404).json({ message: 'Case not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update referral status
// @route   PATCH /api/cases/:id/referral
// @access  Admin
export const updateReferral = async (req: Request, res: Response) => {
    try {
        const { behaviorStatus, latestStatusMental, latestStatusPhysical } = req.body;
        const caseInstance = await Case.findById(req.params.id);

        if (caseInstance) {
            const oldMental = caseInstance.referralTracking.latestStatusMental || 'Stable';
            const oldPhysical = caseInstance.referralTracking.latestStatusPhysical || 'Healthy';
            const newMental = latestStatusMental || oldMental;
            const newPhysical = latestStatusPhysical || oldPhysical;

            caseInstance.referralTracking = {
                ...caseInstance.referralTracking,
                behaviorStatus: behaviorStatus || caseInstance.referralTracking.behaviorStatus,
                latestStatusMental: newMental,
                latestStatusPhysical: newPhysical,
                lastUpdated: new Date()
            };
            await caseInstance.save();

            let updates: string[] = [];
            if (oldMental !== newMental) updates.push(`Mental Wellbeing changed from "${oldMental}" to "${newMental}"`);
            if (oldPhysical !== newPhysical) updates.push(`Physical Status changed from "${oldPhysical}" to "${newPhysical}"`);

            let messageDetails = `Your Profiling Status for case "${caseInstance.title}" has been updated by the administration.`;
            if (updates.length > 0) {
                messageDetails += `\n\nChanges:\n• ${updates.join('\n• ')}`;
            }

            // Notify the student about the status update
            await Notification.create({
                user: caseInstance.student,
                title: 'Profiling Status Updated',
                message: messageDetails,
                type: 'Update',
                relatedId: caseInstance._id,
            });

            res.json(caseInstance);
        } else {
            res.status(404).json({ message: 'Case not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Schedule follow-up
// @route   POST /api/cases/:id/follow-up
// @access  Admin
export const scheduleFollowUp = async (req: Request, res: Response) => {
    try {
        const { date, reason } = req.body;
        const caseInstance = await Case.findById(req.params.id);

        if (caseInstance) {
            caseInstance.followUpSchedule.push({
                date,
                reason
            });
            await caseInstance.save();

            try {
                await Notification.create({
                    user: caseInstance.student,
                    title: 'New Follow-Up Scheduled',
                    message: `A follow-up has been scheduled for your profiling case "${caseInstance.title}" on ${new Date(date).toLocaleDateString()}. Reason: ${reason}`,
                    type: 'Alert',
                    relatedId: caseInstance._id
                });
            } catch (err) {
                console.error("Failed to notify follow-up:", err);
            }

            res.status(201).json(caseInstance);
        } else {
            res.status(404).json({ message: 'Case not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update case status
// @route   PATCH /api/cases/:id/status
// @access  Admin
export const updateCaseStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const caseInstance = await Case.findById(req.params.id);

        if (caseInstance) {
            caseInstance.status = status;
            await caseInstance.save();

            try {
                await Notification.create({
                    user: caseInstance.student,
                    title: 'Profiling Status Update',
                    message: `The overall status of your profiling record "${caseInstance.title}" has been updated to ${status}.`,
                    type: 'Update',
                    relatedId: caseInstance._id
                });
            } catch (err) {
                console.error("Failed to notify status update:", err);
            }

            res.json(caseInstance);
        } else {
            res.status(404).json({ message: 'Case not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
