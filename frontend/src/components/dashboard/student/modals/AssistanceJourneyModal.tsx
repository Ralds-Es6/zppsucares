import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Wallet, AlertCircle } from 'lucide-react';

interface AssistanceJourneyModalProps {
    showAssistanceModal: boolean;
    setShowAssistanceModal: (show: boolean) => void;
    assistanceData: any;
    setAssistanceData: (data: any) => void;
    handleAssistanceSubmit: (e: React.FormEvent) => void;
}

const AssistanceJourneyModal: React.FC<AssistanceJourneyModalProps> = ({
    showAssistanceModal,
    setShowAssistanceModal,
    assistanceData,
    setAssistanceData,
    handleAssistanceSubmit
}) => {
    const getTypeHeader = () => {
        switch (assistanceData.type) {
            case 'Academic Scholarship':
                return { icon: GraduationCap, color: 'text-accent-main bg-accent-light/30 border-accent-light' };
            case 'Student Grant':
                return { icon: Wallet, color: 'text-primary-main bg-primary-light border-primary-500/10' };
            default:
                return { icon: AlertCircle, color: 'text-red-500 bg-red-50 border-red-100' };
        }
    };

    const header = getTypeHeader();

    return (
        <AnimatePresence>
            {showAssistanceModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="glass-modal w-full max-w-4xl rounded-3xl sm:rounded-[3rem] p-5 sm:p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <button
                            type="button"
                            onClick={() => setShowAssistanceModal(false)}
                            className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <form onSubmit={handleAssistanceSubmit} className="space-y-8">
                            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${header.color}`}>
                                    {header.icon && <header.icon size={28} />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Application Form</p>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">{assistanceData.type}</h2>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                        <h3 className="text-xs font-black text-primary-main uppercase tracking-widest">1. Socio-Economic Profile</h3>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Household Monthly Income</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. PHP 25,000"
                                                value={assistanceData.householdIncome}
                                                onChange={(e) => setAssistanceData({ ...assistanceData, householdIncome: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent Occupation</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Farmer / OFW"
                                                value={assistanceData.parentOccupation}
                                                onChange={(e) => setAssistanceData({ ...assistanceData, parentOccupation: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">No. of Dependents</label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="Total members"
                                                    value={assistanceData.numberOfDependents}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, numberOfDependents: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current GPA</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. 1.75"
                                                    value={assistanceData.gpa}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, gpa: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                        <h3 className="text-xs font-black text-primary-main uppercase tracking-widest">2. Document Info & Verification</h3>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Document Type</label>
                                            <select
                                                required
                                                value={assistanceData.documentType}
                                                onChange={(e) => setAssistanceData({ ...assistanceData, documentType: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm appearance-none"
                                            >
                                                <option value="">Select document type...</option>
                                                <option value="Certificate of Indigency">Certificate of Indigency</option>
                                                <option value="Barangay Certificate">Barangay Certificate</option>
                                                <option value="Income Tax Return">Income Tax Return (ITR)</option>
                                                <option value="DSWD Certificate">DSWD Certificate</option>
                                                <option value="Medical Certificate">Medical Certificate</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference / Control No.</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. CERT-2026-00123"
                                                value={assistanceData.documentReference}
                                                onChange={(e) => setAssistanceData({ ...assistanceData, documentReference: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="e.g. 09171234567"
                                                    value={assistanceData.contactNumber}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, contactNumber: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={assistanceData.availableDate}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, availableDate: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                <h3 className="text-xs font-black text-primary-main uppercase tracking-widest">3. Additional Remarks</h3>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes / Circumstances (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Any special remarks or comments you'd like to share with the evaluation committee..."
                                        value={assistanceData.additionalNotes}
                                        onChange={(e) => setAssistanceData({ ...assistanceData, additionalNotes: e.target.value })}
                                        className="w-full p-5 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main/20 transition-all font-bold text-gray-800 text-sm resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAssistanceModal(false)}
                                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AssistanceJourneyModal;
