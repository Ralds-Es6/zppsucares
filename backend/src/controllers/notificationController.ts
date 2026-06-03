import { Request, Response } from 'express';
import { Notification } from '../models/NotificationModel';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find({ user: req.user?._id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (notification && notification.user.toString() === req.user?._id.toString()) {
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all unread notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        await Notification.updateMany(
            { user: req.user?._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
