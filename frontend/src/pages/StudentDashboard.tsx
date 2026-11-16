import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { AlertCircle, AlertTriangle, BellRing, Info, X } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import { authStorage } from '../utils/authStorage';

// Shared Components
import DashboardLayout from '../components/dashboard/shared/DashboardLayout';

// Student Components
import StudentSidebar from '../components/dashboard/student/StudentSidebar';
import StudentHeader, { type NotificationItem } from '../components/dashboard/student/StudentHeader';

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
import StudentVerificationHub from '../components/dashboard/student/StudentVerificationHub';

interface StudentUser {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    studentProfile?: {
        _id?: string;
        studentId?: string;
        department?: string;
        course?: string;
        yearLevel?: number | string;
        section?: string;
        verificationStatus?: 'pending' | 'approved' | 'declined';
        documents?: {
            corUrl?: string;
            idCardUrl?: string;
            submittedAt?: string;
        };
        verificationDetails?: {
            reviewedAt?: string;
            declineReason?: string;
        };
        isResubmitted?: boolean;
    };
    token?: string;
}

export interface CaseItem {
    _id: string;
    createdAt: string;
    title?: string;
    category?: string;
    status?: string;
    updatedAt?: string;
    admin?: {
        firstName?: string;
        lastName?: string;
        [key: string]: unknown;
    };
    referralTracking?: {
        latestStatusPhysical?: string;
        latestStatusMental?: string;
        behaviorStatus?: string;
    };
    [key: string]: unknown;
}

export interface ReportItem {
    _id?: string;
    type?: string;
    description?: string;
    priority?: string;
    status?: string;
    createdAt?: string;
    adminNote?: string;
    remarks?: string;
    [key: string]: unknown;
}

interface AppointmentItem {
    _id: string;
    status: string;
    date: string | Date;
    timeSlot: string;
    [key: string]: unknown;
}

interface AssistanceRequestItem {
    _id?: string;
    status?: string;
    type?: string;
    [key: string]: unknown;
}

interface AssistanceData {
    type?: string;
    householdIncome: string;
    parentOccupation: string;
    numberOfDependents: string;
    gpa: string;
    documentType: string;
    documentReference: string;
    additionalDocs: string;
    availableDate?: string;
    contactNumber?: string;
    additionalNotes?: string;
    [key: string]: unknown;
}

