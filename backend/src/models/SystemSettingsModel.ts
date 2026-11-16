import { Schema, Document } from 'mongoose';
import { mainDb } from '../config/db';

export interface IAnnouncementBanner {
    isActive: boolean;
    message: string;
    type: 'info' | 'warning' | 'alert';
}

export interface ISystemSettings extends Document {
    academicYear: string;
    semester: string;
    allowStudentRegistration: boolean;
    studentLoginAccess: boolean;
    registrationClosedMessage: string;
    maintenanceMessage: string;
    announcementBanner: IAnnouncementBanner;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SystemSettingsSchema = new Schema<ISystemSettings>(
    {
        academicYear: {
            type: String,
            default: '2025-2026',
            required: true,
            trim: true
        },
        semester: {
            type: String,
            default: '2nd Semester',
            enum: ['1st Semester', '2nd Semester', 'Summer Term', 'Midyear Term'],
            required: true
        },
        allowStudentRegistration: {
            type: Boolean,
            default: true,
            required: true
        },
        studentLoginAccess: {
            type: Boolean,
            default: true,
            required: true
        },
        registrationClosedMessage: {
            type: String,
            default: 'Student self-registration is currently closed by the University Administration for this academic term.',
            trim: true
        },
        maintenanceMessage: {
            type: String,
            default: 'Student Portal is temporarily in maintenance mode for semester processing. Guidance and Counseling offices remain open.',
            trim: true
        },
        announcementBanner: {
            isActive: {
                type: Boolean,
                default: false
            },
            message: {
                type: String,
                default: 'Welcome to the new academic semester! Please verify your student profile with the Guidance Office.',
                trim: true
            },
            type: {
                type: String,
                enum: ['info', 'warning', 'alert'],
                default: 'info'
            }
        },
        updatedBy: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export const SystemSettings = mainDb.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);
