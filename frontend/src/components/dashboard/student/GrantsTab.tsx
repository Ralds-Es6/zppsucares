import React from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, BadgePercent, ClipboardCheck, Clock, CheckCircle2, 
    History, AlertCircle, FileText, Calendar, User, GraduationCap
} from 'lucide-react';

interface GrantsTabProps {
    assistanceRequest: any;
    startAssistanceJourney: (type: string) => void;
}

const GrantsTab: React.FC<GrantsTabProps> = ({
    assistanceRequest,
    startAssistanceJourney
}) => {
    return (
        <motion.div
            key="grants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <section className="glass p-5 sm:p-8 md:p-10 rounded-3xl sm:rounded-[3rem] border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/20 rounded-bl-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">Scholarships & Grants</h2>
                        <p className="text-sm sm:text-base text-gray-500 font-medium">Unified submission and tracking for student financial assistance.</p>
                    </div>
                    {assistanceRequest && (
                        <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-primary-50 rounded-2xl border border-primary-100">
                            <div className="w-10 h-10 bg-primary-main text-white rounded-xl flex items-center justify-center animate-pulse">
                                <BadgePercent size={20} />
                            </div>
                            <div className="pr-4 border-r border-primary-100">
                                <p className="text-[10px] font-black text-primary-main uppercase tracking-widest">Active Application</p>
                                <p className="font-bold text-gray-800 text-sm">{assistanceRequest.type}</p>
                            </div>
                            <div className="pl-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                <p className={`font-black text-sm uppercase ${
                                    assistanceRequest.status === 'Approved' ? 'text-green-600' :
                                    assistanceRequest.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                                }`}>{assistanceRequest.status}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {assistanceRequest ? (
                <div className="space-y-8">
                    {/* 3-Stage Progress Timeline */}
                    <section className="glass p-10 rounded-[3rem] border border-white/20 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center justify-between mb-12 max-w-4xl mx-auto">
                            {[
                                { 
                                    id: 1, 
                                    label: 'Submitted', 
                                    icon: ClipboardCheck, 
                                    status: 'Verified',
                                    subtext: 'Application Received'
                                },
                                { 
                                    id: 2, 
                                    label: 'Evaluation', 
                                    icon: Clock, 
                                    status: assistanceRequest.status === 'Pending Review' ? 'In Progress' : 'Verified',
                                    subtext: assistanceRequest.status === 'Pending Review' ? 'Under Review' : 'Review Complete'
                                },
                                { 
                                    id: 3, 
                                    label: 'Decision', 
                                    icon: CheckCircle2, 
                                    status: assistanceRequest.status === 'Approved' ? 'Verified' : 
                                            assistanceRequest.status === 'Rejected' ? 'Rejected' : 'Locked',
                                    subtext: assistanceRequest.status === 'Approved' ? 'Approved' :
                                             assistanceRequest.status === 'Rejected' ? 'Rejected' : 'Awaiting Review'
                                }
                            ].map((step, index, arr) => (
                                <div key={step.id} className="flex-1 flex flex-col items-center relative group">
                                    {index !== arr.length - 1 && (
                                        <div className={`absolute left-1/2 top-6 w-full h-[3px] -z-10 transition-colors duration-500 ${
                                            step.status === 'Verified' ? 'bg-green-500' : 'bg-gray-100'
                                        }`}></div>
                                    )}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300 relative ${
                                        step.status === 'Verified' ? 'bg-green-500 text-white' :
                                        step.status === 'In Progress' ? 'bg-yellow-500 text-white animate-pulse' :
                                        step.status === 'Rejected' ? 'bg-red-500 text-white animate-bounce' : 'bg-gray-100 text-gray-300'
                                    }`}>
                                        <step.icon size={24} />
                                    </div>
                                    <p className={`mt-4 font-black uppercase tracking-widest text-[9px] ${
                                        step.status === 'Verified' ? 'text-green-600' :
                                        step.status === 'In Progress' ? 'text-yellow-600' :
                                        step.status === 'Rejected' ? 'text-red-600' : 'text-gray-400'
                                    }`}>{step.label}</p>
                                    <p className="text-[8px] font-bold text-gray-400 mt-0.5">{step.subtext}</p>
                                </div>
                            ))}
                        </div>

                        {/* Details Grid & Feedback Box */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Left: Socio-Economic Profile */}
                            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                                <h4 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                    <User size={18} className="text-primary-main" /> Economic Background
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Monthly Income</p>
                                        <p className="font-extrabold text-gray-800 text-sm">{assistanceRequest.householdIncome}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Parent Occupation</p>
                                        <p className="font-extrabold text-gray-800 text-sm">{assistanceRequest.parentOccupation}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Number of Dependents</p>
                                        <p className="font-extrabold text-gray-800 text-sm">{assistanceRequest.numberOfDependents} members</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">GPA / Grade Average</p>
                                        <p className="font-extrabold text-primary-main text-sm">{assistanceRequest.gpa}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Submitted Documents */}
                            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                                <h4 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText size={18} className="text-primary-main" /> Verifying Documentation
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Document Type</p>
                                        <p className="font-extrabold text-gray-800 text-sm">{assistanceRequest.documentType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reference / Control No.</p>
                                        <p className="font-mono font-extrabold text-gray-800 text-sm">{assistanceRequest.documentReference}</p>
                                    </div>
                                    {assistanceRequest.additionalDocs && (
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Additional Notes</p>
                                            <p className="text-xs text-gray-600 font-medium mt-1 italic">"{assistanceRequest.additionalDocs}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Interview Preference & Decision */}
                            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                        <Calendar size={18} className="text-primary-main" /> Schedule & Priority
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Proposed Interview</p>
                                            <p className="font-extrabold text-gray-800 text-sm">
                                                {new Date(assistanceRequest.availableDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Priority</p>
                                            <p className="font-mono font-extrabold text-gray-800 text-sm">{assistanceRequest.contactNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decision Action Area */}
                                <div className="mt-8">
                                    {assistanceRequest.status === 'Pending Review' && (
                                        <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-center">
                                            <p className="text-xs text-yellow-800 font-bold">Awaiting Evaluation</p>
                                            <p className="text-[10px] text-yellow-600 mt-1">Our coordinators are currently reviewing your documents.</p>
                                        </div>
                                    )}
                                    {assistanceRequest.status === 'Approved' && (
                                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                                            <p className="text-xs text-green-800 font-black uppercase tracking-widest">Approved</p>
                                            <p className="text-[10px] text-green-600 mt-1">Check your dashboard notification for orientation details.</p>
                                        </div>
                                    )}
                                    {assistanceRequest.status === 'Rejected' && (
                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                                            <p className="text-xs text-red-800 font-black uppercase tracking-widest">Rejected</p>
                                            <p className="text-[10px] text-red-600 mt-1">You may view the evaluation note below for details.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Admin Feedback Box */}
                        {assistanceRequest.adminNote && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-start gap-4">
                                <AlertCircle size={20} className="text-primary-main mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Administrator Evaluation Remarks</p>
                                    <p className="text-sm text-gray-600 font-medium mt-2 italic">"{assistanceRequest.adminNote}"</p>
                                </div>
                            </div>
                        )}

                        {/* Activity History Log */}
                        <div className="mt-8 p-8 bg-gray-50/30 rounded-[2.5rem] border border-gray-100/50">
                            <h4 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                <History size={18} className="text-primary-main" /> Application Logs
                            </h4>
                            <div className="space-y-6 overflow-y-auto max-h-[200px] custom-scrollbar pr-2">
                                {assistanceRequest.history?.slice().reverse().map((log: any, i: number) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== assistanceRequest.history.length - 1 && <div className="absolute left-2.5 top-6 w-[2px] h-full bg-gray-100"></div>}
                                        <div className="w-5 h-5 rounded-full bg-primary-main/20 flex items-center justify-center flex-shrink-0 z-10">
                                            <div className="w-2 h-2 rounded-full bg-primary-main"></div>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight leading-none">{log.action}</p>
                                            <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">"{log.note}"</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { type: 'Academic Scholarship', icon: GraduationCap, desc: 'For students with outstanding academic performance.', color: 'accent' },
                        { type: 'Student Grant', icon: Wallet, desc: 'Financial support based on socio-economic need.', color: 'primary' },
                        { type: 'Emergency Assistance', icon: AlertCircle, desc: 'Immediate support for crises or medical emergencies.', color: 'danger' }
                    ].map((opt) => (
                        <div key={opt.type} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                            <div>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${
                                    opt.color === 'accent' ? 'text-accent-main bg-accent-light/30 border-accent-light' :
                                    opt.color === 'primary' ? 'text-primary-main bg-primary-light border-primary-500/10' :
                                    'text-red-500 bg-red-50 border-red-100'
                                }`}>
                                    <opt.icon size={28} />
                                </div>
                                <h3 className="text-base font-black text-gray-900 leading-tight uppercase mb-2">{opt.type}</h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{opt.desc}</p>
                            </div>
                            <button
                                onClick={() => startAssistanceJourney(opt.type)}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] mt-8 transition-all ${
                                    opt.color === 'accent' ? 'bg-accent-main hover:brightness-95 text-white shadow-lg shadow-accent-main/20' :
                                    opt.color === 'primary' ? 'bg-primary-main hover:bg-primary-800 text-white shadow-lg shadow-primary-main/20' :
                                    'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                                }`}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default GrantsTab;
