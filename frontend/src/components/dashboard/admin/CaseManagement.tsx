import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, ChevronRight, X, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';



const CaseManagement: React.FC = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showMentalDropdown, setShowMentalDropdown] = useState(false);
    const [showPhysicalDropdown, setShowPhysicalDropdown] = useState(false);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [newCase, setNewCase] = useState({
        studentId: '',
        title: '',
        category: 'Physical',
        intakeForm: { facts: '', verdict: '' },
        referralTracking: { behaviorStatus: 'Normal', latestStatusMental: 'Stable', latestStatusPhysical: 'Healthy' }
    });

    const fetchCases = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const { data } = await axios.get('/api/cases', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setCases(data);
        } catch (error) {
            console.error("Error fetching cases", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const { data } = await axios.get('/api/auth/students', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students", error);
        }
    };

    useEffect(() => {
        fetchCases();
        fetchStudents();
    }, []);

    const handleCreateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.post('/api/cases', newCase, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setShowCreateModal(false);
            fetchCases();
            toast.success("New profiling case file created.");
            setNewCase({
                studentId: '',
                title: '',
                category: 'Physical',
                intakeForm: { facts: '', verdict: '' },
                referralTracking: { behaviorStatus: 'Normal', latestStatusMental: 'Stable', latestStatusPhysical: 'Healthy' }
            });
        } catch (error: any) {
            console.error("Error creating case", error);
            toast.error(error.response?.data?.message || "Failed to create case.");
        }
    };

    const handleUpdateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            await axios.patch(`/api/cases/${selectedCase._id}/referral`, {
                latestStatusMental: selectedCase.referralTracking.latestStatusMental,
                latestStatusPhysical: selectedCase.referralTracking.latestStatusPhysical
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setShowViewModal(false);
            fetchCases();
            toast.success("Case tracking status updated.");
        } catch (error: any) {
            console.error("Error updating case", error);
            toast.error(error.response?.data?.message || "Failed to update case.");
        }
    };

    return (
        <motion.div key="cases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Case Management</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">Intake, tracking, and monitoring of student incidents.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary-main text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
                    <Plus size={20} /> Open New Profiling Case
                </button>
            </div>

            {/* Case List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Case Files...</p>
                    </div>
                ) : cases.length > 0 ? (
                    cases.map((c) => (
                        <motion.div
                            whileHover={{ y: -5 }}
                            key={c._id}
                            className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group border-b-[6px] border-b-gray-100 hover:border-b-primary-main transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-colors group-hover:bg-primary-50"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.category === 'Physical' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {c.category} Case
                                    </div>
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        Ref: {c._id.substring(c._id.length - 8)}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-primary-main transition-colors uppercase tracking-tight">{c.title}</h3>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-full bg-primary-main text-white flex items-center justify-center font-bold text-xs uppercase">
                                        {c.student?.firstName[0]}{c.student?.lastName[0]}
                                    </div>
                                    <p className="font-extrabold text-gray-700 text-sm">
                                        {c.student?.firstName} {c.student?.lastName}
                                        <span className="text-[10px] text-gray-400 ml-2 font-black uppercase tracking-widest">ID: {c.student?.studentProfile?.studentId || 'N/A'}</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Behavior</p>
                                        <p className="text-[10px] font-black text-gray-800">{c.referralTracking?.behaviorStatus}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Mental</p>
                                        <p className={`text-[10px] font-black ${c.referralTracking?.latestStatusMental === 'Stable' ? 'text-green-600' : 'text-red-500'}`}>{c.referralTracking?.latestStatusMental}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Physical</p>
                                        <p className="text-[10px] font-black text-gray-800">{c.referralTracking?.latestStatusPhysical || 'Healthy'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Opened {new Date(c.createdAt).toLocaleDateString()}</p>
                                    <button
                                        onClick={() => {
                                            setSelectedCase(c);
                                            setShowViewModal(true);
                                        }}
                                        className="flex items-center gap-2 text-primary-main font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-50 px-4 py-2 rounded-xl transition-all"
                                    >
                                        Track Progress <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 text-center">
                        <Shield className="text-gray-200 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No cases registered</h3>
                        <p className="text-gray-400 mt-2 font-medium">Active profiling and intervention logs will appear here.</p>
                    </div>
                )}
            </div>

            {/* Create Case Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">OPEN CASE FILE</h2>
                            <p className="text-gray-500 font-medium mb-8 italic">Initiate a official profiling and monitoring record.</p>

                            <form onSubmit={handleCreateCase} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Student</label>
                                        <select
                                            required
                                            value={newCase.studentId}
                                            onChange={(e) => setNewCase({ ...newCase, studentId: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                        >
                                            <option value="">Select Student...</option>
                                            {students.map(s => (
                                                <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.studentProfile?.studentId || 'No ID'})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Case Title</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Behavioral Incident"
                                                value={newCase.title}
                                                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Classification</label>
                                            <select
                                                value={newCase.category}
                                                onChange={(e) => setNewCase({ ...newCase, category: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800"
                                            >
                                                <option value="Physical">Physical</option>
                                                <option value="Mental">Mental</option>
                                                <option value="Academic">Academic</option>
                                                <option value="Financial">Financial</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Case Facts & Intake Details</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newCase.intakeForm.facts}
                                            onChange={(e) => setNewCase({ ...newCase, intakeForm: { ...newCase.intakeForm, facts: e.target.value } })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 resize-none"
                                            placeholder="Descriptive facts of the initial interview/observation..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Initial Verification Verdict</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={newCase.intakeForm.verdict}
                                            onChange={(e) => setNewCase({ ...newCase, intakeForm: { ...newCase.intakeForm, verdict: e.target.value } })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-main focus:bg-white transition-all font-bold text-gray-800 resize-none"
                                            placeholder="Final summary of the intake session..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 py-5 bg-primary-main text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">Initialize Case File</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View/Update Tracking Modal */}
            <AnimatePresence>
                {showViewModal && selectedCase && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[3rem] p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <button onClick={() => setShowViewModal(false)} className="absolute top-10 right-10 text-gray-400 hover:text-red-500 transition-colors"><X size={28} /></button>

                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Left Side: Case Info */}
                                <div className="flex-1 space-y-8">
                                    <div>
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-primary-100 text-primary-main`}>
                                            Ref: {selectedCase._id}
                                        </div>
                                        <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight">{selectedCase.title}</h2>
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-main text-white flex items-center justify-center font-bold text-sm shadow-lg">
                                                {selectedCase.student?.firstName[0]}{selectedCase.student?.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-gray-800">{selectedCase.student?.firstName} {selectedCase.student?.lastName}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Student Portal Identifier: {selectedCase.student?._id}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <h4 className="text-[10px] font-black text-primary-main uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Eye size={14} /> Official Intake Facts
                                            </h4>
                                            <p className="text-gray-700 font-medium leading-relaxed italic">"{selectedCase.intakeForm?.facts}"</p>
                                        </div>

                                        <div className="p-6 bg-primary-50/30 rounded-[2rem] border border-primary-100">
                                            <h4 className="text-[10px] font-black text-primary-main uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Shield size={14} /> Intake Verdict
                                            </h4>
                                            <p className="text-gray-900 font-black leading-relaxed">"{selectedCase.intakeForm?.verdict}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Dynamic Tracking Update */}
                                <form onSubmit={handleUpdateCase} className="w-full md:w-80 space-y-6 bg-gray-50/50 p-8 rounded-[3rem] border border-gray-100">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">Referral Tracking</h3>

                                        <div className="space-y-6">
                                            <div className="space-y-2 relative">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mental Wellbeing</label>
                                                <div
                                                    onClick={() => setShowMentalDropdown(!showMentalDropdown)}
                                                    className={`w-full px-5 py-4 bg-white border-2 border-transparent rounded-2xl cursor-pointer flex items-center justify-between font-bold text-sm transition-all shadow-sm
                                                        ${selectedCase.referralTracking?.latestStatusMental === 'Stable' ? 'text-green-600 hover:border-green-200' :
                                                            selectedCase.referralTracking?.latestStatusMental === 'In Session' ? 'text-blue-600 hover:border-blue-200' :
                                                                'text-red-500 hover:border-red-200'
                                                        }`}
                                                >
                                                    {selectedCase.referralTracking?.latestStatusMental || 'Stable'}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                {showMentalDropdown && (
                                                    <ul className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                                                        {['Stable', 'High Stress', 'Crisis Mode', 'Depressive', 'Anxious', 'In Session'].map((status) => (
                                                            <li
                                                                key={status}
                                                                onClick={() => {
                                                                    setSelectedCase({ ...selectedCase, referralTracking: { ...selectedCase.referralTracking, latestStatusMental: status } });
                                                                    setShowMentalDropdown(false);
                                                                }}
                                                                className={`px-5 py-3 cursor-pointer font-bold transition-colors
                                                                    ${status === 'Stable' ? 'hover:bg-green-50 text-green-700' : ''}
                                                                    ${status === 'Crisis Mode' ? 'hover:bg-red-50 text-red-700' : ''}
                                                                    ${status === 'In Session' ? 'hover:bg-blue-50 text-blue-700' : ''}
                                                                    ${(selectedCase.referralTracking?.latestStatusMental || 'Stable') === status ? 'bg-gray-100' : 'text-gray-800'}
                                                                `}
                                                            >
                                                                {status}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="space-y-2 relative">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Status</label>
                                                <div
                                                    onClick={() => setShowPhysicalDropdown(!showPhysicalDropdown)}
                                                    className={`w-full px-5 py-4 bg-white border-2 border-transparent rounded-2xl cursor-pointer flex items-center justify-between font-bold text-sm transition-all shadow-sm
                                                        ${selectedCase.referralTracking?.latestStatusPhysical === 'Healthy' ? 'text-green-600 hover:border-green-200' :
                                                            selectedCase.referralTracking?.latestStatusPhysical === 'Needs Assistance' ? 'text-orange-600 hover:border-orange-200' :
                                                                'text-gray-700 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {selectedCase.referralTracking?.latestStatusPhysical || 'Healthy'}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                {showPhysicalDropdown && (
                                                    <ul className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                                                        {['Healthy', 'Injured', 'Recovering', 'Needs Assistance'].map((status) => (
                                                            <li
                                                                key={status}
                                                                onClick={() => {
                                                                    setSelectedCase({ ...selectedCase, referralTracking: { ...selectedCase.referralTracking, latestStatusPhysical: status } });
                                                                    setShowPhysicalDropdown(false);
                                                                }}
                                                                className={`px-5 py-3 cursor-pointer font-bold transition-colors
                                                                    ${status === 'Healthy' ? 'hover:bg-green-50 text-green-700' : ''}
                                                                    ${status === 'Injured' ? 'hover:bg-red-50 text-red-700' : ''}
                                                                    ${status === 'Recovering' ? 'hover:bg-yellow-50 text-yellow-700' : ''}
                                                                    ${status === 'Needs Assistance' ? 'hover:bg-orange-50 text-orange-700' : ''}
                                                                    ${(selectedCase.referralTracking?.latestStatusPhysical || 'Healthy') === status ? 'bg-gray-100' : 'text-gray-800'}
                                                                `}
                                                            >
                                                                {status}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 pt-4">
                                        <button type="submit" className="w-full py-5 bg-primary-main text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">Update & Notify</button>
                                        <button type="button" onClick={() => setShowViewModal(false)} className="w-full py-5 bg-white text-gray-500 rounded-2xl font-black text-xs border border-gray-100 hover:bg-gray-100 transition-all uppercase tracking-widest">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CaseManagement;
