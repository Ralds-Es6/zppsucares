import { Request, Response } from 'express';
import { SupportReport, ReportStatus } from '../models/SupportReport';
import { Notification } from '../models/NotificationModel';

// @desc    Create new support report
// @route   POST /api/reports
// @access  Student
export const createReport = async (req: Request, res: Response) => {
    try {
        const { type, description, priority } = req.body;

        const report = await SupportReport.create({
            student: req.user?._id,
            type,
            description,
            priority: priority || 'Medium'
        });

        // Notify the student that their report was successfully lodged
        try {
            await Notification.create({
                user: req.user?._id,
                title: 'Incident Report Received',
                message: `Your report about "${type}" has been securely lodged and is now under review.`,
                type: 'Update',
                relatedId: report._id
            });
        } catch (notifErr: any) {
            console.error("Failed to create notification for new report:", notifErr);
        }

        res.status(201).json(report);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reports (Admin) or user reports (Student)
// @route   GET /api/reports
// @access  Private
export const getReports = async (req: Request, res: Response) => {
    try {
        let reports;
        if (req.user?.role === 'admin' || req.user?.role === 'faculty') {
            reports = await SupportReport.find()
                .populate({
                    path: 'student',
                    select: 'firstName lastName email',
                    populate: { path: 'studentProfile' }
                })
                .sort({ createdAt: -1 });
        } else {
            reports = await SupportReport.find({ student: req.user?._id })
                .sort({ createdAt: -1 });
        }
        res.json(reports);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Admin
export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const { status, adminNote } = req.body;
        const report = await SupportReport.findById(req.params.id);

        if (report) {
            if (status) report.status = status;
            if (adminNote !== undefined) report.adminNote = adminNote;

            await report.save();

            // Notify student of status update
            try {
                await Notification.create({
                    user: report.student,
                    title: 'Update on Your Incident Report',
                    message: `The status of your report about "${report.type}" has been updated to "${status}". ${adminNote ? 'Administrative feedback is now available.' : ''}`,
                    type: 'Update',
                    relatedId: report._id
                });
            } catch (notifErr: any) {
                console.error("Failed to notify report update:", notifErr);
            }

            res.json(report);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
