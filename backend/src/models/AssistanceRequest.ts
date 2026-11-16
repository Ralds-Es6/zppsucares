import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export enum AssistanceRequestType {
    SCHOLARSHIP = 'Academic Scholarship',
    GRANT = 'Student Grant',
    EMERGENCY = 'Emergency Assistance'
}

export enum AssistanceStatus {
    PENDING = 'Pending Review',
    APPROVED = 'Approved',
    REJECTED = 'Rejected'
}

export interface IAssistanceRequest extends Document {
    student: mongoose.Types.ObjectId;
    type: AssistanceRequestType;
    status: AssistanceStatus;

    // Socio-Economic Details
    householdIncome: string;
    parentOccupation: string;
    numberOfDependents: number;
    gpa: string;

    // Documentation
    documentType: string;
    documentReference: string;
    additionalDocs?: string;

    // Contact & Interview Preferences
    availableDate: Date;
    contactNumber: string;
    additionalNotes?: string;

    // Admin Review
    adminNote?: string;

    history: {
        action: string;
        timestamp?: Date;
        note?: string;
    }[];
}

const AssistanceRequestSchema = new Schema<IAssistanceRequest>(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(AssistanceRequestType),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(AssistanceStatus),
            default: AssistanceStatus.PENDING,
        },
        householdIncome: { type: String, required: true },
        parentOccupation: { type: String, required: true },
        numberOfDependents: { type: Number, required: true },
        gpa: { type: String, required: true },
        documentType: { type: String, required: true },
        documentReference: { type: String, required: true },
        additionalDocs: { type: String },
        availableDate: { type: Date, required: true },
        contactNumber: { type: String, required: true },
        additionalNotes: { type: String },
        adminNote: { type: String },
        history: [
            {
                action: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                note: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const AssistanceRequest: Model<IAssistanceRequest> = mainDb.model<IAssistanceRequest>('AssistanceRequest', AssistanceRequestSchema);
