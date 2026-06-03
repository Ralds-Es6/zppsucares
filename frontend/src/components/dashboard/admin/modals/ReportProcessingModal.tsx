import React from 'react';
import { motion } from 'framer-motion';
import { Activity, X, ClipboardCheck, MessageSquare } from 'lucide-react';

interface ReportProcessingModalProps {
    report: any;
    onClose: () => void;
    onUpdateStatus: (reportId: string, status: string, feedback: string) => void;
}

const ReportProcessingModal: React.FC<ReportProcessingModalProps> = ({
    report,
    onClose,
    onUpdateStatus
}) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Modal Header */}
                <div className="p-10 pb-6 border-b border-gray-100 relative bg-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] -z-0"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                                <Activity className="text-primary-main" size={32} /> PROCESS REPORT
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary-main text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary-main/20">
                                    {report.student?.firstName[0]}{report.student?.lastName[0]}
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-900 leading-tight">{report.student?.firstName} {report.student?.lastName}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SUBMITTED {new Date(report.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={24} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-gray-50/30">
                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reported Concern Detail</label>
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
                            <div className="absolute top-6 right-6 text-primary-main/10 group-hover:text-primary-main/20 transition-colors">
                                <MessageSquare size={48} />
                            </div>
                            <p className="text-gray-800 font-black text-lg leading-relaxed italic relative z-10">"{report.description}"</p>
                        </div>
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Classification</p>
                            <p className="font-extrabold text-gray-900">{report.type}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Priority</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                                ${report.priority === 'Critical' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-700'}
                            `}>
                                {report.priority}
                            </span>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Administrative Feedback / Response</label>
                        <div className="relative">
                            <textarea
                                id="adminFeedback"
                                rows={4}
                                placeholder="Write a response or action plan for the student..."
                                className="w-full p-8 bg-white border-2 border-transparent rounded-[2.5rem] outline-none focus:border-primary-main transition-all font-bold text-gray-800 shadow-sm placeholder-gray-300 resize-none"
                            ></textarea>
                        </div>
                    </section>
                </div>

                <div className="p-8 border-t border-gray-100 bg-white flex gap-4">
                    <div className="flex-1 flex gap-2">
                        <button
                            onClick={() => onUpdateStatus(report._id, 'Reviewed', (document.getElementById('adminFeedback') as HTMLTextAreaElement).value)}
                            className="flex-1 py-5 bg-yellow-50 text-yellow-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-yellow-100 transition-all"
                        >
                            Mark As Reviewed
                        </button>
                        <button
                            onClick={() => onUpdateStatus(report._id, 'Resolved', (document.getElementById('adminFeedback') as HTMLTextAreaElement).value)}
                            className="flex-[2] py-5 bg-primary-main text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] shadow-xl shadow-primary-main/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <ClipboardCheck size={18} /> Resolve & Notify Student
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportProcessingModal;
