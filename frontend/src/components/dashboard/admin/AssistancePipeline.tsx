import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, HandHelping } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssistancePipeline: React.FC = () => {
    const [assistanceRequests, setAssistanceRequests] = useState<any[]>([]);
    const [selectedAssistance, setSelectedAssistance] = useState<any>(null);
    const [assistanceAdminNote, setAssistanceAdminNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const stepLabels = ['Profiling', 'Documentation', 'Verification', 'Final Review'];
    const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const;

    const fetchAssistanceRequests = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const { data } = await axios.get('/api/assistance/all', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setAssistanceRequests(data);
        } catch (error) {
            console.error("Error fetching assistance requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssistanceRequests();
    }, []);

    const handleVerifyStep = async (requestId: string, step: number, status: string) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.put('/api/assistance/verify-step', {
                requestId, step, status, adminNote: assistanceAdminNote
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            toast.success(`Step ${step} marked as ${status}.`);
            setAssistanceAdminNote('');
            fetchAssistanceRequests();

            // Re-fetch to update details
            const { data } = await axios.get('/api/assistance/all', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            const updated = data.find((r: any) => r._id === requestId);
            if (updated) setSelectedAssistance(updated);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update step.');
        }
    };

    const getStepStatusColor = (status: string) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-400 border-gray-200';
        }
    };

    if (selectedAssistance) {
        return (
            <motion.div key="assist-review" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 pb-20">
                <div className="flex items-center gap-6">
                    <button onClick={() => setSelectedAssistance(null)} className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-main hover:border-primary-main/20 hover:bg-primary-50 transition-all shadow-sm">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">MILESTONE REVIEW</h2>
                        <p className="text-gray-500 font-medium italic mt-1">
                            Applicant: <span className="text-primary-main font-black not-italic">{selectedAssistance.student?.firstName} {selectedAssistance.student?.lastName}</span>
                        </p>
                    </div>
                </div>

                {/* Shopee-Style Step Tracker */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex items-center justify-between relative">
                        {stepLabels.map((label, i) => {
                            const status = selectedAssistance[stepKeys[i]]?.status || 'Locked';
                            const isLast = i === stepLabels.length - 1;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center relative">
                                    {!isLast && (
                                        <div className={`absolute left-1/2 top-6 w-full h-[2px] -z-0 ${status === 'Verified' ? 'bg-green-200' : 'bg-gray-100'}`}></div>
                                    )}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 z-10 shadow-sm transition-all duration-500 ${status === 'Verified' ? 'bg-green-500 text-white border-green-400' :
                                        status === 'Pending Review' ? 'bg-yellow-500 text-white border-yellow-400 animate-pulse' :
                                            status === 'In Progress' ? 'bg-primary-main text-white border-primary-400 ring-4 ring-primary-100' :
                                                status === 'Rejected' ? 'bg-red-500 text-white border-red-400' : 'bg-gray-50 text-gray-300 border-gray-100'
                                        }`}>
                                        {status === 'Verified' ? <CheckCircle2 size={24} /> : (i + 1)}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-3 text-gray-500">{label}</p>
                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${status === 'Pending Review' ? 'text-yellow-600' : status === 'Verified' ? 'text-green-600' : 'text-gray-400'}`}>{status}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step-by-Step Panels */}
                <div className="grid md:grid-cols-2 gap-8">
                    {stepLabels.map((label, i) => {
                        const stepData = selectedAssistance[stepKeys[i]];
                        const status = stepData?.status || 'Locked';
                        const isPendingReview = status === 'Pending Review';
                        // Step 4 is actioned purely by admin — treat 'In Progress' same as 'Pending Review'
                        const isActionable = isPendingReview || (i === 3 && status === 'In Progress');

                        return (
                            <div key={i} className={`p-10 rounded-[3rem] border-2 relative overflow-hidden transition-all duration-300 ${isActionable ? 'bg-yellow-50/50 border-yellow-200 shadow-2xl shadow-yellow-200/20' :
                                status === 'Verified' ? 'bg-green-50/20 border-green-100' :
                                    status === 'Rejected' ? 'bg-red-50/20 border-red-100' : 'bg-white border-gray-50 opacity-60'
                                }`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${getStepStatusColor(status)} shadow-sm`}>{i + 1}</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tight">{label}</h4>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${status === 'Pending Review' ? 'text-yellow-600' : 'text-gray-400'}`}>{status}</p>
                                    </div>
                                </div>

                                {/* Dynamic Content based on Step */}
                                {i === 0 && stepData?.data && (
                                    <div className="space-y-4 mb-8 p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Household Income</span><span className="font-black text-gray-900">{stepData.data.householdIncome || 'N/A'}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parent Occupation</span><span className="font-black text-gray-900">{stepData.data.parentOccupation || 'N/A'}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current GPA</span><span className="font-black text-primary-main">{stepData.data.gpa || 'N/A'}</span></div>
                                    </div>
                                )}

                                {i === 1 && stepData?.data && (
                                    <div className="space-y-4 mb-8 p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Type</span><span className="font-black text-gray-900">{stepData.data.documentType || 'N/A'}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference No.</span><span className="font-black text-gray-900 font-mono">{stepData.data.documentReference || 'N/A'}</span></div>
                                    </div>
                                )}

                                {i === 2 && stepData?.data && (
                                    <div className="space-y-4 mb-8 p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposed Interview</span><span className="font-black text-gray-900">{stepData.data.availableDate || 'N/A'}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Priority</span><span className="font-black text-gray-900">{stepData.data.contactNumber || 'N/A'}</span></div>
                                    </div>
                                )}

                                {i === 3 && isActionable && (
                                    <div className="space-y-4 mb-8">
                                        <div className="p-6 bg-primary-main text-white rounded-[2rem] shadow-xl shadow-primary-main/20">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Final Review Protocol</p>
                                            <p className="text-sm font-bold leading-relaxed">Confirm that all documentation has been verified and the applicant meets the eligibility criteria for the assistance program.</p>
                                        </div>
                                    </div>
                                )}

                                {stepData?.adminNote && (
                                    <div className="text-[11px] text-gray-500 font-medium italic mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span className="font-black text-gray-700 not-italic uppercase tracking-widest block mb-1">Administrative Log:</span> {stepData.adminNote}
                                    </div>
                                )}

                                {isActionable && (
                                    <div className="space-y-4 mt-8 pt-8 border-t border-yellow-200">
                                        <textarea
                                            placeholder="Internal remarks for this milestone..."
                                            value={assistanceAdminNote}
                                            onChange={(e) => setAssistanceAdminNote(e.target.value)}
                                            rows={3}
                                            className="w-full p-6 bg-white border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-primary-main transition-all resize-none font-bold text-gray-800 shadow-sm"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleVerifyStep(selectedAssistance._id, i + 1, 'Verified')}
                                                className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/20 transition-all active:scale-95"
                                            >
                                                Approve Milestone
                                            </button>
                                            <button
                                                onClick={() => handleVerifyStep(selectedAssistance._id, i + 1, 'Rejected')}
                                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/20 transition-all active:scale-95"
                                            >
                                                Reject Milestone
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Assistance Tracker</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">Managing scholarship and financial aid applications.</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-8 py-6">Applicant</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-center">Application Progress</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
                                </td>
                            </tr>
                        ) : assistanceRequests.length > 0 ? (
                            assistanceRequests.map((r) => (
                                <tr key={r._id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-main flex items-center justify-center font-black text-sm uppercase">
                                                {r.student?.firstName?.[0]}{r.student?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-primary-main transition-colors">{r.student?.firstName} {r.student?.lastName}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: {r.student?.studentProfile?.studentId || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {(() => {
                                            const getStatus = () => {
                                                const steps = [r.step1, r.step2, r.step3, r.step4];
                                                const allVerified = steps.every((s: any) => s?.status === 'Verified');
                                                if (r.status === 'Finalized' || allVerified) return { label: 'Approved', style: 'bg-green-50 text-green-700 border-green-200' };
                                                if (steps.some((s: any) => s?.status === 'Rejected')) return { label: 'Rejected', style: 'bg-red-50 text-red-700 border-red-200' };
                                                if (steps.some((s: any) => s?.status === 'Pending Review')) return { label: 'Under Review', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
                                                if (steps.some((s: any) => s?.status === 'In Progress')) return { label: 'In Progress', style: 'bg-blue-50 text-blue-700 border-blue-200' };
                                                return { label: 'Pending', style: 'bg-gray-50 text-gray-500 border-gray-200' };
                                            };
                                            const { label, style } = getStatus();
                                            return (
                                                <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${style}`}>
                                                    {label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-0">
                                                {['step1', 'step2', 'step3', 'step4'].map((stepKey, i) => {
                                                    const status = r[stepKey]?.status || 'Locked';
                                                    const isLast = i === 3;
                                                    return (
                                                        <div key={i} className="flex items-center">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all duration-500 ${status === 'Verified' ? 'bg-green-500 text-white border-green-400' :
                                                                status === 'Pending Review' ? 'bg-yellow-500 text-white border-yellow-400 animate-pulse' :
                                                                    status === 'In Progress' ? 'bg-primary-main text-white border-primary-400 ring-2 ring-primary-100' :
                                                                        status === 'Rejected' ? 'bg-red-500 text-white border-red-400' :
                                                                            'bg-gray-100 text-gray-300 border-gray-200'
                                                                }`}>
                                                                {status === 'Verified' ? '✓' : (i + 1)}
                                                            </div>
                                                            {!isLast && (
                                                                <div className={`w-4 h-[2px] transition-colors duration-500 ${status === 'Verified' ? 'bg-green-300' : 'bg-gray-100'}`}></div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mt-2">Step {r.currentStep} of 4</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedAssistance(r)}
                                            className="px-6 py-2.5 bg-primary-50 text-primary-main rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-main hover:text-white transition-all shadow-sm"
                                        >
                                            Open Review
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <HandHelping size={48} className="text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Active Applications</h3>
                                    <p className="text-gray-400 mt-2 font-medium">Scholarship and financial aid applications will appear here.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AssistancePipeline;
