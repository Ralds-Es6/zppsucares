import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { authStorage } from '../utils/authStorage';



// Components
import AdminSidebar from '../components/dashboard/admin/AdminSidebar';
import DashboardOverview, { type DashboardStats, type CriticalReport } from '../components/dashboard/admin/DashboardOverview';
import CaseManagement from '../components/dashboard/admin/CaseManagement';
import FacultyManagement from '../components/dashboard/admin/FacultyManagement';
import StudentReports from '../components/dashboard/admin/StudentReports';
import CounselingAppointments from '../components/dashboard/admin/CounselingAppointments';
import AssistancePipeline from '../components/dashboard/admin/AssistancePipeline';
import SystemSettings from '../components/dashboard/admin/SystemSettings';
import StudentVerification from '../components/dashboard/admin/StudentVerification';
import AccountDirectory from '../components/dashboard/admin/AccountDirectory';

// Modals
import ReportProcessingModal from '../components/dashboard/admin/modals/ReportProcessingModal';
import AppointmentProcessingModal from '../components/dashboard/admin/modals/AppointmentProcessingModal';

interface AdminAppointmentItem {
    _id: string;
    student?: unknown;
    counselor?: unknown;
    date?: string;
    timeSlot?: string;
    status?: string;
    [key: string]: unknown;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pendingVerifications, setPendingVerifications] = useState(0);

    // Stats State
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalReports: 0,
        pendingReportsCount: 0,
        criticalReportsCount: 0,
        criticalReportsList: [],
        physicallyDisabled: 0,
        mentalHealthConcerns: 0,
        otherConcerns: 0,
        healthy: 0,
        totalFaculty: 0
    });
    const [, setIsStatsLoading] = useState(true);

    // Reports State
    const [reports, setReports] = useState<CriticalReport[]>([]);
    const [, setIsReportsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [filterPriority, setFilterPriority] = useState('Any Priority');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [reportPage, setReportPage] = useState(1);
    const [processingReport, setProcessingReport] = useState<CriticalReport | null>(null);

    // Appointments State
    const [appointments, setAppointments] = useState<AdminAppointmentItem[]>([]);
    const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(true);
    const [processingAppointment, setProcessingAppointment] = useState<AdminAppointmentItem | null>(null);

    const fetchStats = async () => {
        try {
            const userInfo = authStorage.getAdmin() || {};
            const { data } = await axios.get('/api/stats/admin', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setIsStatsLoading(false);
        }
    };

    const fetchReports = async () => {
        try {
            const userInfo = authStorage.getAdmin() || {};
            const { data } = await axios.get('/api/reports', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports", error);
        } finally {
            setIsReportsLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const userInfo = authStorage.getAdmin() || {};
            const { data } = await axios.get('/api/counseling/all', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error("Error fetching appointments", error);
        } finally {
            setIsAppointmentsLoading(false);
        }
    };

    const handleUpdateReportStatus = async (reportId: string, status: string, adminNote: string) => {
        try {
            const userInfo = authStorage.getAdmin() || {};
            await axios.patch(`/api/reports/${reportId}/status`, { status, adminNote }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setProcessingReport(null);
            fetchReports();
            fetchStats();
            toast.success("Report status successfully updated!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error("Error updating report", error);
            toast.error(err.response?.data?.message || "Failed to update report status.");
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId: string, status: string, adminNotes: string) => {
        try {
            const userInfo = authStorage.getAdmin() || {};
            await axios.put(`/api/counseling/${appointmentId}/status`, { status, adminNotes }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setProcessingAppointment(null);
            fetchAppointments();
            fetchStats();
            toast.success(`Counseling appointment marked as ${status}.`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error("Error updating appointment", error);
            toast.error(err.response?.data?.message || "Failed to update appointment.");
        }
    };

    const handleLogout = () => {
        authStorage.removeAdmin();
        const adminPath = import.meta.env.VITE_ADMIN_SECURE_ROUTE || 'admin/login';
        navigate(`/${adminPath}`, { replace: true });
    };

    useEffect(() => {
        const userInfo = authStorage.getAdmin();
        if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'subadmin')) {
            const adminPath = import.meta.env.VITE_ADMIN_SECURE_ROUTE || 'admin/login';
            navigate(`/${adminPath}`, { replace: true });
            return;
        }

        fetchStats();
        fetchReports();
        fetchAppointments();

        // Fetch initial pending verification count
        const fetchInitialPending = async () => {
            try {
                const { data } = await axios.get('/api/admin/verifications', {
                    params: { status: 'pending' },
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                if (data.counts) {
                    setPendingVerifications(data.counts.pending || 0);
                }
            } catch (err) {
                console.error("Failed to fetch pending count", err);
            }
        };
        fetchInitialPending();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-bg-light flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                pendingCount={pendingVerifications}
            />

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen md:h-screen overflow-y-auto relative custom-scrollbar">
                {/* Background Decorators */}
                <div className="absolute top-0 right-0 w-150 h-150 bg-primary-main/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-primary-main/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

                <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1680px] mx-auto relative z-10">
                    {/* Top-Right Profile & Logout Bar (Desktop / Tablet) */}
                    <div className="hidden md:flex items-center justify-end gap-3 mb-6">
                        <div className="flex items-center gap-3 glass-slab px-3.5 py-2 rounded-2xl">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                                style={{ backgroundColor: '#87CEFA' }}
                            >
                                <User size={18} className="text-white" strokeWidth={2.4} />
                            </div>
                            <div className="text-left min-w-0 pr-1">
                                <p className="font-extrabold text-gray-900 text-xs leading-tight truncate">
                                    {authStorage.getAdmin()?.firstName
                                        ? `${authStorage.getAdmin()?.firstName} ${authStorage.getAdmin()?.lastName}`
                                        : (authStorage.isSuperAdmin() ? 'Super Admin' : 'Staff Officer')}
                                </p>
                                <p className="text-[10px] text-primary-main font-black uppercase tracking-wider truncate">
                                    {authStorage.isSuperAdmin() ? 'Super Administrator' : 'Staff Officer'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-2xl font-bold text-xs transition-all cursor-pointer border border-red-100 shadow-2xs group"
                        >
                            <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
                            <span>Logout</span>
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <DashboardOverview
                                key="overview"
                                stats={stats}
                                reports={reports}
                                setActiveTab={setActiveTab}
                                setFilterType={setFilterType}
                                setFilterPriority={setFilterPriority}
                                setFilterStatus={setFilterStatus}
                                setReportPage={setReportPage}
                                setProcessingReport={setProcessingReport}
                            />
                        )}
                        {activeTab === 'verifications' && (
                            <StudentVerification
                                key="verifications"
                                onCountsUpdate={(count) => setPendingVerifications(count)}
                            />
                        )}
                        {activeTab === 'cases' && <CaseManagement key="cases" />}
                        {activeTab === 'faculty' && <FacultyManagement key="faculty" />}
                        {activeTab === 'reports' && (
                            <StudentReports
                                key="reports-list"
                                reports={reports}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                filterType={filterType}
                                setFilterType={setFilterType}
                                filterPriority={filterPriority}
                                setFilterPriority={setFilterPriority}
                                filterStatus={filterStatus}
                                setFilterStatus={setFilterStatus}
                                reportPage={reportPage}
                                setReportPage={setReportPage}
                                setProcessingReport={setProcessingReport}
                            />
                        )}
                        {activeTab === 'appointments' && (
                            <CounselingAppointments
                                key="appointments"
                                appointments={appointments}
                                isAppointmentsLoading={isAppointmentsLoading}
                                setProcessingAppointment={setProcessingAppointment}
                            />
                        )}
                        {activeTab === 'pipeline' && <AssistancePipeline key="pipeline" />}
                        {activeTab === 'accounts' && (
                            authStorage.isSuperAdmin() ? (
                                <AccountDirectory key="accounts" />
                            ) : (
                                <DashboardOverview
                                    key="overview-fallback"
                                    stats={stats}
                                    reports={reports}
                                    setActiveTab={setActiveTab}
                                    setFilterType={setFilterType}
                                    setFilterPriority={setFilterPriority}
                                    setFilterStatus={setFilterStatus}
                                    setReportPage={setReportPage}
                                    setProcessingReport={setProcessingReport}
                                />
                            )
                        )}
                        {activeTab === 'settings' && (
                            authStorage.isSuperAdmin() ? (
                                <SystemSettings key="settings" />
                            ) : (
                                <DashboardOverview
                                    key="overview-fallback"
                                    stats={stats}
                                    reports={reports}
                                    setActiveTab={setActiveTab}
                                    setFilterType={setFilterType}
                                    setFilterPriority={setFilterPriority}
                                    setFilterStatus={setFilterStatus}
                                    setReportPage={setReportPage}
                                    setProcessingReport={setProcessingReport}
                                />
                            )
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {processingReport && (
                    <ReportProcessingModal
                        report={processingReport}
                        onClose={() => setProcessingReport(null)}
                        onUpdateStatus={handleUpdateReportStatus}
                    />
                )}
                {processingAppointment && (
                    <AppointmentProcessingModal
                        appointment={processingAppointment}
                        onClose={() => setProcessingAppointment(null)}
                        onUpdateStatus={handleUpdateAppointmentStatus}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
