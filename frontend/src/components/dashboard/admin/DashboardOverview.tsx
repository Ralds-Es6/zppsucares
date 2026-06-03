import React from 'react';
import { motion } from 'framer-motion';
import { Users, HeartPulse, AlertCircle, CheckCircle2, ClipboardCheck, ChevronRight, Activity } from 'lucide-react';

interface DashboardOverviewProps {
    stats: any;
    reports: any[];
    setActiveTab: (tab: string) => void;
    setFilterType: (type: string) => void;
    setFilterPriority: (priority: string) => void;
    setFilterStatus: (status: string) => void;
    setReportPage: (page: number) => void;
    setProcessingReport: (report: any) => void;
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
    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">System Overview</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">Real-time monitoring of ZPPSU student and faculty well-being.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-main font-black">
                        SA
                    </div>
                    <div className="text-sm">
                        <p className="font-black text-gray-900 leading-tight">Super Admin</p>
                        <p className="text-gray-500 text-xs font-bold">admin@zppsu.edu.ph</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-[2rem] border border-white/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-100/80 text-blue-600 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Users size={24} />
                        </div>
                        <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Total Enrolled</h3>
                        <p className="text-4xl font-black text-gray-900">{stats.totalStudents}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-[2rem] border border-white/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-purple-100/80 text-purple-600 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <HeartPulse size={24} />
                        </div>
                        <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Active Faculty</h3>
                        <p className="text-4xl font-black text-gray-900">{stats.totalFaculty}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-[2.5rem] shadow-2xl shadow-red-500/30 relative overflow-hidden text-white lg:col-span-2 flex flex-col">
                    <div className="absolute inset-0 opacity-10 background-pattern"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl flex items-center justify-center animate-pulse">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-red-100 font-black uppercase tracking-widest text-[10px]">Critical Emergency Radar</h3>
                                    <p className="text-2xl font-black">{stats.criticalReportsCount || 0} URGENT CASES</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveTab('reports');
                                    setFilterType('All Types');
                                    setFilterPriority('Critical');
                                    setReportPage(1);
                                }}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-xs transition-all border border-white/10"
                            >
                                View Global Queue
                            </button>
                        </div>

                        {/* Express Triage List */}
                        <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2 mb-2">
                            {stats.criticalReportsList?.length > 0 ? (
                                stats.criticalReportsList.map((report: any) => (
                                    <div key={report._id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-xs shadow-lg">
                                                {report.student?.firstName?.[0]}{report.student?.lastName?.[0]}
                                            </div>
                                            <div className="max-w-[180px] md:max-w-none">
                                                <p className="font-bold text-sm leading-tight">{report.student?.firstName} {report.student?.lastName}</p>
                                                <p className="text-[10px] text-red-100/70 font-medium truncate italic mt-0.5">"{report.description}"</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setProcessingReport(report)}
                                            className="bg-white text-red-600 p-2 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center gap-2 font-black text-[10px] uppercase"
                                        >
                                            <Activity size={16} /> Process
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center bg-white/5 rounded-3xl border border-white/5">
                                    <CheckCircle2 size={40} className="mx-auto text-red-200/30 mb-2" />
                                    <p className="text-red-100/50 font-bold text-sm tracking-tight">No Active Emergencies</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Standard Support Processing */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-8 rounded-[2.5rem] border border-white/20 relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/10">
                            <ClipboardCheck size={28} />
                        </div>
                        <h3 className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-1">Standard Support</h3>
                        <p className="text-4xl font-black text-gray-900 mb-2">{stats.pendingReportsCount || 0}</p>
                        <p className="text-xs text-gray-500 font-bold leading-tight italic">Support requests awaiting review.</p>
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
                        Review All Logs
                    </button>
                </motion.div>
            </div>

            {/* Radar Charts/Stats Summary */}
            <div className="glass rounded-[2rem] border border-white/20 p-1">
                <div className="p-6 md:p-8 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                            <Activity className="text-primary-main" size={24} /> Student Vulnerability Radar
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium italic">Classification based on registered concerns and current status.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100/50">
                    <div className="p-8 hover:bg-gray-50 transition-colors group">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <p className="text-4xl font-black text-gray-900 mb-1">{stats.physicallyDisabled}</p>
                        <h4 className="font-extrabold text-gray-700 mb-2 uppercase text-xs tracking-widest">Physically Disabled</h4>
                        <p className="text-xs text-gray-400 font-medium">Requiring physical campus assistance.</p>
                    </div>

                    <div className="p-8 hover:bg-gray-50 transition-colors group">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <HeartPulse size={24} />
                        </div>
                        <p className="text-4xl font-black text-gray-900 mb-1">{stats.mentalHealthConcerns}</p>
                        <h4 className="font-extrabold text-gray-700 mb-2 uppercase text-xs tracking-widest">Mental Health</h4>
                        <p className="text-xs text-gray-400 font-medium">Anxiety, depression, and stress monitoring.</p>
                    </div>

                    <div className="p-8 hover:bg-gray-50 transition-colors group">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-4xl font-black text-gray-900 mb-1">{stats.otherConcerns}</p>
                        <h4 className="font-extrabold text-gray-700 mb-2 uppercase text-xs tracking-widest">Other Concerns</h4>
                        <p className="text-xs text-gray-400 font-medium">Financial or behavioral probation flags.</p>
                    </div>

                    <div className="p-8 hover:bg-gray-50 transition-colors group">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className="text-4xl font-black text-gray-900 mb-1">{stats.healthy}</p>
                        <h4 className="font-extrabold text-gray-700 mb-2 uppercase text-xs tracking-widest">Healthy Status</h4>
                        <p className="text-xs text-gray-400 font-medium">Students with no active reports or flags.</p>
                    </div>
                </div>
            </div>

            {/* Recent Support Requests Table */}
            <div className="glass rounded-[2rem] border border-white/20 p-1 mb-10 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Support Logs</h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium italic">Latest guidance and counseling reports submitted.</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className="text-primary-main font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all"
                    >
                        View Full Log <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-5 font-black">Student ID</th>
                                <th className="px-8 py-5 font-black">Name</th>
                                <th className="px-8 py-5 font-black">Concern Type</th>
                                <th className="px-8 py-5 font-black">Priority</th>
                                <th className="px-8 py-5 font-black">Status</th>
                                <th className="px-8 py-5 font-black">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reports.slice(0, 5).map((report: any) => (
                                <tr
                                    key={report._id}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    onClick={() => setProcessingReport(report)}
                                >
                                    <td className="px-8 py-5 font-bold text-gray-400 text-xs tracking-widest whitespace-nowrap">{report.student?.studentProfile?.studentId || 'N/A'}</td>
                                    <td className="px-8 py-5 font-black text-gray-900 text-sm">
                                        {report.student?.firstName} {report.student?.lastName}
                                    </td>
                                    <td className="px-8 py-5 text-gray-600 text-xs font-bold">{report.type}</td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm
                                            ${report.priority === 'Critical' ? 'bg-red-500 text-white' :
                                                report.priority === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                    report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        'bg-blue-100 text-blue-700 border border-blue-200'
                                            }
                                        `}>
                                            {report.priority}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
                                            ${report.status === 'Resolved' ? 'text-green-600' : 'text-gray-600'}
                                        `}>
                                            {report.status === 'Pending' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                            {report.status === 'Reviewed' && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
                                            {report.status === 'Resolved' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 text-[10px] font-black tracking-widest uppercase">{new Date(report.createdAt).toLocaleDateString()}</td>
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
