import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface SupportReportModalProps {
    showReportModal: boolean;
    setShowReportModal: (show: boolean) => void;
    newReport: any;
    setNewReport: (report: any) => void;
    handleCreateReport: (e: React.FormEvent) => void;
}

const SupportReportModal: React.FC<SupportReportModalProps> = ({
    showReportModal,
    setShowReportModal,
    newReport,
    setNewReport,
    handleCreateReport
}) => {
    return (
        <AnimatePresence>
            {showReportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary-100 text-primary-main rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">SEEK NEW SUPPORT</h2>
                            <p className="text-gray-500 font-medium italic">"Every concern matters. Tell us what's on your mind."</p>
                        </div>

                        <form onSubmit={handleCreateReport} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Type of Support Needed</label>
                                <select
                                    required
                                    value={newReport.type}
                                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 appearance-none"
                                >
                                    <option value="Mental Health Check">Mental Health Check</option>
                                    <option value="Physical Accessibility">Physical Accessibility</option>
                                    <option value="General Guidance">General Guidance</option>
                                    <option value="Emergency Support">Emergency Support</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Describe your concern</label>
                                <textarea
                                    required
                                    value={newReport.description}
                                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                                    rows={4}
                                    placeholder="Please provide details so we can assist you better..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 placeholder-gray-300 resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Urgency Level</label>
                                    <select
                                        value={newReport.priority}
                                        onChange={(e) => setNewReport({ ...newReport, priority: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 appearance-none"
                                    >
                                        <option value="Low">Low - Not Urgent</option>
                                        <option value="Medium">Medium - Standard</option>
                                        <option value="High">High - Priority</option>
                                        <option value="Critical">Critical - Immediate</option>
                                    </select>
                                </div>
                                <div className="flex items-end gap-3">
                                    <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-primary-main text-white rounded-2xl font-black shadow-lg shadow-primary-main/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Submit Report</button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SupportReportModal;
