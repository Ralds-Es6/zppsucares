import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';

// Shared Components
import DashboardLayout from '../components/dashboard/shared/DashboardLayout';

// Student Components
import StudentSidebar from '../components/dashboard/student/StudentSidebar';
import StudentHeader from '../components/dashboard/student/StudentHeader';

// Student Tab Components
import OverviewTab from '../components/dashboard/student/OverviewTab';
import ProfileTab from '../components/dashboard/student/ProfileTab';
import ReportsTab from '../components/dashboard/student/ReportsTab';
import AppointmentsTab from '../components/dashboard/student/AppointmentsTab';
import GrantsTab from '../components/dashboard/student/GrantsTab';
import SettingsTab from '../components/dashboard/student/SettingsTab';

// Modal Components
import SupportReportModal from '../components/dashboard/student/modals/SupportReportModal';
import ViewReportModal from '../components/dashboard/student/modals/ViewReportModal';
import CounselingModal from '../components/dashboard/student/modals/CounselingModal';
import AssistanceJourneyModal from '../components/dashboard/student/modals/AssistanceJourneyModal';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [cases, setCases] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [isCasesLoading, setIsCasesLoading] = useState(true);
    const [isReportsLoading, setIsReportsLoading] = useState(true);

    const [notifications, setNotifications] = useState<any[]>([]);
    const [prevUnreadCount, setPrevUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [viewingNotification, setViewingNotification] = useState<any>(null);

    // Counseling States
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(true);
    const [showCounselingModal, setShowCounselingModal] = useState(false);
    const [counselingDate, setCounselingDate] = useState('');
    const [counselingTime, setCounselingTime] = useState('');
    const [counselingReason, setCounselingReason] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedViewReport, setSelectedViewReport] = useState<any>(null);
    const [reportPage, setReportPage] = useState(1);
    const reportsPerPage = 10;
    const [newReport, setNewReport] = useState({
        type: 'General Guidance',
        description: '',
        priority: 'Medium'
    });

    const [assistanceRequest, setAssistanceRequest] = useState<any>(null);
    const [showAssistanceModal, setShowAssistanceModal] = useState(false);
    const [assistanceStep, setAssistanceStep] = useState(1);
    const [assistanceData, setAssistanceData] = useState<any>({
        householdIncome: '',
        parentOccupation: '',
        numberOfDependents: '',
        gpa: '',
        // Step 2 fields
        documentType: '',
        documentReference: '',
        additionalDocs: '',
        // Step 3 fields
        availableDate: '',
        contactNumber: '',
        additionalNotes: ''
    });

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/', { replace: true });
    };

    const fetchUserCases = async (token: string) => {
        try {
            const { data } = await axios.get('/api/cases', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(data)) {
                setCases(data);
            }
        } catch (error) {
            console.error("Error fetching user cases", error);
        } finally {
            setIsCasesLoading(false);
        }
    };

    const fetchUserReports = async (token: string) => {
        try {
            const { data } = await axios.get('/api/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(data)) {
                setReports(data);
            }
        } catch (error) {
            console.error("Error fetching user reports", error);
        } finally {
            setIsReportsLoading(false);
        }
    };

    const fetchNotifications = async (token: string) => {
        try {
            const { data } = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const fetchAppointments = async (token: string) => {
        try {
            const { data } = await axios.get('/api/counseling/my-appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching appointments", error);
        } finally {
            setIsAppointmentsLoading(false);
        }
    };

    const fetchAssistanceRequest = async (token: string) => {
        try {
            const { data } = await axios.get('/api/assistance/my-request', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssistanceRequest(data);
        } catch (error) {
            console.error("Error fetching assistance request", error);
        }
    };

    const handleAssistanceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const stepData: Record<string, any> = {};

            if (assistanceStep === 1) {
                stepData.householdIncome = assistanceData.householdIncome;
                stepData.parentOccupation = assistanceData.parentOccupation;
                stepData.numberOfDependents = assistanceData.numberOfDependents;
                stepData.gpa = assistanceData.gpa;
            } else if (assistanceStep === 2) {
                stepData.documentType = assistanceData.documentType;
                stepData.documentReference = assistanceData.documentReference;
                stepData.additionalDocs = assistanceData.additionalDocs;
            } else if (assistanceStep === 3) {
                stepData.availableDate = assistanceData.availableDate;
                stepData.contactNumber = assistanceData.contactNumber;
                stepData.additionalNotes = assistanceData.additionalNotes;
            }

            await axios.put('/api/assistance/update-step', {
                step: assistanceStep,
                data: stepData
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            toast.success(`Step ${assistanceStep} submitted for review!`);
            fetchAssistanceRequest(userInfo.token);
            setShowAssistanceModal(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error submitting data");
        }
    };

    const startAssistanceJourney = async (type: string) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.post('/api/assistance/request', { type }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            fetchAssistanceRequest(userInfo.token);
            setAssistanceStep(1);
            setShowAssistanceModal(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error starting journey");
        }
    };

    const markNotificationAsRead = async (id: string) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/', { replace: true });
            return;
        } else {
            const parsedUser = JSON.parse(userInfo);
            if (parsedUser.role !== 'student') {
                navigate('/', { replace: true });
                return;
            }
            setUser(parsedUser);
            fetchUserCases(parsedUser.token);
            fetchUserReports(parsedUser.token);
            fetchNotifications(parsedUser.token);
            fetchAppointments(parsedUser.token);
            fetchAssistanceRequest(parsedUser.token);

            // Set up polling for new notifications every 30 seconds
            const interval = setInterval(() => fetchNotifications(parsedUser.token), 30000);
            return () => clearInterval(interval);
        }
    }, [navigate]);

    useEffect(() => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        if (unreadCount > prevUnreadCount) {
            const latest = notifications.filter(n => !n.isRead)[0];
            if (latest) {
                toast.info(`🔔 ${latest.title}: ${latest.message.substring(0, 60)}${latest.message.length > 60 ? '...' : ''}`, {
                    position: "top-right",
                    autoClose: 5000
                });
            }
        }
        setPrevUnreadCount(unreadCount);
    }, [notifications, prevUnreadCount]);

    if (!user) return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center font-sans">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">Initializing Portal...</p>
            </div>
        </div>
    );

    const latestCase = cases.length > 0 ? [...cases].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;

    const studentData = {
        studentId: user.studentProfile?.studentId || "N/A",
        course: user.studentProfile?.course || "N/A",
        yearLevel: user.studentProfile?.yearLevel || 0,
        section: user.studentProfile?.section || "N/A",
        assignedCounselor: "Dr. Elena Santos", // Hardcoded for now
        status: reports.some(r => r.priority === 'Critical') ? "Urgent Attention" : "Healthy",
        concernsRaised: reports.filter(r => r.status !== 'Resolved').length,
        appointments: appointments,
        recentReports: reports.slice(0, 3),
        physicalStatus: latestCase?.referralTracking?.latestStatusPhysical || "None Registered",
        mentalStatus: latestCase?.referralTracking?.latestStatusMental || "Good Standing",
        behaviorStatus: latestCase?.referralTracking?.behaviorStatus || "Normal"
    };

    const getMinSelectableDate = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeDecimal = currentHour + (currentMinute / 60);

        if (currentTimeDecimal >= 16.5) {
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            return tomorrow;
        }

        if (now.getDay() === 0) { // Sunday
            const monday = new Date();
            monday.setDate(now.getDate() + 1);
            return monday;
        }
        if (now.getDay() === 6) { // Saturday
            const monday = new Date();
            monday.setDate(now.getDate() + 2);
            return monday;
        }

        return now;
    };

    const handleCreateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.post('/api/reports', newReport, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setShowReportModal(false);
            setNewReport({ type: 'General Guidance', description: '', priority: 'Medium' });
            fetchUserReports(userInfo.token);
            toast.success("Support report submitted successfully.");
        } catch (error: any) {
            console.error("Error creating report", error);
            toast.error(error.response?.data?.message || 'Error creating report');
        }
    };

    const handleSelectDate = (dateObj: Date) => {
        const offset = dateObj.getTimezoneOffset()
        const selectedDate = new Date(dateObj.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]

        setCounselingDate(selectedDate);
        setCounselingTime('');
        setIsSlotsLoading(true);

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        axios.get(`/api/counseling/available-slots?date=${selectedDate}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        }).then(res => {
            if (res.data.success) {
                setAvailableSlots(res.data.availableSlots);
            }
        }).catch(err => {
            console.error("Error fetching slots", err);
            setAvailableSlots([]);
        }).finally(() => {
            setIsSlotsLoading(false);
        });
    };

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.post('/api/counseling/request', {
                date: counselingDate,
                timeSlot: counselingTime,
                reason: counselingReason
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setShowCounselingModal(false);
            setCounselingDate('');
            setCounselingTime('');
            setCounselingReason('');
            setAvailableSlots([]);
            fetchAppointments(userInfo.token);
            toast.success('Counseling appointment requested securely.');
        } catch (error: any) {
            console.error("Error creating appointment", error);
            toast.error(error.response?.data?.message || 'Error requesting appointment');
        }
    };

    return (
        <DashboardLayout>
            <StudentSidebar
                user={user}
                studentData={studentData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />
            <main className="flex-1 h-screen overflow-y-auto relative p-6 md:p-12 custom-scrollbar">
                <StudentHeader
                    user={user}
                    notifications={notifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                    markNotificationAsRead={markNotificationAsRead}
                    viewingNotification={viewingNotification}
                    setViewingNotification={setViewingNotification}
                    setActiveTab={setActiveTab}
                />

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            key="overview"
                            studentData={studentData}
                            appointments={appointments}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'profile' && (
                        <ProfileTab
                            key="profile"
                            user={user}
                            studentData={studentData}
                            latestCase={latestCase}
                        />
                    )}
                    {activeTab === 'reports' && (
                        <ReportsTab
                            key="reports"
                            setShowReportModal={setShowReportModal}
                            isReportsLoading={isReportsLoading}
                            reports={reports}
                            reportPage={reportPage}
                            reportsPerPage={reportsPerPage}
                            setReportPage={setReportPage}
                            setSelectedViewReport={setSelectedViewReport}
                            isCasesLoading={isCasesLoading}
                            cases={cases}
                        />
                    )}
                    {activeTab === 'appointments' && (
                        <AppointmentsTab
                            key="appointments"
                            isAppointmentsLoading={isAppointmentsLoading}
                            appointments={appointments}
                            setShowCounselingModal={setShowCounselingModal}
                        />
                    )}
                    {activeTab === 'grants' && (
                        <GrantsTab
                            key="grants"
                            assistanceRequest={assistanceRequest}
                            setShowAssistanceModal={setShowAssistanceModal}
                            setAssistanceStep={setAssistanceStep}
                        />
                    )}
                    {activeTab === 'settings' && <SettingsTab key="settings" />}
                </AnimatePresence>

                {/* Modals */}
                <SupportReportModal
                    showReportModal={showReportModal}
                    setShowReportModal={setShowReportModal}
                    newReport={newReport}
                    setNewReport={setNewReport}
                    handleCreateReport={handleCreateReport}
                />

                <ViewReportModal
                    selectedViewReport={selectedViewReport}
                    setSelectedViewReport={setSelectedViewReport}
                />

                <CounselingModal
                    showCounselingModal={showCounselingModal}
                    setShowCounselingModal={setShowCounselingModal}
                    handleCreateAppointment={handleCreateAppointment}
                    getMinSelectableDate={getMinSelectableDate}
                    handleSelectDate={handleSelectDate}
                    counselingDate={counselingDate}
                    counselingTime={counselingTime}
                    setCounselingTime={setCounselingTime}
                    isSlotsLoading={isSlotsLoading}
                    availableSlots={availableSlots}
                    counselingReason={counselingReason}
                    setCounselingReason={setCounselingReason}
                />

                <AssistanceJourneyModal
                    showAssistanceModal={showAssistanceModal}
                    setShowAssistanceModal={setShowAssistanceModal}
                    assistanceRequest={assistanceRequest}
                    assistanceStep={assistanceStep}
                    assistanceData={assistanceData}
                    setAssistanceData={setAssistanceData}
                    startAssistanceJourney={startAssistanceJourney}
                    handleAssistanceSubmit={handleAssistanceSubmit}
                />
            </main>
        </DashboardLayout>
    );
};

export default StudentDashboard;