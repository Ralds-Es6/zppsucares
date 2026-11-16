import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudent extends Document {
    user: mongoose.Types.ObjectId;
    studentId: string;
    department?: string;
    course: string;
    yearLevel: number;
    section: string;
    verificationStatus: 'pending' | 'approved' | 'declined';
    documents: {
        corUrl: string;
        idCardUrl: string;
        submittedAt: Date;
    };
    verificationDetails?: {
        reviewedAt?: Date;
        reviewedBy?: mongoose.Types.ObjectId;
        declineReason?: string;
    };
    isResubmitted?: boolean;
}

const StudentSchema = new Schema<IStudent>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // One user -> One student profile
        },
        studentId: {
            type: String,
            required: [true, 'Student ID number is required'],
            unique: true,
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        course: {
            type: String,
            required: true,
        },
        yearLevel: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        section: {
            type: String,
            required: true,
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'declined'],
            default: 'approved',
            index: true,
        },
        documents: {
            corUrl: { type: String, default: '' },
            idCardUrl: { type: String, default: '' },
            submittedAt: { type: Date, default: Date.now },
        },
        verificationDetails: {
            reviewedAt: { type: Date },
            reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            declineReason: { type: String, default: '' },
        },
        isResubmitted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

import { mainDb } from '../config/db';

export const Student: Model<IStudent> = mainDb.model<IStudent>('Student', StudentSchema);
