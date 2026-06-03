import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export enum ProfilingStatus {
    PENDING = 'Pending',
    REVIEWED = 'Reviewed',
    FLAGGED = 'Action Required',
    VERIFIED = 'Verified'
}

export interface IWellnessProfile extends Document {
    studentId: mongoose.Types.ObjectId;
    academicTerm: string;

    // Physical Profiling
    physical: {
        hasAccessibilityNeeds: boolean;
        disabilityType?: string; // Visual, Hearing, Mobility, etc.
        requiresMobilityAid: boolean;
        ongoingMedicalCondition?: string; // e.g. asthma, heart condition
    };

    // Mental Well-being Profiling
    mental: {
        currentStressLevel: number; // 1-10 scale
        diagnosedCondition?: string; // e.g. severe anxiety
        isCurrentlyInTherapy: boolean;
        academicStressors?: string; 
    };

    // Admin Interaction & Status
    status: ProfilingStatus;
    adminNotes?: string; // Internal notes not seen by the student
    studentFeedback?: string; // Feedback from admin explicitly sent to student dashboard
}

const WellnessProfileSchema = new Schema<IWellnessProfile>(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        academicTerm: {
            type: String,
            required: true,
            default: '1st Semester 2026-2027',
        },
        physical: {
            hasAccessibilityNeeds: { type: Boolean, default: false },
            disabilityType: { type: String, trim: true },
            requiresMobilityAid: { type: Boolean, default: false },
            ongoingMedicalCondition: { type: String, trim: true },
        },
        mental: {
            currentStressLevel: { type: Number, min: 1, max: 10, default: 1 },
            diagnosedCondition: { type: String, trim: true },
            isCurrentlyInTherapy: { type: Boolean, default: false },
            academicStressors: { type: String, trim: true },
        },
        status: {
            type: String,
            enum: Object.values(ProfilingStatus),
            default: ProfilingStatus.PENDING,
        },
        adminNotes: {
            type: String,
        },
        studentFeedback: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const WellnessProfile: Model<IWellnessProfile> = mainDb.model<IWellnessProfile>('WellnessProfile', WellnessProfileSchema);
