import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, FileText, ShieldCheck, MessageSquare, History, Lock } from 'lucide-react';

interface ViewReportModalProps {
    selectedViewReport: any;
    setSelectedViewReport: (report: any) => void;
}

const ViewReportModal: React.FC<ViewReportModalProps> = ({
    selectedViewReport,
    setSelectedViewReport
}) => {
    return (
        <AnimatePresence>
            {selectedViewReport && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[85vh]"
                    >
                        {/* Modal Header */}
                        <div className="p-10 pb-6 border-b border-gray-100 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] -z-0"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedViewReport.type}</h2>
                                        <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${selectedViewReport.priority === 'Critical' ? 'bg-red-100 text-red-600' : selectedViewReport.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {selectedViewReport.priority}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Case ID: {selectedViewReport._id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedViewReport(null)}
                                    className="w-12 h-12 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <Settings size={22} className="rotate-45" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">Current Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${selectedViewReport.status === 'Resolved' ? 'bg-green-500' : selectedViewReport.status === 'Reviewed' ? 'bg-orange-500' : 'bg-blue-500'} shadow-sm`}></div>
                                        <p className="font-black text-gray-800 text-xl">{selectedViewReport.status}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">Date Filed</p>
                                    <p className="font-black text-gray-800 text-xl">{new Date(selectedViewReport.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary-main">
                                    <FileText size={20} />
                                    <h3 className="font-black uppercase tracking-widest text-xs">Full Description / Facts</h3>
                                </div>
                                <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                                    <p className="text-gray-700 font-medium leading-relaxed italic text-lg whitespace-pre-wrap">
                                        "{selectedViewReport.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <ShieldCheck size={20} />
                                    <h3 className="font-black uppercase tracking-widest text-xs">Administrative Processing</h3>
                                </div>
                                {selectedViewReport.adminNote ? (
                                    <div className="bg-green-50/30 p-8 rounded-[2.5rem] border border-green-100/50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/20 rounded-bl-[4rem]"></div>
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                                            <MessageSquare size={16} /> Final Admin Remarks & Instructions
                                        </p>
                                        <p className="text-gray-900 font-black text-xl leading-tight relative z-10">
                                            {selectedViewReport.adminNote}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                                        <History className="mx-auto text-gray-300 mb-2" size={32} />
                                        <p className="text-gray-400 font-bold italic">This case is currently in the administration review queue. Check back soon for updates.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End-to-End Encrypted Case</p>
                            </div>
                            <button
                                onClick={() => setSelectedViewReport(null)}
                                className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                                Close Record
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ViewReportModal;