interface AnnouncementBannerState {
    isActive: boolean;
    message: string;
    type: 'info' | 'warning' | 'alert';
}

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<StudentUser | null>(null);
    const [announcementBanner, setAnnouncementBanner] = useState<AnnouncementBannerState | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [cases, setCases] = useState<CaseItem[]>([]);
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [isCasesLoading, setIsCasesLoading] = useState(true);
    const [isReportsLoading, setIsReportsLoading] = useState(true);

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const hasInitializedNotificationsRef = useRef(false);
    const prevUnreadCountRef = useRef(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [viewingNotification, setViewingNotification] = useState<NotificationItem | null>(null);
    const [dismissedUnreadBanner, setDismissedUnreadBanner] = useState(false);

    // Counseling States
    const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(true);
    const [showCounselingModal, setShowCounselingModal] = useState(false);
    const [counselingDate, setCounselingDate] = useState('');
    const [counselingTime, setCounselingTime] = useState('');
    const [counselingReason, setCounselingReason] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedViewReport, setSelectedViewReport] = useState<ReportItem | null>(null);
    const [reportPage, setReportPage] = useState(1);
    const reportsPerPage = 10;
    const [newReport, setNewReport] = useState({
        type: 'General Guidance',
        description: '',
        priority: 'Medium'
    });

    const [assistanceRequest, setAssistanceRequest] = useState<AssistanceRequestItem | null>(null);
    const [showAssistanceModal, setShowAssistanceModal] = useState(false);
    const [assistanceStep, setAssistanceStep] = useState(1);
    const [assistanceData, setAssistanceData] = useState<AssistanceData>({
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
        authStorage.removeStudent();
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
            const list: NotificationItem[] = Array.isArray(data) ? data : [];
            const unread = list.filter(n => !n.isRead);

            if (hasInitializedNotificationsRef.current && unread.length > prevUnreadCountRef.current) {
                const latest = unread[0];
                if (latest) {
                    setDismissedUnreadBanner(false);
                    toast.info(latest.title, {
                        id: 'student-new-notification',
                        description: `${latest.message.substring(0, 80)}${latest.message.length > 80 ? '...' : ''}`,
                        duration: 5000,
                        action: {
                            label: 'View',
                            onClick: () => setViewingNotification(latest),
                        },
                    });
                }
            }

            hasInitializedNotificationsRef.current = true;
            prevUnreadCountRef.current = unread.length;
            setNotifications(list);
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
        
        // If not on the final step, just advance to the next step
        if (assistanceStep < 3) {
            setAssistanceStep(prev => prev + 1);
            return;
        }

        try {
            const userInfo = authStorage.getStudent() || {};
            await axios.post('/api/assistance/apply', {
                type: assistanceData.type,
                householdIncome: assistanceData.householdIncome,
                parentOccupation: assistanceData.parentOccupation,
                numberOfDependents: Number(assistanceData.numberOfDependents),
                gpa: assistanceData.gpa,
                documentType: assistanceData.documentType,
                documentReference: assistanceData.documentReference,
                additionalDocs: assistanceData.additionalDocs,
                availableDate: assistanceData.availableDate,
                contactNumber: assistanceData.contactNumber,
                additionalNotes: assistanceData.additionalNotes
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            toast.success("Application submitted successfully for administrative review!");
            fetchAssistanceRequest(userInfo.token || '');
            setShowAssistanceModal(false);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Error submitting application");
        }
    };

    const startAssistanceJourney = (type: string) => {
        setAssistanceData({
            type,
            householdIncome: '',
            parentOccupation: '',
            numberOfDependents: '',
            gpa: '',
            documentType: '',
            documentReference: '',
            additionalDocs: '',
            availableDate: '',
            contactNumber: '',
            additionalNotes: ''
        });
        setAssistanceStep(1);
        setShowAssistanceModal(true);
    };

    const markNotificationAsRead = async (id: string) => {
        try {
            const userInfo = authStorage.getStudent() || {};
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    useEffect(() => {
        const parsedUser = authStorage.getStudent();
        if (!parsedUser || parsedUser.role !== 'student') {
            navigate('/', { replace: true });
            return;
        } else {
            setUser(parsedUser as StudentUser);
            fetchUserCases(parsedUser.token as string);
            fetchUserReports(parsedUser.token as string);
            fetchNotifications(parsedUser.token as string);
            fetchAppointments(parsedUser.token as string);
            fetchAssistanceRequest(parsedUser.token as string);

            // Fetch public announcement banner
            axios.get('/api/settings/public')
                .then(({ data }) => {
                    if (data?.announcementBanner) {
                        setAnnouncementBanner(data.announcementBanner);
                    }
                })
                .catch(() => {});

            // Set up polling for new notifications every 30 seconds
            const interval = setInterval(() => fetchNotifications(parsedUser.token as string), 30000);
            return () => clearInterval(interval);
        }
    }, [navigate]);

    if (!user) return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center font-sans">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">Initializing Portal...</p>
            </div>
        </div>
    );

    const latestCase = cases.length > 0 ? [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;

    const studentData = {
        studentId: user.studentProfile?.studentId || "N/A",
        department: user.studentProfile?.department || "N/A",
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
            const userInfo = authStorage.getStudent() || {};
            await axios.post('/api/reports', newReport, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setShowReportModal(false);
            setNewReport({ type: 'General Guidance', description: '', priority: 'Medium' });
            fetchUserReports(userInfo.token || '');
            toast.success("Support report submitted successfully.");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error("Error creating report", error);
            toast.error(err.response?.data?.message || 'Error creating report');
        }
    };

    const handleSelectDate = (dateObj: Date) => {
        const offset = dateObj.getTimezoneOffset()
        const selectedDate = new Date(dateObj.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]

        setCounselingDate(selectedDate);
        setCounselingTime('');
        setIsSlotsLoading(true);

        const userInfo = authStorage.getStudent() || {};
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
            const userInfo = authStorage.getStudent() || {};
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
            fetchAppointments(userInfo.token || '');
            toast.success('Counseling appointment requested securely.');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error("Error creating appointment", error);
            toast.error(err.response?.data?.message || 'Error requesting appointment');
        }
    };

    const verificationStatus = user?.studentProfile?.verificationStatus;

    if (user && (verificationStatus === 'pending' || verificationStatus === 'declined')) {
        return (
            <StudentVerificationHub
                user={user}
                onUserUpdate={(updated) => setUser(prev => prev ? ({ ...prev, ...updated, role: prev.role } as StudentUser) : null)}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DashboardLayout>
            <StudentSidebar
                user={user}
                studentData={studentData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />
            <main className="flex-1 min-h-screen md:h-screen overflow-y-auto relative p-4 sm:p-6 md:p-10 lg:p-12 custom-scrollbar">
                <StudentHeader
                    user={user}
                    notifications={notifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                    markNotificationAsRead={markNotificationAsRead}
                    viewingNotification={viewingNotification}
                    setViewingNotification={setViewingNotification}
                />

                {/* University Announcement Banner */}
                {announcementBanner?.isActive && announcementBanner?.message && (
                    <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 mb-6 shadow-sm ${
                        announcementBanner.type === 'alert'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : announcementBanner.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                        <div className="flex items-center gap-3.5">
                            {announcementBanner.type === 'alert' && <AlertCircle size={22} className="text-rose-600 shrink-0" />}
                            {announcementBanner.type === 'warning' && <AlertTriangle size={22} className="text-amber-600 shrink-0" />}
                            {announcementBanner.type === 'info' && <Info size={22} className="text-blue-600 shrink-0" />}
                            <span className="text-xs sm:text-sm font-bold leading-relaxed">{announcementBanner.message}</span>
                        </div>
                    </div>
                )}

                {/* Unread Updates Notification Banner (Persistent until viewed or dismissed) */}
                {(() => {
                    const unreadList = notifications.filter(n => !n.isRead);
                    if (unreadList.length === 0 || dismissedUnreadBanner) return null;
                    const latestUnread = unreadList[0];
                    return (
                        <div className="p-4 sm:p-5 rounded-2xl border border-sky-200 bg-sky-50/90 text-sky-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xs">
                            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                                    <BellRing size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-extrabold text-sky-950">
                                        {unreadList.length === 1
                                            ? latestUnread.title
                                            : `${unreadList.length} Unread Notifications — Latest: ${latestUnread.title}`}
                                    </p>
                                    <p className="text-xs text-sky-800/90 font-medium truncate sm:whitespace-normal">
                                        {latestUnread.message}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                    onClick={() => {
                                        setViewingNotification(latestUnread);
                                        markNotificationAsRead(latestUnread._id);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                                >
                                    View Update
                                </button>
                                <button
                                    onClick={() => setDismissedUnreadBanner(true)}
                                    className="p-2 rounded-xl text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer"
                                    aria-label="Dismiss notification banner"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })()}

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
                            startAssistanceJourney={startAssistanceJourney}
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
                    assistanceData={assistanceData}
                    setAssistanceData={setAssistanceData}
                    handleAssistanceSubmit={handleAssistanceSubmit}
                />
            </main>
        </DashboardLayout>
    );
};

export default StudentDashboard;