import { Request, Response } from 'express';
import { SystemSettings } from '../models/SystemSettingsModel';

// Helper to ensure a default configuration exists in MongoDB
const getOrCreateDefaultSettings = async () => {
    let settings = await SystemSettings.findOne().lean();
    if (!settings) {
        const created = await SystemSettings.create({
            academicYear: '2025-2026',
            semester: '2nd Semester',
            allowStudentRegistration: true,
            studentLoginAccess: true,
            registrationClosedMessage: 'Student self-registration is currently closed by the University Administration for this academic term.',
            maintenanceMessage: 'Student Portal is temporarily in maintenance mode for semester processing. Guidance and Counseling offices remain open.',
            announcementBanner: {
                isActive: false,
                message: 'Welcome to the new academic semester! Please verify your student profile with the Guidance Office.',
                type: 'info'
            }
        });
        settings = created.toObject();
    }
    return settings;
};

// @desc    Get public system settings (Academic session, registration status, portal status, announcement)
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = async (_req: Request, res: Response) => {
    try {
        const settings = await getOrCreateDefaultSettings();

        // Send only public fields to client
        res.status(200).json({
            academicYear: settings.academicYear,
            semester: settings.semester,
            allowStudentRegistration: settings.allowStudentRegistration,
            studentLoginAccess: settings.studentLoginAccess,
            registrationClosedMessage: settings.registrationClosedMessage,
            maintenanceMessage: settings.maintenanceMessage,
            announcementBanner: settings.announcementBanner
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error fetching public settings:', error);
        res.status(500).json({ message: 'Failed to retrieve public system settings', error: err.message });
    }
};

// @desc    Get complete administrative system settings
// @route   GET /api/settings/admin
// @access  Protected (Admin only)
export const getAdminSettings = async (_req: Request, res: Response) => {
    try {
        const settings = await getOrCreateDefaultSettings();
        res.status(200).json(settings);
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error fetching admin settings:', error);
        res.status(500).json({ message: 'Failed to retrieve admin system settings', error: err.message });
    }
};

// @desc    Update administrative system settings
// @route   PUT /api/settings/admin
// @access  Protected (Admin only)
export const updateAdminSettings = async (req: Request, res: Response) => {
    try {
        const {
            academicYear,
            semester,
            allowStudentRegistration,
            studentLoginAccess,
            registrationClosedMessage,
            maintenanceMessage,
            announcementBanner
        } = req.body;

        const updateData: Record<string, unknown> = {};

        if (academicYear !== undefined) updateData.academicYear = academicYear;
        if (semester !== undefined) updateData.semester = semester;
        if (allowStudentRegistration !== undefined) updateData.allowStudentRegistration = Boolean(allowStudentRegistration);
        if (studentLoginAccess !== undefined) updateData.studentLoginAccess = Boolean(studentLoginAccess);
        if (registrationClosedMessage !== undefined) updateData.registrationClosedMessage = registrationClosedMessage;
        if (maintenanceMessage !== undefined) updateData.maintenanceMessage = maintenanceMessage;
        if (announcementBanner !== undefined) updateData.announcementBanner = announcementBanner;

        if (req.user) {
            updateData.updatedBy = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
        }

        const updatedSettings = await SystemSettings.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).lean();

        res.status(200).json({
            message: 'System settings updated successfully',
            settings: updatedSettings
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Error updating system settings:', error);
        res.status(500).json({ message: 'Failed to update system settings', error: err.message });
    }
};
