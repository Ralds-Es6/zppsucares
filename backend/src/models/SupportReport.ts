import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export enum ReportStatus {
    PENDING = 'Pending',
    REVIEWED = 'Reviewed',
    RESOLVED = 'Resolved'
}

export enum ReportType {
    MENTAL = 'Mental Health Check',
    PHYSICAL = 'Physical Accessibility',
    GENERAL = 'General Guidance',
    EMERGENCY = 'Emergency Support'
}

export interface ISupportReport extends Document {
    student: mongoose.Types.ObjectId;
    type: ReportType;
    description: string;
    status: ReportStatus;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    adminNote?: string;
}

const SupportReportSchema = new Schema<ISupportReport>(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(ReportType),
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(ReportStatus),
            default: ReportStatus.PENDING,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        adminNote: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export const SupportReport: Model<ISupportReport> = mainDb.model<ISupportReport>('SupportReport', SupportReportSchema);
