import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export interface IDepartment extends Document {
    name: string;
    code: string;
    order: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
    {
        name: {
            type: String,
            required: [true, 'Department name is required'],
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Department code is required'],
            unique: true,
            uppercase: true,
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

export const Department: Model<IDepartment> = mainDb.model<IDepartment>('Department', DepartmentSchema);
