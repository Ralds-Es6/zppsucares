import {
    Users, Activity, BrainCircuit, Accessibility,
    AlertCircle, LayoutDashboard, LogOut, Shield,
    Briefcase, ClipboardCheck, Calendar, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        physicallyDisabled: 0,
        mentalHealthConcerns: 0,
        otherConcerns: 0,
        healthy: 0,
        criticalReports: 0
    });

    const fetchStats = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const { data } = await axios.get('/api/stats/admin', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const [reports, setReports] = useState<any[]>([]);
    const [selectedViewReport, setSelectedViewReport] = useState<any>(null);
    const [reportPage, setReportPage] = useState(1);
    const reportsPerPage = 10;

    const fetchReports = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const { data } = await axios.get('/api/reports', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        const facultyPath = import.meta.env.VITE_FACULTY_SECURE_ROUTE || 'secure-faculty-access-abc789';
        navigate(`/${facultyPath}`, { replace: true });
    };

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            const facultyPath = import.meta.env.VITE_FACULTY_SECURE_ROUTE || 'secure-faculty-access-abc789';
            navigate(`/${facultyPath}`, { replace: true });
        } else {
            const parsed = JSON.parse(userInfo);
            if (parsed.role !== 'faculty') {
                navigate('/', { replace: true });
                return;
            }
            fetchStats();
            fetchReports();
        }
    }, [navigate]);

    // --- View Only Sub-components ---

    const CaseManagement = () => {
        const [cases, setCases] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(true);

        const fetchCases = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const { data } = await axios.get('/api/cases', {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setCases(data);
            } catch (error) {
                console.error("Error fetching cases", error);
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchCases();
        }, []);

        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Case Management (Read Only)</h1>
                        <p className="text-gray-500 font-medium text-lg mt-1">Reviewing student incidents and monitoring profiles.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold">Loading Case Files...</div>
                    ) : cases.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <Briefcase size={60} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-400 font-sans tracking-tight">No Active Cases Found</h3>
                        </div>
                    ) : cases.map((c: any) => (
                        <motion.div
                            key={c._id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/50 hover:border-primary-main/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${c.status === 'Open' ? 'bg-red-100 text-red-600' :
                                    c.status === 'Ongoing' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {c.status}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <Shield size={14} /> {c.category}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-4">
                                <span className="flex items-center gap-1"><Calendar size={12} /> Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-main transition-colors leading-tight mb-2 uppercase tracking-tight">{c.title}</h3>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-main font-bold text-xs uppercase">
                                    {c.student?.firstName[0]}{c.student?.lastName[0]}
                                </div>
                                <p className="text-gray-500 font-bold text-sm tracking-tight">{c.student?.firstName} {c.student?.lastName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                                    <Activity size={18} className="text-orange-500 mb-2" />
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Behavior</span>
                                    <span className="text-xs font-bold text-gray-700">{c.referralTracking?.behaviorStatus}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                                    <BrainCircuit size={18} className="text-blue-500 mb-2" />
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Mental Status</span>
                                    <span className="text-xs font-bold text-gray-700">{c.referralTracking?.latestStatusMental}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white border-2 border-gray-50 rounded-2xl font-black text-sm text-gray-700 hover:bg-primary-main hover:text-white hover:border-primary-main transition-all flex items-center justify-center gap-3 shadow-sm">
                                <ClipboardCheck size={20} /> View Details
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    const StudentReports = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Reports (Read Only)</h1>
                    <p className="text-gray-500 mt-1">Review documentation submitted by students.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {reports
                    .slice((reportPage - 1) * reportsPerPage, reportPage * reportsPerPage)
                    .map((report: any, i: number) => (
                        <motion.div
                            key={report._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedViewReport(report)}
                            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden cursor-pointer hover:shadow-2xl hover:border-primary-main/20 transition-all group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                        ${report.priority === 'Critical' ? 'bg-red-500 text-white' :
                                            report.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'}
                                    `}>
                                        {report.priority}
                                    </span>
                                    <div className="text-right text-xs text-gray-400 font-medium">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-main transition-colors">
                                    {report.student?.firstName} {report.student?.lastName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6 font-medium uppercase tracking-widest text-[10px]">ID: {report.student?.studentProfile?.studentId || 'N/A'} • {report.type}</p>

                                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">Reported Concern</p>
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed italic line-clamp-2">"{report.description}"</p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${report.status === 'Resolved' ? 'bg-green-500' :
                                            report.status === 'Pending' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <span className="text-sm font-bold text-gray-700">{report.status}</span>
                                    </div>
                                    <div className="text-primary-main text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Full Details <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>

            {/* Pagination Controls */}
            {reports.length > reportsPerPage && (
                <div className="flex items-center justify-between mt-4 px-4 pb-10">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Total Submissions: <span className="text-primary-main">{reports.length}</span> (Page {reportPage} of {Math.ceil(reports.length / reportsPerPage)})
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={reportPage === 1}
                            onClick={() => setReportPage(prev => prev - 1)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reportPage === 1 ? 'bg-gray-50 text-gray-300' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                        >
                            <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(reports.length / reportsPerPage) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setReportPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${reportPage === i + 1 ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={reportPage === Math.ceil(reports.length / reportsPerPage)}
                            onClick={() => setReportPage(prev => prev + 1)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reportPage === Math.ceil(reports.length / reportsPerPage) ? 'bg-gray-50 text-gray-300' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );

    const DashboardOverview = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">FACULTY OVERVIEW</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1">Institutional monitoring and student welfare summary.</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-light/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-primary-100 text-primary-main rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <Users size={28} />
                        </div>
                        <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-2">Total Students</h3>
                        <p className="text-4xl font-black text-gray-900">{stats.totalStudents}</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <Accessibility size={28} />
                        </div>
                        <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-2">PWD Monitored</h3>
                        <p className="text-4xl font-black text-gray-900">{stats.physicallyDisabled}</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <BrainCircuit size={28} />
                        </div>
                        <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-2">Mental Health Cases</h3>
                        <p className="text-4xl font-black text-gray-900">{stats.mentalHealthConcerns}</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-200/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <AlertCircle size={28} />
                        </div>
                        <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-2">Pending Reports</h3>
                        <p className="text-4xl font-black text-red-600">{stats.criticalReports}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="glass rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">RECENT STUDENT REPORTS</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/50 text-gray-500 text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="px-6 py-4 font-semibold">Student ID</th>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Concern Type</th>
                                <th className="px-6 py-4 font-semibold">Priority</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reports.slice(0, 5).map((report: any) => (
                                <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{report.student?.studentProfile?.studentId || 'N/A'}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                                        {report.student?.firstName} {report.student?.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{report.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold
                                            ${report.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                report.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                    report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }
                                        `}>
                                            {report.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-sm">
                                        {report.status}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-bg-light flex flex-col md:flex-row overflow-hidden font-sans">
            <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm hidden md:flex z-20 relative">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-main text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                            ZC
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 text-lg leading-tight">ZPPSU CARES</h2>
                            <p className="text-[10px] text-primary-main font-bold uppercase tracking-widest">Faculty Hub</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-primary-50 text-primary-main shadow-sm border border-primary-100/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('cases')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'cases' ? 'bg-primary-50 text-primary-main shadow-sm border border-primary-100/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Briefcase size={20} /> Case Files
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'reports' ? 'bg-primary-50 text-primary-main shadow-sm border border-primary-100/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Activity size={20} /> Student Reports
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                    >
                        <LogOut size={20} /> Secure Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-light/40 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
                <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && <DashboardOverview key="dashboard" />}
                        {activeTab === 'cases' && <CaseManagement key="cases" />}
                        {activeTab === 'reports' && <StudentReports key="reports" />}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modal for Report Details */}
            <AnimatePresence>
                {selectedViewReport && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[85vh] border border-white/20"
                        >
                            <div className="p-10 pb-6 border-b border-gray-100 relative">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-bl-[5rem] -z-0"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{selectedViewReport.type}</h2>
                                            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${selectedViewReport.priority === 'Critical' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                                {selectedViewReport.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                            <div className="w-8 h-8 rounded-full bg-primary-main text-white flex items-center justify-center text-xs">
                                                {selectedViewReport.student?.firstName[0]}{selectedViewReport.student?.lastName[0]}
                                            </div>
                                            <span>{selectedViewReport.student?.firstName} {selectedViewReport.student?.lastName}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="uppercase tracking-widest text-[10px]">ID: {selectedViewReport.student?.studentProfile?.studentId}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedViewReport(null)}
                                        className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                                    >
                                        <Activity size={24} className="rotate-45" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Submission Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${selectedViewReport.status === 'Resolved' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                            <p className="font-black text-gray-900 text-xl tracking-tight">{selectedViewReport.status}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reported On</p>
                                        <p className="font-black text-gray-900 text-xl tracking-tight">{new Date(selectedViewReport.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-primary-main uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <ClipboardCheck size={14} /> Full Incident Report Content
                                    </h4>
                                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-2 h-full bg-primary-main/10"></div>
                                        <p className="text-gray-800 font-bold text-xl leading-relaxed italic whitespace-pre-wrap">
                                            "{selectedViewReport.description}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                        <Shield size={14} /> Administrative Remarks
                                    </h4>
                                    {selectedViewReport.adminNote ? (
                                        <div className="bg-green-50/50 p-8 rounded-[2.5rem] border border-green-100 relative">
                                            <p className="text-green-900 font-black text-xl leading-tight">
                                                {selectedViewReport.adminNote}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center">
                                            <p className="text-gray-400 font-bold italic">No administrative remarks recorded for this report yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedViewReport(null)}
                                    className="px-10 py-4 bg-primary-main text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-main/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Done Reviewing
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FacultyDashboard;
