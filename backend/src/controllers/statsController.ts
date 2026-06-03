import { Request, Response } from 'express';
import { MainUser } from '../models/DatabaseRouter';
import { UserRole } from '../models/UserModel';
import { Case, CaseStatus, CaseCategory } from '../models/CaseModel';
import { SupportReport, ReportStatus, ReportType } from '../models/SupportReport';
import { Appointment } from '../models/DatabaseRouter';

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalStudents = await MainUser.countDocuments({ role: UserRole.STUDENT });
        const totalFaculty = await MainUser.countDocuments({ role: UserRole.FACULTY });
        console.log(`Debug Stats - DB: ${MainUser.db.name}, Students: ${totalStudents}, Faculty: ${totalFaculty}`);

        const mentalHealthConcerns = await Case.countDocuments({ category: CaseCategory.MENTAL, status: { $ne: CaseStatus.CLOSED } });
        const physicallyDisabled = await Case.countDocuments({ category: CaseCategory.PHYSICAL, status: { $ne: CaseStatus.CLOSED } });
        const otherConcerns = await Case.countDocuments({
            category: { $in: [CaseCategory.VIOLATION, CaseCategory.POLICY, CaseCategory.CRIME, CaseCategory.OTHER] },
            status: { $ne: CaseStatus.CLOSED }
        });

        // Critical reports = Any Pending Support Reports with Critical priority
        const criticalReportsList = await SupportReport.find({
            status: ReportStatus.PENDING,
            priority: 'Critical'
        }).populate('student', 'firstName lastName').sort({ createdAt: -1 });

        const criticalReportsCount = criticalReportsList.length;

        // Pending reports = All other pending reports
        const pendingReportsCount = await SupportReport.countDocuments({
            status: ReportStatus.PENDING,
            _id: { $nin: criticalReportsList.map(r => r._id) }
        });

        res.json({
            totalStudents,
            totalFaculty,
            physicallyDisabled,
            mentalHealthConcerns,
            otherConcerns,
            healthy: totalStudents - (mentalHealthConcerns + physicallyDisabled + otherConcerns),
            criticalReportsCount,
            criticalReportsList,
            pendingReportsCount
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminTrends = async (req: Request, res: Response) => {
    try {
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // ── 1. Monthly Reports Trend: group by month + priority ──
        const reportsByMonth = await SupportReport.aggregate([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, priority: '$priority' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.month': 1 } }
        ]);

        // ── 2. Monthly Reports by Status (for resolved vs pending line) ──
        const reportsByStatus = await SupportReport.aggregate([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, status: '$status' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.month': 1 } }
        ]);

        // ── 3. Monthly Appointments Trend (date stored as YYYY-MM-DD string) ──
        const appointmentsByMonth = await Appointment.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $substr: ['$date', 0, 4] }, year.toString()]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $toInt: { $substr: ['$date', 5, 2] } },
                        status: '$status'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.month': 1 } }
        ]);

        // ── 4. Monthly Cases Opened ──
        const casesByMonth = await Case.aggregate([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, category: '$category' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.month': 1 } }
        ]);

        // ── Build normalized monthly arrays (12 months each) ──
        const reportsMonthly = MONTHS.map((name, i) => {
            const month = i + 1;
            const get = (priority: string) =>
                reportsByMonth.find(r => r._id.month === month && r._id.priority === priority)?.count || 0;
            const getStatus = (status: string) =>
                reportsByStatus.find(r => r._id.month === month && r._id.status === status)?.count || 0;
            return {
                month: name,
                Critical: get('Critical'),
                High: get('High'),
                Medium: get('Medium'),
                Low: get('Low'),
                Resolved: getStatus('Resolved'),
                Pending: getStatus('Pending'),
                Reviewed: getStatus('Reviewed'),
                Total: get('Critical') + get('High') + get('Medium') + get('Low')
            };
        });

        const appointmentsMonthly = MONTHS.map((name, i) => {
            const month = i + 1;
            const get = (status: string) =>
                appointmentsByMonth.find(a => a._id.month === month && a._id.status === status)?.count || 0;
            return {
                month: name,
                Approved: get('Approved'),
                Pending: get('Pending'),
                Rejected: get('Rejected'),
                Completed: get('Completed'),
                Total: get('Approved') + get('Pending') + get('Rejected') + get('Completed')
            };
        });

        const casesMonthly = MONTHS.map((name, i) => {
            const month = i + 1;
            const get = (category: string) =>
                casesByMonth.find(c => c._id.month === month && c._id.category === category)?.count || 0;
            return {
                month: name,
                Physical: get('Physical'),
                Mental: get('Mental'),
                Other: get('Violation') + get('Policy') + get('Crime') + get('Other'),
                Total: get('Physical') + get('Mental') + get('Violation') + get('Policy') + get('Crime') + get('Other')
            };
        });

        res.json({
            year,
            reportsMonthly,
            appointmentsMonthly,
            casesMonthly
        });
    } catch (error: any) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ message: error.message });
    }
};
