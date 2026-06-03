import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';



// Components
import AdminSidebar from '../components/dashboard/admin/AdminSidebar';
import DashboardOverview from '../components/dashboard/admin/DashboardOverview';
import CaseManagement from '../components/dashboard/admin/CaseManagement';
import FacultyManagement from '../components/dashboard/admin/FacultyManagement';
import StudentReports from '../components/dashboard/admin/StudentReports';
import CounselingAppointments from '../components/dashboard/admin/CounselingAppointments';
import AssistancePipeline from '../components/dashboard/admin/AssistancePipeline';
import SystemSettings from '../components/dashboard/admin/SystemSettings';

// Modals
import ReportProcessingModal from '../components/dashboard/admin/modals/ReportProcessingModal';
import AppointmentProcessingModal from '../components/dashboard/admin/modals/AppointmentProcessingModal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Stats State
    const [stats, setStats] = useState<any>({
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
    const [reports, setReports] = useState<any[]>([]);
    const [, setIsReportsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [filterPriority, setFilterPriority] = useState('Any Priority');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [reportPage, setReportPage] = useState(1);
    const [processingReport, setProcessingReport] = useState<any>(null);

    // Appointments State
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(true);
    const [processingAppointment, setProcessingAppointment] = useState<any>(null);

    const fetchStats = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
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
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
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
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
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
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.patch(`/api/reports/${reportId}/status`, { status, adminNote }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setProcessingReport(null);
            fetchReports();
            fetchStats();
            toast.success("Report status successfully updated!");
        } catch (error: any) {
            console.error("Error updating report", error);
            toast.error(error.response?.data?.message || "Failed to update report status.");
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId: string, status: string, adminNotes: string) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.put(`/api/counseling/${appointmentId}/status`, { status, adminNotes }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setProcessingAppointment(null);
            fetchAppointments();
            fetchStats();
            toast.success(`Counseling appointment marked as ${status}.`);
        } catch (error: any) {
            console.error("Error updating appointment", error);
            toast.error(error.response?.data?.message || "Failed to update appointment.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        const adminPath = import.meta.env.VITE_ADMIN_SECURE_ROUTE || 'secure-admin-portal-xyz123';
        navigate(`/${adminPath}`, { replace: true });
    };

    useEffect(() => {
        const userInfoRaw = localStorage.getItem('userInfo');
        if (!userInfoRaw) {
            const adminPath = import.meta.env.VITE_ADMIN_SECURE_ROUTE || 'secure-admin-portal-xyz123';
            navigate(`/${adminPath}`, { replace: true });
            return;
        }

        const userInfo = JSON.parse(userInfoRaw);
        if (userInfo.role !== 'admin') {
            navigate('/', { replace: true });
            return;
        }

        fetchStats();
        fetchReports();
        fetchAppointments();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-bg-light flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
                {/* Background Decorators */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-main/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-main/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

                <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
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
                        {activeTab === 'settings' && <SystemSettings key="settings" />}
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
