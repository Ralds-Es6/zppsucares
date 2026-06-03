import { Request, Response } from 'express';
import { AssistanceRequest, StepStatus } from '../models/AssistanceRequest';
import { Notification } from '../models/NotificationModel';

// @desc    Create new assistance request
// @route   POST /api/assistance/request
// @access  Student
export const createAssistanceRequest = async (req: Request, res: Response) => {
    try {
        const { type } = req.body;

        const existingRequest = await AssistanceRequest.findOne({
            student: req.user?._id,
            status: 'Active'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have an active assistance request in progress.' });
        }

        const request = await AssistanceRequest.create({
            student: req.user?._id,
            type,
            history: [{ action: 'Application Initialized', note: `Started ${type} journey.` }]
        });

        res.status(201).json(request);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's active request
// @route   GET /api/assistance/my-request
// @access  Student
export const getMyAssistanceRequest = async (req: Request, res: Response) => {
    try {
        const request = await AssistanceRequest.findOne({
            student: req.user?._id,
            status: { $in: ['Active', 'Finalized'] }
        }).sort({ updatedAt: -1 });

        res.json(request);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update step data (Student)
// @route   PUT /api/assistance/update-step
// @access  Student
export const updateAssistanceStep = async (req: Request, res: Response) => {
    try {
        const { step, data } = req.body;
        const request = await AssistanceRequest.findOne({
            student: req.user?._id,
            status: 'Active'
        });

        if (!request) {
            return res.status(404).json({ message: 'No active request found.' });
        }

        if (step === 1) {
            request.step1.data = data;
            request.step1.status = StepStatus.PENDING_REVIEW;
            request.history.push({ action: 'Step 1 Submitted', note: 'Socio-Economic profiling completed.' });
        } else if (step === 2) {
            request.step2.data = data;
            request.step2.status = StepStatus.PENDING_REVIEW;
            request.history.push({ action: 'Step 2 Submitted', note: 'Documents uploaded for review.' });
        } else if (step === 3) {
            request.step3.data = data;
            request.step3.status = StepStatus.PENDING_REVIEW;
            request.history.push({ action: 'Step 3 Submitted', note: 'Verification details submitted.' });
        }

        await request.save();
        res.json(request);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests (Admin)
// @route   GET /api/assistance/all
// @access  Admin
export const getAllAssistanceRequests = async (req: Request, res: Response) => {
    try {
        const requests = await AssistanceRequest.find()
            .populate({
                path: 'student',
                select: 'firstName lastName email',
                populate: { path: 'studentProfile' }
            })
            .sort({ updatedAt: -1 });
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Reject step (Admin)
// @route   PUT /api/assistance/verify-step
// @access  Admin
export const verifyAssistanceStep = async (req: Request, res: Response) => {
    try {
        const { requestId, step, status, adminNote } = req.body;
        const request = await AssistanceRequest.findById(requestId);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (step === 1) {
            request.step1.status = status;
            request.step1.adminNote = adminNote;
            if (status === StepStatus.VERIFIED) {
                request.step2.status = StepStatus.IN_PROGRESS;
                request.history.push({ action: 'Step 1 Verified', note: adminNote || 'Profiling verified.' });
            } else if (status === StepStatus.REJECTED) {
                request.history.push({ action: 'Step 1 Rejected', note: adminNote });
            }
        } else if (step === 2) {
            request.step2.status = status;
            request.step2.adminNote = adminNote;
            if (status === StepStatus.VERIFIED) {
                request.step3.status = StepStatus.IN_PROGRESS;
                request.history.push({ action: 'Step 2 Verified', note: adminNote || 'Documents verified.' });
            } else if (status === StepStatus.REJECTED) {
                request.history.push({ action: 'Step 2 Rejected', note: adminNote });
            }
        } else if (step === 3) {
            request.step3.status = status;
            request.step3.adminNote = adminNote;
            if (status === StepStatus.VERIFIED) {
                request.step4.status = StepStatus.PENDING_REVIEW;
                request.history.push({ action: 'Step 3 Verified', note: adminNote || 'Interview/Verification completed.' });
                request.history.push({ action: 'Final Review Unlocked', note: 'All steps completed. Application ready for final approval.' });
            } else if (status === StepStatus.REJECTED) {
                request.history.push({ action: 'Step 3 Rejected', note: adminNote });
            }
        } else if (step === 4) {
            request.step4.status = status;
            request.step4.adminNote = adminNote;
            if (status === StepStatus.VERIFIED) {
                request.status = 'Finalized';
                request.history.push({ action: 'Application Approved', note: adminNote || 'Full assistance package approved.' });
            } else if (status === StepStatus.REJECTED) {
                request.history.push({ action: 'Application Rejected', note: adminNote || 'Application did not meet final approval criteria.' });
            }
        }

        await request.save();

        // Notify student
        await Notification.create({
            user: request.student,
            title: `Assistance Journey Update`,
            message: `Step ${step} has been marked as ${status}. ${adminNote ? 'Message: ' + adminNote : ''}`,
            type: 'Update',
            relatedId: request._id
        });

        res.json(request);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
