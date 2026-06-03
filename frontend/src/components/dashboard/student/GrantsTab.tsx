import React from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, BadgePercent, User, ClipboardCheck,
    LayoutList, CheckCircle2, History, Clock
} from 'lucide-react';

interface GrantsTabProps {
    assistanceRequest: any;
    setShowAssistanceModal: (show: boolean) => void;
    setAssistanceStep: (step: number) => void;
}

const GrantsTab: React.FC<GrantsTabProps> = ({
    assistanceRequest,
    setShowAssistanceModal,
    setAssistanceStep
}) => {
    return (
        <motion.div
            key="grants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <section className="glass p-10 rounded-[3rem] border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/20 rounded-bl-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2">Scholarships & Grants</h2>
                        <p className="text-gray-500 font-medium">Procedural tracking for student financial assistance.</p>
                    </div>
                    {!assistanceRequest ? (
                        <button
                            onClick={() => setShowAssistanceModal(true)}
                            className="bg-primary-main text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-primary-main/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center gap-3"
                        >
                            <Wallet size={20} /> Initialize Journey
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 px-6 py-4 bg-primary-50 rounded-2xl border border-primary-100">
                            <div className="w-10 h-10 bg-primary-main text-white rounded-xl flex items-center justify-center animate-pulse">
                                <BadgePercent size={20} />
                            </div>
                            <div className="pr-4 border-r border-primary-100">
                                <p className="text-[10px] font-black text-primary-main uppercase tracking-widest">Active Track</p>
                                <p className="font-bold text-gray-800 text-sm">{assistanceRequest.type}</p>
                            </div>
                            <div className="pl-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</p>
                                <p className="font-bold text-primary-main text-sm">{assistanceRequest.status}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {assistanceRequest ? (
                <div className="space-y-8">
                    {/* Shopee-style Tracker */}
                    <section className="glass p-10 rounded-[3rem] border border-white/20 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center justify-between mb-12">
                            {[
                                { id: 1, label: 'Profiling', icon: User, status: assistanceRequest.step1.status },
                                { id: 2, label: 'Documentation', icon: ClipboardCheck, status: assistanceRequest.step2.status },
                                { id: 3, label: 'Verification', icon: LayoutList, status: assistanceRequest.step3.status },
                                { id: 4, label: 'Review', icon: CheckCircle2, status: assistanceRequest.step4.status }
                            ].map((step, index, arr) => (
                                <div key={step.id} className="flex-1 flex flex-col items-center relative group">
                                    {index !== arr.length - 1 && (
                                        <div className={`absolute left-1/2 top-6 w-full h-[3px] -z-10 transition-colors duration-500 ${step.status === 'Verified' ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                                    )}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300 relative ${step.status === 'Verified' ? 'bg-green-500 text-white' :
                                        step.status === 'Pending Review' ? 'bg-yellow-500 text-white animate-pulse' :
                                            step.status === 'In Progress' ? 'bg-primary-main text-white ring-4 ring-primary-100' :
                                                step.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-300'
                                        }`}>
                                        <step.icon size={24} />
                                        {step.status === 'Verified' && <CheckCircle2 size={16} className="absolute -top-1 -right-1 text-green-700 bg-white rounded-full" />}
                                    </div>
                                    <p className={`mt-4 font-black uppercase tracking-widest text-[9px] ${step.status === 'Verified' ? 'text-green-600' :
                                        step.status === 'Pending Review' ? 'text-yellow-600' :
                                            step.status === 'In Progress' ? 'text-primary-main font-black' : 'text-gray-400'
                                        }`}>{step.label}</p>
                                    <p className="text-[8px] font-bold text-gray-400 mt-0.5">{step.status}</p>
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Section Content */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left: Step Details */}
                            <div className="space-y-6">
                                <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-main shadow-sm border border-gray-50">
                                            <LayoutList size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900">Current Step Tracking</h4>
                                            <p className="text-xs text-gray-500 font-medium">Verify your data as we proceed.</p>
                                        </div>
                                    </div>

                                    {(() => {
                                        // Find the current actionable step
                                        const steps = [
                                            { key: 'step1', label: 'Socio-Economic Profiling', stepNum: 1, actionText: 'Complete your economic background details.' },
                                            { key: 'step2', label: 'Documentation', stepNum: 2, actionText: 'Submit your supporting documents for verification.' },
                                            { key: 'step3', label: 'Verification / Interview', stepNum: 3, actionText: 'Provide your availability and contact details for interview.' },
                                            { key: 'step4', label: 'Final Review', stepNum: 4, actionText: 'Your application is under final review by administration.' }
                                        ];
                                        const activeStep = steps.find(s =>
                                            assistanceRequest[s.key]?.status === 'In Progress' || assistanceRequest[s.key]?.status === 'Rejected'
                                        );
                                        const pendingStep = steps.find(s => assistanceRequest[s.key]?.status === 'Pending Review');

                                        if (activeStep && activeStep.stepNum <= 3) {
                                            return (
                                                <div className="bg-primary-main/5 p-6 rounded-3xl border border-primary-100">
                                                    <p className="text-sm text-primary-900 font-bold mb-1">{activeStep.label}</p>
                                                    <p className="text-xs text-gray-500 font-medium mb-4 italic">{activeStep.actionText}</p>
                                                    {assistanceRequest[activeStep.key]?.status === 'Rejected' && assistanceRequest[activeStep.key]?.adminNote && (
                                                        <div className="mb-4 p-3 bg-red-50 rounded-2xl border border-red-100">
                                                            <p className="text-xs text-red-600 font-bold">Rejection Note:</p>
                                                            <p className="text-xs text-red-500 mt-1">{assistanceRequest[activeStep.key].adminNote}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setAssistanceStep(activeStep.stepNum);
                                                            setShowAssistanceModal(true);
                                                        }}
                                                        className="w-full py-4 bg-primary-main text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-main/20"
                                                    >
                                                        Open Step {activeStep.stepNum}: {activeStep.label}
                                                    </button>
                                                </div>
                                            );
                                        } else if (activeStep && activeStep.stepNum === 4) {
                                            return (
                                                <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200 text-center">
                                                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                        <ClipboardCheck size={24} />
                                                    </div>
                                                    <p className="text-sm text-yellow-800 font-bold">Final Review In Progress</p>
                                                    <p className="text-xs text-yellow-600 font-medium mt-1">The administration is reviewing your complete application. You'll be notified once a decision is made.</p>
                                                </div>
                                            );
                                        } else if (pendingStep) {
                                            return (
                                                <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200 text-center">
                                                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                                                        <Clock size={20} />
                                                    </div>
                                                    <p className="text-sm text-yellow-800 font-bold">Awaiting Admin Review</p>
                                                    <p className="text-xs text-yellow-600 font-medium mt-1">Step {pendingStep.stepNum} ({pendingStep.label}) has been submitted and is pending verification.</p>
                                                </div>
                                            );
                                        } else if (assistanceRequest.status === 'Finalized') {
                                            return (
                                                <div className="bg-green-50 p-6 rounded-3xl border border-green-200 text-center">
                                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                        <CheckCircle2 size={28} />
                                                    </div>
                                                    <p className="text-sm text-green-800 font-black uppercase tracking-widest">Application Approved!</p>
                                                    <p className="text-xs text-green-600 font-medium mt-2">Your assistance has been fully verified and approved. Congratulations!</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                            {/* Right: History Log */}
                            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                                <h4 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                    <History size={18} className="text-primary-main" /> Activity Log
                                </h4>
                                <div className="space-y-6 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                                    {assistanceRequest.history?.slice().reverse().map((log: any, i: number) => (
                                        <div key={i} className="flex gap-4 relative">
                                            {i !== assistanceRequest.history.length - 1 && <div className="absolute left-2.5 top-6 w-[2px] h-full bg-gray-100"></div>}
                                            <div className="w-5 h-5 rounded-full bg-primary-main/20 flex items-center justify-center flex-shrink-0 z-10">
                                                <div className="w-2 h-2 rounded-full bg-primary-main"></div>
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="text-xs font-black text-gray-800 uppercase tracking-tight leading-none">{log.action}</p>
                                                <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">"{log.note}"</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="py-32 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8 shadow-xl">
                        <Wallet size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">No Active Support Journey</h3>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto font-medium">Initialize a support journey to start the step-by-step profiling for scholarships, grants, or crisis assistance.</p>
                </div>
            )}
        </motion.div>
    );
};

export default GrantsTab;
