import React from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Plus, ChevronRight } from 'lucide-react';

interface StudentReportsProps {
    reports: any[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    filterPriority: string;
    setFilterPriority: (priority: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    reportPage: number;
    setReportPage: (page: number | ((prev: number) => number)) => void;
    setProcessingReport: (report: any) => void;
}

const reportsPerPage = 10;

const StudentReports: React.FC<StudentReportsProps> = ({
    reports,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    reportPage,
    setReportPage,
    setProcessingReport
}) => {
    const filteredReports = (reports || []).filter((report: any) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            !searchQuery ||
            report.student?.firstName?.toLowerCase().includes(searchLower) ||
            report.student?.lastName?.toLowerCase().includes(searchLower) ||
            report._id?.toLowerCase().includes(searchLower) ||
            report.student?.studentProfile?.studentId?.toLowerCase().includes(searchLower);

        const matchesType = filterType === 'All Types' ||
            report.type?.toLowerCase() === filterType.toLowerCase();

        const matchesPriority = filterPriority === 'Any Priority' ||
            (filterPriority === 'Non-Critical Support' && report.priority?.toLowerCase() !== 'critical') ||
            report.priority?.toLowerCase() === filterPriority.toLowerCase();

        const matchesStatus = filterStatus === 'All Status' ||
            report.status?.toLowerCase() === filterStatus.toLowerCase() ||
            (filterStatus === 'Reviewed' && report.status === 'In Progress');

        return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });

    return (
        <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Comprehensive Reports</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">Analyze and manage all student support documentation.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-3 bg-white border border-gray-100 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={18} /> Export Data
                    </button>
                    <button className="flex items-center gap-3 bg-primary-main text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Plus size={18} /> Manual Report
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/40">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Search Database</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                            type="text"
                            placeholder="ID or Name..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setReportPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-main/50 transition-all outline-none text-sm font-bold"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Concern Type</label>
                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setReportPage(1);
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-main/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                    >
                        <option>All Types</option>
                        <option value="Mental Health Check">Mental Health Check</option>
                        <option value="Physical Accessibility">Physical Accessibility</option>
                        <option value="General Guidance">General Guidance</option>
                        <option value="Emergency Support">Emergency Support</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Priority Level</label>
                    <select
                        value={filterPriority}
                        onChange={(e) => {
                            setFilterPriority(e.target.value);
                            setReportPage(1);
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-main/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                    >
                        <option>Any Priority</option>
                        <option>Non-Critical Support</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setReportPage(1);
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-main/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                    >
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Reviewed</option>
                        <option>Resolved</option>
                    </select>
                </div>
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {filteredReports.length > 0 ? (
                    filteredReports
                        .slice((reportPage - 1) * reportsPerPage, reportPage * reportsPerPage)
                        .map((report: any, i: number) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                key={report._id}
                                onClick={() => setProcessingReport(report)}
                                className="glass-slab-interactive p-6 rounded-[2.5rem] group relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-primary-50"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                                        ${report.priority === 'Critical' ? 'bg-red-500 text-white' :
                                                report.priority === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                    'bg-blue-100 text-blue-700 border border-blue-200'}
                                    `}>
                                            {report.priority}
                                        </span>
                                        <div className="text-right text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-main transition-colors uppercase tracking-tight">
                                        {report.student?.firstName} {report.student?.lastName}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 mb-6 font-black uppercase tracking-widest">ID: {report.student?.studentProfile?.studentId || 'N/A'} • {report.type}</p>

                                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mb-6 group-hover:border-primary-100 transition-colors">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-100">Concern Message</p>
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed italic line-clamp-2">"{report.description}"</p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${report.status === 'Resolved' ? 'bg-green-500' :
                                                report.status === 'Pending' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                                                }`}></div>
                                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{report.status}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-primary-main text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            Process Case <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">No matching logs</h3>
                        <p className="text-gray-500 font-medium italic mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredReports.length > reportsPerPage && (
                <div className="flex items-center justify-between mt-10 px-4 pb-20">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Logs Found: <span className="text-primary-main">{filteredReports.length}</span> (Page {reportPage} of {Math.ceil(filteredReports.length / reportsPerPage)})
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={reportPage === 1}
                            onClick={() => setReportPage((prev: number) => Math.max(1, prev - 1))}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${reportPage === 1 ? 'bg-gray-50 text-gray-300' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95 shadow-sm'}`}
                        >
                            <ChevronRight size={20} className="rotate-180" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(filteredReports.length / reportsPerPage) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setReportPage(i + 1)}
                                    className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${reportPage === i + 1 ? 'bg-primary-main text-white shadow-xl shadow-primary-main/30' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={reportPage === Math.ceil(filteredReports.length / reportsPerPage)}
                            onClick={() => setReportPage((prev: number) => Math.min(Math.ceil(filteredReports.length / reportsPerPage), prev + 1))}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${reportPage === Math.ceil(filteredReports.length / reportsPerPage) ? 'bg-gray-50 text-gray-300' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 active:scale-95 shadow-sm'}`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default StudentReports;
