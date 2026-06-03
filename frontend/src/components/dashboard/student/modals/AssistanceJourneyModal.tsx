import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, GraduationCap, Wallet, AlertCircle, ArrowRight, ClipboardCheck } from 'lucide-react';

interface AssistanceJourneyModalProps {
    showAssistanceModal: boolean;
    setShowAssistanceModal: (show: boolean) => void;
    assistanceRequest: any;
    assistanceStep: number;
    assistanceData: any;
    setAssistanceData: (data: any) => void;
    startAssistanceJourney: (type: string) => void;
    handleAssistanceSubmit: (e: React.FormEvent) => void;
}

const AssistanceJourneyModal: React.FC<AssistanceJourneyModalProps> = ({
    showAssistanceModal,
    setShowAssistanceModal,
    assistanceRequest,
    assistanceStep,
    assistanceData,
    setAssistanceData,
    startAssistanceJourney,
    handleAssistanceSubmit
}) => {
    return (
        <AnimatePresence>
            {showAssistanceModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
                    >
                        <button
                            onClick={() => setShowAssistanceModal(false)}
                            className="absolute top-10 right-10 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {!assistanceRequest ? (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-primary-100 text-primary-main rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/10">
                                        <Coins size={40} />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">CHOOSE YOUR JOURNEY</h2>
                                    <p className="text-gray-500 font-medium mt-2 italic">Select the assistance type you wish to apply for.</p>
                                </div>

                                <div className="grid gap-4">
                                    {[
                                        { type: 'Academic Scholarship', icon: GraduationCap, desc: 'For students with outstanding academic performance.', color: 'blue' },
                                        { type: 'Student Grant', icon: Wallet, desc: 'Financial support based on socio-economic need.', color: 'primary' },
                                        { type: 'Emergency Assistance', icon: AlertCircle, desc: 'Immediate support for crises or medical emergencies.', color: 'red' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.type}
                                            onClick={() => startAssistanceJourney(opt.type)}
                                            className="group flex items-center gap-6 p-6 bg-gray-50 hover:bg-white rounded-3xl border border-gray-50 hover:border-primary-main hover:shadow-2xl transition-all text-left"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-main shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                                                <opt.icon size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-gray-900 leading-none">{opt.type}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-2">{opt.desc}</p>
                                            </div>
                                            <ArrowRight size={20} className="text-gray-300 group-hover:text-primary-main transition-transform translate-x-0 group-hover:translate-x-2" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-black text-primary-main uppercase tracking-widest">Step {assistanceStep} of 4</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4].map(s => (
                                            <div key={s} className={`h-1.5 w-8 rounded-full transition-colors ${s === assistanceStep ? 'bg-primary-main' : s < assistanceStep ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                {assistanceStep === 1 && (
                                    <form onSubmit={handleAssistanceSubmit} className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">SOCIO-ECONOMIC PROFILING</h2>
                                            <p className="text-gray-500 font-medium">Please provide your household financial details for verification.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Household Monthly Income</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. PHP 25,000"
                                                    value={assistanceData.householdIncome}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, householdIncome: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Parent Occupation</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. Farmer / OFW"
                                                    value={assistanceData.parentOccupation}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, parentOccupation: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Number of Dependents</label>
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="Total household members"
                                                    value={assistanceData.numberOfDependents}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, numberOfDependents: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current GPA / Average</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. 1.75"
                                                    value={assistanceData.gpa}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, gpa: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowAssistanceModal(false)}
                                                className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                                            >
                                                Save Progress
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-5 bg-primary-main text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-main/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                Finalize Step 1 <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {assistanceStep === 2 && (
                                    <form onSubmit={handleAssistanceSubmit} className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">DOCUMENTATION</h2>
                                            <p className="text-gray-500 font-medium">Provide your supporting document details for verification.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Primary Document Type</label>
                                                <select
                                                    required
                                                    value={assistanceData.documentType}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, documentType: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 appearance-none"
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
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Document Reference / Control No.</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. CERT-2026-00123"
                                                    value={assistanceData.documentReference}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, documentReference: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Additional Documents / Notes</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="List any additional supporting documents you have..."
                                                    value={assistanceData.additionalDocs}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, additionalDocs: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowAssistanceModal(false)}
                                                className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                                            >
                                                Save Progress
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-5 bg-primary-main text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-main/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                Finalize Step 2 <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {assistanceStep === 3 && (
                                    <form onSubmit={handleAssistanceSubmit} className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">VERIFICATION / INTERVIEW</h2>
                                            <p className="text-gray-500 font-medium">Provide your availability and contact details for the verification interview.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Interview Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={assistanceData.availableDate}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, availableDate: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="e.g. 09171234567"
                                                    value={assistanceData.contactNumber}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, contactNumber: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Additional Notes for Interviewer</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Any special circumstances or information the interviewer should know..."
                                                    value={assistanceData.additionalNotes}
                                                    onChange={(e) => setAssistanceData({ ...assistanceData, additionalNotes: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowAssistanceModal(false)}
                                                className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                                            >
                                                Save Progress
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-5 bg-primary-main text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-main/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                Finalize Step 3 <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {assistanceStep === 4 && (
                                    <div className="space-y-8 text-center py-8">
                                        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-[2rem] flex items-center justify-center mx-auto">
                                            <ClipboardCheck size={48} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">FINAL REVIEW</h2>
                                            <p className="text-gray-500 font-medium mt-2">Your application is now under final review by the administration team.</p>
                                            <p className="text-xs text-gray-400 mt-4 max-w-sm mx-auto leading-relaxed">No further action is required from you at this time. You will receive a notification once a decision has been made on your application.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAssistanceModal(false)}
                                            className="px-10 py-5 bg-gray-100 text-gray-600 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                                        >
                                            Close & Wait for Update
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AssistanceJourneyModal;
