import { Request, Response } from 'express';
import { AssistanceRequest, AssistanceStatus, AssistanceRequestType } from '../models/AssistanceRequest';
import { Notification } from '../models/NotificationModel';

// @desc    Apply for assistance (Student)
// @route   POST /api/assistance/apply
// @access  Student
export const applyForAssistance = async (req: Request, res: Response) => {
    try {
        const {
            type,
            householdIncome,
            parentOccupation,
            numberOfDependents,
            gpa,
            documentType,
            documentReference,
            additionalDocs,
            availableDate,
            contactNumber,
            additionalNotes
        } = req.body;

        // Check if there is already a pending request for this student
        const pendingRequest = await AssistanceRequest.findOne({
            student: req.user?._id,
            status: AssistanceStatus.PENDING
        });

        if (pendingRequest) {
            return res.status(400).json({ message: 'You already have an active application pending review.' });
        }

        const request = await AssistanceRequest.create({
            student: req.user?._id,
            type,
            status: AssistanceStatus.PENDING,
            householdIncome,
            parentOccupation,
            numberOfDependents,
            gpa,
            documentType,
            documentReference,
            additionalDocs,
            availableDate,
            contactNumber,
            additionalNotes,
            history: [{ action: 'Application Submitted', note: `Submitted application for ${type}.` }]
        });

        res.status(201).json(request);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's latest request
// @route   GET /api/assistance/my-request
// @access  Student
export const getMyAssistanceRequest = async (req: Request, res: Response) => {
    try {
        const request = await AssistanceRequest.findOne({
            student: req.user?._id
        }).sort({ updatedAt: -1 });

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

// @desc    Review/Approve/Reject application (Admin)
// @route   PUT /api/assistance/review
// @access  Admin
export const reviewAssistanceRequest = async (req: Request, res: Response) => {
    try {
        const { requestId, status, adminNote } = req.body;

        if (!Object.values(AssistanceStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid evaluation status.' });
        }

        const request = await AssistanceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Application request not found.' });
        }

        request.status = status;
        request.adminNote = adminNote;

        const actionText = status === AssistanceStatus.APPROVED ? 'Application Approved' : 'Application Rejected';
        const noteText = adminNote || (status === AssistanceStatus.APPROVED ? 'Approved by administration.' : 'Rejected by administration.');

        request.history.push({
            action: actionText,
            note: noteText
        });

        await request.save();

        // Notify student
        await Notification.create({
            user: request.student,
            title: `Assistance Application Decision`,
            message: `Your application for ${request.type} has been ${status.toLowerCase()}. ${adminNote ? 'Remarks: ' + adminNote : ''}`,
            type: 'Update',
            relatedId: request._id
        });

        res.json(request);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
