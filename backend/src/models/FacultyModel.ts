import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFaculty extends Document {
    user: mongoose.Types.ObjectId;
    employeeId: string;
    department: string;
    designation: string;
    // Add other faculty specific fields here
}

const FacultySchema = new Schema<IFaculty>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // One user -> One faculty profile
        },
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
        },
        department: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

import { mainDb } from '../config/db';

export const Faculty: Model<IFaculty> = mainDb.model<IFaculty>('Faculty', FacultySchema);
