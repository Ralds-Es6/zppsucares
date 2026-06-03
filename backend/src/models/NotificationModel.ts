import mongoose, { Document, Model, Schema } from 'mongoose';
import { mainDb } from '../config/db';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'Update' | 'Alert' | 'Message';
    isRead: boolean;
    relatedId?: mongoose.Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Update', 'Alert', 'Message'],
            default: 'Update',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification: Model<INotification> = mainDb.model<INotification>('Notification', NotificationSchema);
