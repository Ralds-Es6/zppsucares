import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export interface ICourse extends Document {
    department: mongoose.Types.ObjectId;
    departmentCode: string;
    code: string;
    name: string;
    duration: string;
    degreeType: string;
    category?: string;
    order: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const CourseSchema = new Schema<ICourse>(
    {
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: [true, 'Department reference is required'],
            index: true,
        },
        departmentCode: {
            type: String,
            required: true,
            uppercase: true,
            index: true,
        },
        code: {
            type: String,
            required: [true, 'Program code is required'],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Program name is required'],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
            trim: true,
        },
        degreeType: {
            type: String,
            required: [true, 'Degree type is required'],
            trim: true,
        },
        category: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Course: Model<ICourse> = mainDb.model<ICourse>('Course', CourseSchema);
