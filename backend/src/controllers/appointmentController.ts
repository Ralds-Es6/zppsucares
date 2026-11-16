import { Request, Response } from 'express';
import { Appointment, MainUser } from '../models/DatabaseRouter';
import { Student } from '../models/StudentModel';
import { Notification } from '../models/NotificationModel';


// Helpers
const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).getUTCDay(); // 0 is Sunday, 6 is Saturday
};

const isValidDate = (dateString: string) => {
    const requestedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Exclude time portion

    // Need to use timezone-aware date parsing depending on the client, but YYYY-MM-DD parsed via UTC is mostly alright
    // Actually, simply parsing "YYYY-MM-DD" generates midnight UTC.
    // So comparing to `today` effectively enforces >= today dates.
    return requestedDate >= today;
};

// Slot start hours map (24h format)
const SLOT_START_TIMES: { [key: string]: number } = {
    '9:00 AM - 10:00 AM': 9,
    '10:00 AM - 11:00 AM': 10,
    '11:00 AM - 12:00 PM': 11,
    '1:00 PM - 2:00 PM': 13,
    '2:00 PM - 3:00 PM': 14,
    '3:00 PM - 4:00 PM': 15,
    '4:00 PM - 5:00 PM': 16
};

// @desc    Get all available slots for a given date
// @route   GET /api/counseling/available-slots
// @access  Private (Student)
export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.query as { date: string };

        if (!date) {
            res.status(400).json({ success: false, message: 'Date is required.' });
            return;
        }

        const dayOfWeek = getDayOfWeek(date);
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Weekend
            res.status(200).json({ success: true, availableSlots: [] });
            return;
        }

        // Fetch all pending or approved appointments for that date
        const bookedAppointments = await Appointment.find({
            date,
            status: { $in: ['Pending', 'Approved'] }
        });

        const bookedSlots = bookedAppointments.map((app: any) => app.timeSlot as string);

        const allSlots: string[] = [
            '9:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '1:00 PM - 2:00 PM',
            '2:00 PM - 3:00 PM',
            '3:00 PM - 4:00 PM',
            '4:00 PM - 5:00 PM'
        ];

        // Slot start hours map (24h format)


        // Determine current time in Manila (UTC+8)
        const now = new Date();
        const manilaOffset = 8 * 60; // 8 hours in minutes
        const manilaTime = new Date(now.getTime() + (manilaOffset + now.getTimezoneOffset()) * 60 * 1000);

        const todayStr = manilaTime.toISOString().split('T')[0];
        const currentTimeDecimal = manilaTime.getHours() + (manilaTime.getMinutes() / 60);

        const availableSlots = allSlots.filter((slot) => {
            // Filter out booked ones
            if (bookedSlots.includes(slot)) return false;

            // If requested date is today, filter out past slots (+ 30m buffer)
            if (date === todayStr) {
                const startTime = SLOT_START_TIMES[slot];
                if (startTime === undefined) return false;
                // Strict check: if startTime is 9 (9AM-10AM) and it's already 9:31AM (9.51), return false.
                return startTime > (currentTimeDecimal + 0.1);
            }

            return true;
        });

        console.log(`[getAvailableSlots] date='${date}' returnCount=${availableSlots.length} (Today=${todayStr === date})`);
        res.status(200).json({ success: true, availableSlots });
    } catch (error: any) {
        console.error('[getAvailableSlots] ERROR:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error', stack: error.stack });
    }
};

