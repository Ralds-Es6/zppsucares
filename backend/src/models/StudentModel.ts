import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudent extends Document {
    user: mongoose.Types.ObjectId;
    studentId: string;
    course: string;
    yearLevel: number;
    section: string;
    // Add other student specific fields here
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
        }
    },
    {
        timestamps: true,
    }
);

import { mainDb } from '../config/db';

export const Student: Model<IStudent> = mainDb.model<IStudent>('Student', StudentSchema);
