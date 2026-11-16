import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle, FileText, ChevronRight, MessageSquare,
    Briefcase, History, Search
} from 'lucide-react';

import type { ReportItem, CaseItem } from '../../../pages/StudentDashboard';

interface ReportsTabProps {
    setShowReportModal: (show: boolean) => void;
    isReportsLoading: boolean;
    reports: ReportItem[];
    reportPage: number;
    reportsPerPage: number;
    setReportPage: (page: number | ((prev: number) => number)) => void;
    setSelectedViewReport: (report: ReportItem | null) => void;
    isCasesLoading: boolean;
    cases: CaseItem[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({
    setShowReportModal,
    isReportsLoading,
    reports,
    reportPage,
    reportsPerPage,
    setReportPage,
    setSelectedViewReport,
    isCasesLoading,
    cases
}) => {
    return (
        <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <section className="glass p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Support Reports</h2>
                        <p className="text-sm sm:text-base text-gray-500 font-medium">Confidential reporting system for student concerns.</p>
                    </div>
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="w-full md:w-auto justify-center bg-primary-main text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold shadow-xl shadow-primary-main/30 hover:bg-primary-800 transition-all flex items-center gap-2"
                    >
                        <AlertCircle size={20} /> File New Case
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {isReportsLoading ? (
                        <div className="p-10 text-center text-gray-400 font-bold">Checking Support History...</div>
                    ) : reports.length > 0 ? (
                        <>
                            {reports
                                .slice((reportPage - 1) * reportsPerPage, reportPage * reportsPerPage)
                                .map((report: ReportItem) => (
                                    <div
                                        key={report._id}
                                        onClick={() => setSelectedViewReport(report)}
                                        className="p-8 glass-slab-interactive rounded-4xl flex flex-col gap-6 cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[4rem] opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                        <div className="flex items-start justify-between relative z-10">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-black text-gray-900 text-xl group-hover:text-primary-main transition-colors">{report.type}</h4>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${report.priority === 'Critical' ? 'bg-red-100 text-red-600' : report.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {report.priority}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                    Case ID: {report._id ? report._id.substring(0, 12) : 'N/A'} • {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recent'}
                                                </p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${report.status === 'Resolved' ? 'bg-green-100 text-green-700' : report.status === 'Reviewed' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {report.status}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 relative z-10">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Submitted Description</p>
                                            <p className="text-gray-700 font-medium leading-relaxed line-clamp-2">"{report.description}"</p>
                                            <div className="mt-2 text-primary-main text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Click to view full details <ChevronRight size={14} />
                                            </div>
                                        </div>

                                        {Boolean(report.adminNote) && (
                                            <div className="p-4 bg-primary-main/5 rounded-2xl border border-primary-100 relative z-10">
                                                <p className="text-[10px] font-black text-primary-main uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                    <MessageSquare size={12} /> Counselor Update Received
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                            {/* Pagination Controls */}
                            {reports.length > reportsPerPage && (
                                <div className="flex items-center justify-between pt-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        Showing <span className="text-primary-main">{Math.min(reports.length, reportPage * reportsPerPage)}</span> of <span className="text-primary-main">{reports.length}</span> Submissions
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={reportPage === 1}
                                            onClick={() => setReportPage(prev => (prev as number) - 1)}
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
                                            onClick={() => setReportPage(prev => (prev as number) + 1)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reportPage === Math.ceil(reports.length / reportsPerPage) ? 'bg-gray-50 text-gray-300' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 tracking-tight">No Reports Found</h3>
                            <p className="text-gray-400 mt-2">You haven't filed any support reports yet.</p>
                        </div>
                    )}
                </div>

                <div className="mt-12">
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <Briefcase className="text-primary-main" size={28} /> My Official Case Files
                    </h3>
                    <div className="grid gap-6">
                        {isCasesLoading ? (
                            <div className="p-10 text-center text-gray-400 font-bold">Checking University Records...</div>
                        ) : cases.length > 0 ? (
                            cases.map((c: CaseItem) => (
                                <div key={c._id} className="glass p-8 rounded-[2.5rem] border border-white/20 shadow-xl hover:border-primary-main transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-10 -mt-10 opacity-40 group-hover:scale-110 transition-transform"></div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${c.status === 'Open' ? 'bg-red-100 text-red-600' : c.status === 'Ongoing' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{c.status}</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{c.category}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-gray-900 group-hover:text-primary-main transition-colors uppercase tracking-tight">{c.title}</h4>
                                            <p className="text-sm text-gray-500 font-medium mt-1">Status as of {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'Recent'}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Counselor/Admin</p>
                                                <p className="font-bold text-gray-800">{c.admin?.firstName} {c.admin?.lastName}</p>
                                            </div>
                                            <button className="bg-white border border-gray-100 p-4 rounded-2xl text-primary-main shadow-sm hover:bg-primary-main hover:text-white transition-all">
                                                <History size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Referral Status</p>
                                            <p className="font-bold text-gray-800">{c.referralTracking?.behaviorStatus}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mental Check</p>
                                            <p className="font-bold text-gray-800">{c.referralTracking?.latestStatusMental}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Physical Check</p>
                                            <p className="font-bold text-gray-800">{c.referralTracking?.latestStatusPhysical}</p>
                                        </div>
                                        <button className="flex items-center justify-center gap-2 bg-primary-main/5 text-primary-main rounded-2xl font-bold text-sm hover:bg-primary-main hover:text-white transition-all">
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                                <Search size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold">No registered case files found in your student record.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default ReportsTab;