// @desc    Request a new counseling appointment
// @route   POST /api/counseling/request
// @access  Private (Student)
export const requestAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date, timeSlot, reason } = req.body;
        const studentId = (req as any).user.id;

        // Validations
        if (!date || !timeSlot || !reason) {
            res.status(400).json({ success: false, message: 'Date, time slot, and reason are required.' });
            return;
        }

        if (!isValidDate(date)) {
            res.status(400).json({ success: false, message: 'Cannot schedule appointments in the past.' });
            return;
        }

        const dayOfWeek = getDayOfWeek(date);
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            res.status(400).json({ success: false, message: 'Appointments cannot be scheduled on weekends.' });
            return;
        }

        const validSlots = [
            '9:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '1:00 PM - 2:00 PM',
            '2:00 PM - 3:00 PM',
            '3:00 PM - 4:00 PM',
            '4:00 PM - 5:00 PM'
        ];

        if (!validSlots.includes(timeSlot)) {
            res.status(400).json({ success: false, message: 'Invalid time slot.' });
            return;
        }

        const now = new Date();
        const manilaTime = new Date(now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60 * 1000);
        const todayStr = manilaTime.toISOString().split('T')[0];
        const currentTimeDecimal = manilaTime.getHours() + (manilaTime.getMinutes() / 60);

        if (date === todayStr) {
            const startTime = SLOT_START_TIMES[timeSlot];
            if (startTime !== undefined && startTime <= (currentTimeDecimal + 0.1)) {
                res.status(400).json({ success: false, message: 'This slot has already passed or is too close to start.' });
                return;
            }
        }

        // Check if double booking
        const existing = await Appointment.findOne({
            date,
            timeSlot,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existing) {
            res.status(400).json({ success: false, message: 'This time slot is no longer available.' });
            return;
        }

        const newAppointment = await Appointment.create({
            student: studentId,
            date,
            timeSlot,
            reason,
            status: 'Pending'
        });

        // Notify the student that their request was successfully lodged
        try {
            await Notification.create({
                user: studentId,
                title: 'Counseling Appointment Requested',
                message: `Your appointment request for ${date} at ${timeSlot} has been submitted and is currently pending admin approval.`,
                type: 'Update',
                relatedId: newAppointment._id
            });
        } catch (notifErr) {
            console.error("Failed to create notification for new appointment:", notifErr);
        }

        res.status(201).json({ success: true, message: 'Appointment requested successfully.', appointment: newAppointment });
    } catch (error: any) {
        if (error.code === 11000) { // MongoDB duplicate key error for unique compound index
            res.status(400).json({ success: false, message: 'This time slot is already booked.' });
        } else {
            console.error('Error requesting appointment:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};

// @desc    Get all appointments for the logged-in student
// @route   GET /api/counseling/my-appointments
// @access  Private (Student)
export const getMyAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = (req as any).user.id;
        const appointments = await Appointment.find({ student: studentId }).sort({ date: 1, createdAt: 1 });
        res.status(200).json({ success: true, appointments });
    } catch (error: any) {
        console.error('Error fetching my appointments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/counseling/all
// @access  Private (Admin)
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
        const role = (req as any).user.role;
        if (role !== 'admin' && role !== 'subadmin') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        const appointments = await Appointment.find()
            .populate({
                path: 'student',
                model: MainUser,
                select: 'firstName lastName email',
                populate: {
                    path: 'studentProfile',
                    model: Student,
                    select: 'studentId'
                }
            })
            .sort({ date: 1, createdAt: 1 });

        console.log(`Fetched ${appointments.length} appointments for admin.`);
        res.status(200).json({ success: true, appointments });
    } catch (error: any) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update appointment status (Admin only)
// @route   PUT /api/counseling/:id/status
// @access  Private (Admin)
export const updateAppointmentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        const role = (req as any).user.role;

        if (role !== 'admin' && role !== 'subadmin') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Completed'];
        if (!allowedStatuses.includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true, runValidators: true }
        ).populate('student', 'firstName lastName email');

        if (!updatedAppointment) {
            res.status(404).json({ success: false, message: 'Appointment not found.' });
            return;
        }

        // Send Notification to user (student)
        try {
            await Notification.create({
                user: (updatedAppointment.student as any)._id || updatedAppointment.student,
                title: 'Counseling Appointment Update',
                message: `Your appointment for ${updatedAppointment.date} at ${updatedAppointment.timeSlot} has been marked as ${status}. ${adminNotes ? 'Admin notes are attached.' : ''}`,
                type: 'Update',
                relatedId: updatedAppointment._id
            });
        } catch (notifErr) {
            console.error("Failed to create notification for appointment:", notifErr);
        }

        res.status(200).json({ success: true, message: 'Appointment updated successfully.', appointment: updatedAppointment });
    } catch (error: any) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
