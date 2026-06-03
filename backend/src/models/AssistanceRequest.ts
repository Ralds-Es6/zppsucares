import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export enum AssistanceRequestType {
    SCHOLARSHIP = 'Academic Scholarship',
    GRANT = 'Student Grant',
    EMERGENCY = 'Emergency Assistance'
}

export enum StepStatus {
    LOCKED = 'Locked',
    IN_PROGRESS = 'In Progress',
    PENDING_REVIEW = 'Pending Review',
    VERIFIED = 'Verified',
    REJECTED = 'Rejected'
}

export interface IAssistanceRequest extends Document {
    student: mongoose.Types.ObjectId;
    type: AssistanceRequestType;
    status: 'Active' | 'Finalized' | 'Cancelled';

    // Step 1: Socio-Economic Profiling
    step1: {
        status: StepStatus;
        data?: {
            householdIncome: string;
            parentOccupation: string;
            numberOfDependents: number;
            gpa: string;
        };
        adminNote?: string;
    };

    // Step 2: Documentation
    step2: {
        status: StepStatus;
        submittedDocuments: string[];
        data?: Record<string, any>;
        adminNote?: string;
    };

    // Step 3: Verification / Interview
    step3: {
        status: StepStatus;
        interviewDate?: Date;
        data?: Record<string, any>;
        adminNote?: string;
    };

    // Step 4: Final Approval
    step4: {
        status: StepStatus;
        adminNote?: string;
    };

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
            enum: ['Active', 'Finalized', 'Cancelled'],
            default: 'Active',
        },
        step1: {
            status: { type: String, enum: Object.values(StepStatus), default: StepStatus.IN_PROGRESS },
            data: {
                householdIncome: String,
                parentOccupation: String,
                numberOfDependents: Number,
                gpa: String,
            },
            adminNote: String,
        },
        step2: {
            status: { type: String, enum: Object.values(StepStatus), default: StepStatus.LOCKED },
            submittedDocuments: [String],
            data: { type: Schema.Types.Mixed },
            adminNote: String,
        },
        step3: {
            status: { type: String, enum: Object.values(StepStatus), default: StepStatus.LOCKED },
            interviewDate: Date,
            data: { type: Schema.Types.Mixed },
            adminNote: String,
        },
        step4: {
            status: { type: String, enum: Object.values(StepStatus), default: StepStatus.LOCKED },
            adminNote: String,
        },
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
