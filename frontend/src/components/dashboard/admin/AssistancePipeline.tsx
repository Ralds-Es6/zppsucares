import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, HandHelping, User, FileText, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { authStorage } from '../../../utils/authStorage';

export interface AssistanceApplication {
    _id: string;
    student?: {
        _id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        studentProfile?: {
            studentId?: string;
            course?: string;
            yearLevel?: number | string;
            section?: string;
        };
    };
    type?: string;
    householdIncome?: string;
    parentOccupation?: string;
    numberOfDependents?: number | string;
    gpa?: string;
    documentType?: string;
    documentReference?: string;
    additionalDocs?: string;
    availableDate?: string;
    contactNumber?: string;
    additionalNotes?: string;
    status: string;
    adminNote?: string;
    createdAt?: string;
}

const AssistancePipeline: React.FC = () => {
    const [assistanceRequests, setAssistanceRequests] = useState<AssistanceApplication[]>([]);
    const [selectedAssistance, setSelectedAssistance] = useState<AssistanceApplication | null>(null);
    const [assistanceAdminNote, setAssistanceAdminNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchAssistanceRequests = async () => {
        try {
            const userInfo = authStorage.getAdmin() || {};
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

    const handleReviewApplication = async (requestId: string, status: string) => {
        try {
            const userInfo = authStorage.getAdmin() || {};
            await axios.put('/api/assistance/review', {
                requestId, status, adminNote: assistanceAdminNote
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            toast.success(`Application has been successfully marked as ${status}!`);
            setAssistanceAdminNote('');
            setSelectedAssistance(null);
            fetchAssistanceRequests();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to evaluate application.');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    // Helper to calculate basic prioritization priority based on income string
    const getPriorityBracket = (incomeStr?: string) => {
        if (!incomeStr) return { label: 'Standard Bracket', color: 'bg-gray-100 text-gray-700' };
        const cleanVal = parseInt(incomeStr.replace(/[^0-9]/g, ''), 10);
        if (isNaN(cleanVal)) return { label: 'Needs Evaluation', color: 'bg-yellow-100 text-yellow-700' };
        
        if (cleanVal <= 15000) return { label: 'High Financial Need', color: 'bg-purple-100 text-purple-700' };
        if (cleanVal <= 30000) return { label: 'Moderate Financial Need', color: 'bg-blue-100 text-blue-700' };
        return { label: 'Standard Income Bracket', color: 'bg-gray-100 text-gray-700' };
    };

    if (selectedAssistance) {
        const bracket = getPriorityBracket(selectedAssistance.householdIncome);
        return (
            <motion.div key="assist-review" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8 pb-20">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button onClick={() => setSelectedAssistance(null)} className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-main hover:border-primary-main/20 hover:bg-primary-50 transition-all shadow-sm">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">APPLICATION EVALUATION</h2>
                        <p className="text-gray-500 font-medium italic mt-1">
                            Applicant: <span className="text-primary-main font-black not-italic">{selectedAssistance.student?.firstName} {selectedAssistance.student?.lastName}</span>
                        </p>
                    </div>
                </div>

                {/* Main Evaluation Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Panel 1: Socio-Economic Profile */}
                    <div className="p-8 glass-slab rounded-[2.5rem] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-main border border-primary-100 shadow-sm">
                                    <User size={22} />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-gray-900 uppercase">Socio-Economic</h4>
                                    <p className="text-xs text-gray-400">Financial profile verification</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Household Income</span>
                                    <span className="font-black text-gray-900 text-base">{selectedAssistance.householdIncome}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Parent Occupation</span>
                                    <span className="font-black text-gray-900 text-base">{selectedAssistance.parentOccupation}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Dependents</span>
                                    <span className="font-black text-gray-900 text-base">{selectedAssistance.numberOfDependents} members</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Grade GPA</span>
                                    <span className="font-black text-primary-main text-base">{selectedAssistance.gpa}</span>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Priority Badge */}
                        <div className={`mt-8 p-4 rounded-2xl text-xs font-black uppercase text-center tracking-widest border ${bracket.color}`}>
                            {bracket.label}
                        </div>
                    </div>

                    {/* Panel 2: Documentation Detail */}
                    <div className="p-8 glass-slab rounded-[2.5rem]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-main border border-primary-100 shadow-sm">
                                <FileText size={22} />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 uppercase">Documents</h4>
                                <p className="text-xs text-gray-400">Supporting attachments & reference</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Primary Certificate</span>
                                <span className="font-black text-gray-900 text-base">{selectedAssistance.documentType}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Reference / Control No.</span>
                                <span className="font-mono font-black text-gray-900 text-base">{selectedAssistance.documentReference}</span>
                            </div>
                            {selectedAssistance.additionalDocs && (
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-4">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Additional Documentation Note</span>
                                    <span className="text-xs text-gray-600 font-medium italic">"{selectedAssistance.additionalDocs}"</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel 3: Verification Prefs & Log */}
                    <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-main border border-primary-100 shadow-sm">
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-gray-900 uppercase">Verification Prefs</h4>
                                    <p className="text-xs text-gray-400">Interviews and scheduling</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Available Interview Date</span>
                                    <span className="font-black text-gray-900 text-base">
                                        {selectedAssistance.availableDate ? new Date(selectedAssistance.availableDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Direct Contact Priority</span>
                                    <span className="font-mono font-black text-gray-900 text-base">{selectedAssistance.contactNumber}</span>
                                </div>
                                {selectedAssistance.additionalNotes && (
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-4">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Applicant Remarks</span>
                                        <span className="text-xs text-gray-600 font-medium italic">"{selectedAssistance.additionalNotes}"</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl text-xs font-black uppercase text-center tracking-widest border ${getStatusStyle(selectedAssistance.status)}`}>
                            Global Status: {selectedAssistance.status}
                        </div>
                    </div>
                </div>

                {/* Previous Logs Display */}
                {selectedAssistance.adminNote && (
                    <div className="p-6 bg-yellow-50 rounded-4xl border border-yellow-100 flex items-start gap-4">
                        <AlertCircle size={20} className="text-yellow-600 mt-1 shrink-0" />
                        <div>
                            <p className="text-xs font-black text-yellow-800 uppercase tracking-widest">Active Evaluation Note Logged</p>
                            <p className="text-sm text-yellow-700 font-medium mt-2 italic">"{selectedAssistance.adminNote}"</p>
                        </div>
                    </div>
                )}

                {/* Evaluation Action Panel (Actionable when Pending Review) */}
                {selectedAssistance.status === 'Pending Review' ? (
                    <div className="p-10 glass-slab rounded-[3rem] space-y-6">
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-tight text-xl">Review Decision & Feedback</h4>
                            <p className="text-xs text-gray-400 mt-1">Please provide evaluation remarks. Your decision triggers notifications and updates the student's status.</p>
                        </div>

                        <textarea
                            placeholder="Write administrative review remarks (required for rejection, optional for approval)..."
                            value={assistanceAdminNote}
                            onChange={(e) => setAssistanceAdminNote(e.target.value)}
                            rows={4}
                            className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-primary-main rounded-4xl text-sm outline-none transition-all resize-none font-bold text-gray-800"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleReviewApplication(selectedAssistance._id, 'Approved')}
                                className="flex-1 py-5 bg-green-500 text-white rounded-4xl font-black text-xs uppercase tracking-widest hover:bg-green-600 hover:shadow-2xl hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} /> Approve Full Application
                            </button>
                            <button
                                onClick={() => {
                                    if (!assistanceAdminNote.trim()) {
                                        toast.warning("Please provide evaluation remarks to justify rejection.");
                                        return;
                                    }
                                    handleReviewApplication(selectedAssistance._id, 'Rejected');
                                }}
                                className="flex-1 py-5 bg-red-500 text-white rounded-4xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:shadow-2xl hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle size={18} /> Reject Application
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100/50 text-center">
                        <p className="text-gray-400 font-extrabold text-sm uppercase tracking-wider">Evaluation Completed. This application is locked.</p>
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Assistance Tracker</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base lg:text-lg mt-1 italic">Managing scholarship and financial aid applications.</p>
                </div>
            </div>

            <div className="glass-slab rounded-3xl sm:rounded-[3rem] overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-8 py-6">Applicant</th>
                            <th className="px-8 py-6">Program</th>
                            <th className="px-8 py-6">Submitted Date</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
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
                                    <td className="px-8 py-6 font-bold text-gray-700 text-sm">
                                        {r.type}
                                    </td>
                                    <td className="px-8 py-6 text-gray-400 font-medium text-xs">
                                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(r.status)}`}>
                                            {r.status}
                                        </span>
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
                                <td colSpan={5} className="py-20 text-center">
                                    <HandHelping size={48} className="text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Active Applications</h3>
                                    <p className="text-gray-400 mt-2 font-medium">Scholarship and financial aid applications will appear here.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AssistancePipeline;
