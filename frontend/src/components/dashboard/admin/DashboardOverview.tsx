import React from 'react';
import { motion } from 'framer-motion';
import { Users, HeartPulse, AlertCircle, CheckCircle2, ClipboardCheck, ChevronRight, Activity, ShieldAlert } from 'lucide-react';
import AnalyticsCharts from '../shared/AnalyticsCharts';
import { authStorage } from '../../../utils/authStorage';

export interface CriticalReport {
    _id: string;
    student?: {
        firstName?: string;
        lastName?: string;
        studentProfile?: {
            studentId?: string;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
    description?: string;
    type?: string;
    priority?: string;
    status?: string;
    createdAt: string;
    [key: string]: unknown;
}

export interface DashboardStats {
    totalStudents?: number;
    totalFaculty?: number;
    criticalReportsCount?: number;
    pendingReportsCount?: number;
    criticalReportsList?: CriticalReport[];
    physicallyDisabled?: number;
    mentalHealthConcerns?: number;
    otherConcerns?: number;
    healthy?: number;
    [key: string]: unknown;
}

interface DashboardOverviewProps {
    stats: DashboardStats;
    reports: CriticalReport[];
    setActiveTab: (tab: string) => void;
    setFilterType: (type: string) => void;
    setFilterPriority: (priority: string) => void;
    setFilterStatus: (status: string) => void;
    setReportPage: (page: number) => void;
    setProcessingReport: (report: CriticalReport) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    stats,
    reports,
    setActiveTab,
    setFilterType,
    setFilterPriority,
    setFilterStatus,
    setReportPage,
    setProcessingReport
}) => {
    const adminInfo = authStorage.getAdmin();
    const activeConcerns = (stats.physicallyDisabled || 0) + (stats.mentalHealthConcerns || 0) + (stats.otherConcerns || 0);
    const totalStudents = stats.totalStudents || 0;
    const healthyCount = Math.max(0, stats.healthy || 0);
    const healthyRate = totalStudents > 0 ? ((healthyCount / totalStudents) * 100).toFixed(1) : '100.0';
    const criticalCount = stats.criticalReportsCount || 0;

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Welfare & Support Overview</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base mt-1 italic">
                        Real-time GCTSO monitoring of student well-being, welfare cases, and support requests.
                    </p>
                </div>
            </div>

            {/* Compact Critical Alert Strip (Only shown when urgent cases exist) */}
            {criticalCount > 0 && (
                <div className="glass-slab-crimson rounded-2xl px-5 py-3.5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center animate-pulse shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <p className="text-xs sm:text-sm font-black uppercase tracking-wide">
                            {criticalCount} Urgent Critical {criticalCount === 1 ? 'Case' : 'Cases'} Requiring Immediate Triage
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveTab('reports');
                            setFilterType('All Types');
                            setFilterPriority('Critical');
                            setReportPage(1);
                        }}
                        className="bg-white text-red-600 px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider shadow-sm hover:scale-[1.02] transition-all self-start sm:self-auto shrink-0"
                    >
                        Review Urgent Queue
                    </button>
                </div>
            )}

            {/* TIER 1 (TOP): Visual Analytics (react-chartjs-2 Bar & Pie/Doughnut Charts) */}
            <AnalyticsCharts stats={stats} token={adminInfo?.token} />

            {/* TIER 2: Key Population & Well-being KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-slab-interactive p-5 sm:p-6 rounded-3xl sm:rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100/80 text-blue-600 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm shrink-0">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-widest mb-0.5">Enrolled Students</h3>
                            <p className="text-3xl font-black text-gray-900 tracking-tight">{totalStudents}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-slab-interactive p-5 sm:p-6 rounded-3xl sm:rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100/80 text-purple-600 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm shrink-0">
                            <HeartPulse size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-widest mb-0.5">Guidance & Faculty</h3>
                            <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalFaculty || 0}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-slab-interactive p-5 sm:p-6 rounded-3xl sm:rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100/80 text-amber-600 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm shrink-0">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-widest mb-0.5">Active Welfare Cases</h3>
                            <p className="text-3xl font-black text-gray-900 tracking-tight">{activeConcerns}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-slab-interactive p-5 sm:p-6 rounded-3xl sm:rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100/80 text-emerald-600 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm shrink-0">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-widest mb-0.5">Cleared Students</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{healthyCount}</p>
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{healthyRate}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* TIER 3: Emergency Radar & Standard Support Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-slab-crimson p-6 sm:p-8 rounded-3xl sm:rounded-4xl relative overflow-hidden text-white lg:col-span-2 flex flex-col"
                >
                    <div className="absolute inset-0 opacity-10 background-pattern"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl flex items-center justify-center animate-pulse shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-red-100 font-black uppercase tracking-widest text-[10px]">
                                        Emergency Support Queue
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-black">{criticalCount} URGENT {criticalCount === 1 ? 'REPORT' : 'REPORTS'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveTab('reports');
                                    setFilterType('All Types');
                                    setFilterPriority('Critical');
                                    setReportPage(1);
                                }}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-xs transition-all border border-white/10 self-start sm:self-auto"
                            >
                                Open Emergency Reports
                            </button>
                        </div>

                        {/* Express Triage List */}
                        <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 mb-2">
                            {stats.criticalReportsList && stats.criticalReportsList.length > 0 ? (
                                stats.criticalReportsList.map((report) => (
                                    <div key={report._id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 group hover:bg-white/20 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-xs shadow-lg shrink-0">
                                                {report.student?.firstName?.[0]}{report.student?.lastName?.[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm leading-tight truncate">{report.student?.firstName} {report.student?.lastName}</p>
                                                <p className="text-[10px] text-red-100/70 font-medium truncate italic mt-0.5">"{report.description}"</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setProcessingReport(report)}
                                            className="bg-white text-red-600 px-3 py-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 font-black text-[10px] uppercase shrink-0"
                                        >
                                            <Activity size={15} /> Process
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center bg-white/5 rounded-3xl border border-white/5">
                                    <CheckCircle2 size={36} className="mx-auto text-red-200/40 mb-2" />
                                    <p className="text-red-100/70 font-bold text-sm tracking-tight">No Active Emergencies</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Standard Support Processing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass-slab p-6 sm:p-8 rounded-3xl sm:rounded-4xl relative overflow-hidden group flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/10">
                            <ClipboardCheck size={28} />
                        </div>
                        <h3 className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-1">
                            Pending Support Requests
                        </h3>
                        <p className="text-4xl font-black text-gray-900 mb-2">{stats.pendingReportsCount || 0}</p>
                        <p className="text-xs text-gray-500 font-bold leading-tight italic">Guidance & accessibility requests awaiting review.</p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveTab('reports');
                            setFilterStatus('Pending');
                            setFilterPriority('Non-Critical Support');
                            setFilterType('All Types');
                            setReportPage(1);
                        }}
                        className="mt-8 w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-main hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        Review Support Requests
                    </button>
                </motion.div>
            </div>

            {/* TIER 4 (BOTTOM): Detailed Recent Support Logs */}
            <div className="glass rounded-3xl sm:rounded-4xl border border-white/20 p-1 mb-10 overflow-hidden">
                <div className="p-5 sm:p-8 border-b border-gray-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/30">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">Recent Student Support Reports</h2>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium italic">Latest mental health, physical accessibility, and guidance submissions.</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className="text-primary-main font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
                    >
                        View All Reports <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="bg-white/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-4 sm:px-8 py-4 sm:py-5 font-black">Student ID</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-5 font-black">Name</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-5 font-black">Concern Type</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-5 font-black">Priority</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-5 font-black">Status</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-5 font-black">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reports.slice(0, 5).map((report) => (
                                <tr
                                    key={report._id}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    onClick={() => setProcessingReport(report)}
                                >
                                    <td className="px-4 sm:px-8 py-4 sm:py-5 font-bold text-gray-400 text-xs tracking-widest whitespace-nowrap">{report.student?.studentProfile?.studentId || 'N/A'}</td>
                                    <td className="px-4 sm:px-8 py-4 sm:py-5 font-black text-gray-900 text-sm">
                                        {report.student?.firstName} {report.student?.lastName}
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 sm:py-5 text-gray-600 text-xs font-bold">{report.type}</td>
                                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                                        <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm
                                            ${report.priority === 'Critical' ? 'bg-red-500 text-white' :
                                                report.priority === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                    report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        'bg-blue-100 text-blue-700 border border-blue-200'
                                            }
                                        `}>
                                            {report.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                                        <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
                                            ${report.status === 'Resolved' ? 'text-green-600' : 'text-gray-600'}
                                        `}>
                                            {report.status === 'Pending' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                            {report.status === 'Reviewed' && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
                                            {report.status === 'Resolved' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 sm:py-5 text-gray-400 text-[10px] font-black tracking-widest uppercase">{new Date(report.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardOverview;
