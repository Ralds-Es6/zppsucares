import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export enum CaseStatus {
    OPEN = 'Open',
    ONGOING = 'Ongoing',
    CLOSED = 'Closed'
}

export enum CaseCategory {
    PHYSICAL = 'Physical',
    MENTAL = 'Mental',
    VIOLATION = 'Violation',
    POLICY = 'Policy',
    CRIME = 'Crime',
    OTHER = 'Other'
}

export interface ICaseNote {
    admin: mongoose.Types.ObjectId;
    note: string;
    timestamp: Date;
}

export interface ICase extends Document {
    student: mongoose.Types.ObjectId;
    admin: mongoose.Types.ObjectId;
    category: CaseCategory;
    status: CaseStatus;
    title: string;
    intakeForm: {
        facts: string;
        verdict: string;
        date: Date;
    };
    caseNotes: ICaseNote[];
    referralTracking: {
        behaviorStatus: string;
        latestStatusMental: string;
        latestStatusPhysical: string;
        lastUpdated: Date;
    };
    followUpSchedule: {
        date: Date;
        reason: string;
    }[];
}

const CaseSchema = new Schema<ICase>(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: Object.values(CaseCategory),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(CaseStatus),
            default: CaseStatus.OPEN,
        },
        intakeForm: {
            facts: { type: String, required: true },
            verdict: { type: String },
            date: { type: Date, default: Date.now },
        },
        caseNotes: [
            {
                admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                note: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        referralTracking: {
            behaviorStatus: { type: String, default: 'Normal' },
            latestStatusMental: { type: String, default: 'Stable' },
            latestStatusPhysical: { type: String, default: 'Healthy' },
            lastUpdated: { type: Date, default: Date.now },
        },
        followUpSchedule: [
            {
                date: { type: Date },
                reason: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Case: Model<ICase> = mainDb.model<ICase>('Case', CaseSchema);
