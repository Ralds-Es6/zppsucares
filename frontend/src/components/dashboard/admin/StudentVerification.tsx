import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Search, CheckCircle2, XCircle, Clock, RefreshCw,
    FileText, IdCard, ExternalLink, ShieldCheck, AlertTriangle,
    Eye, ZoomIn, ZoomOut, Loader2, X, Check, User
} from 'lucide-react';
import VerifiedBadge from '../../common/VerifiedBadge';
import { authStorage } from '../../../utils/authStorage';

interface VerificationStudent {
    _id: string;
    studentId: string;
    department?: string;
    course: string;
    yearLevel: number;
    section: string;
    verificationStatus: 'pending' | 'approved' | 'declined';
    documents: {
        corUrl: string;
        idCardUrl: string;
        submittedAt: string;
    };
    verificationDetails?: {
        reviewedAt?: string;
        reviewedBy?: {
            firstName?: string;
            lastName?: string;
            email?: string;
        };
        declineReason?: string;
    };
    isResubmitted?: boolean;
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface VerificationCounts {
    total: number;
    pending: number;
    approved: number;
    declined: number;
    resubmitted: number;
}

interface DepartmentItem {
    _id: string;
    name: string;
    code: string;
}

interface StudentVerificationProps {
    onCountsUpdate?: (pendingCount: number) => void;
}

export const StudentVerification: React.FC<StudentVerificationProps> = ({ onCountsUpdate }) => {
    // Data states
    const [students, setStudents] = useState<VerificationStudent[]>([]);
    const [counts, setCounts] = useState<VerificationCounts>({
        total: 0,
        pending: 0,
        approved: 0,
        declined: 0,
        resubmitted: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [departments, setDepartments] = useState<DepartmentItem[]>([]);

    // Filters
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resubmitted' | 'approved' | 'declined'>('pending');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Inspection Modal states
    const [selectedStudent, setSelectedStudent] = useState<VerificationStudent | null>(null);
    const [activeDocTab, setActiveDocTab] = useState<'cor' | 'id'>('cor');
    const [zoomLevel, setZoomLevel] = useState(1);

    // Approval "CONFIRM" Modal states
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');
    const [isApproving, setIsApproving] = useState(false);

    // Decline Modal states
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [isDeclining, setIsDeclining] = useState(false);

    // Quick suggestion decline chips
    const declineSuggestions = [
        'Certificate of Registration (COR) is blurry or illegible.',
        'Submitted COR is outdated (requires current academic semester).',
        'Student ID does not match the registration name or ID number.',
        'Selected College / Course does not match the submitted COR.',
        'Invalid or expired Student ID Card.'
    ];

    // Fetch Departments for filter
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const { data } = await axios.get('/api/academic/departments');
                setDepartments(data);
            } catch (err) {
                console.error('Failed to load departments', err);
            }
        };
        fetchDepts();
    }, []);

    // Fetch Verifications from backend
    const fetchVerifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const userInfo = authStorage.getAdmin() || {};
            const token = userInfo.token;

            const params: Record<string, string | number | undefined> = {
                status: statusFilter,
                department: departmentFilter !== 'all' ? departmentFilter : undefined,
                yearLevel: yearFilter !== 'all' ? yearFilter : undefined,
                search: searchQuery.trim() || undefined
            };

            const { data } = await axios.get('/api/admin/verifications', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });

            setStudents(data.students || []);
            if (data.counts) {
                setCounts(data.counts);
                if (onCountsUpdate) {
                    onCountsUpdate(data.counts.pending || 0);
                }
            }
        } catch (err: unknown) {
            console.error('Failed to load verifications', err);
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Error loading registration requests');
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, departmentFilter, yearFilter, searchQuery, onCountsUpdate]);

    useEffect(() => {
        fetchVerifications();
    }, [fetchVerifications]);

    // Handle Approve (Only when input is CONFIRM)
    const handleApprove = async () => {
        if (!selectedStudent || confirmInput.trim() !== 'CONFIRM') return;

        setIsApproving(true);
        try {
            const userInfo = authStorage.getAdmin() || {};
            await axios.put(`/api/admin/verifications/${selectedStudent._id}/approve`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            toast.success(`Successfully verified and approved ${selectedStudent.user?.firstName}!`);
            setShowApproveModal(false);
            setConfirmInput('');
            setSelectedStudent(null);
            fetchVerifications();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to approve student');
        } finally {
            setIsApproving(false);
        }
    };

    // Handle Decline with reason
    const handleDecline = async () => {
        if (!selectedStudent || !declineReason.trim()) {
            toast.warning('Please provide a reason for declining the registration.');
            return;
        }

        setIsDeclining(true);
        try {
            const userInfo = authStorage.getAdmin() || {};
            await axios.put(`/api/admin/verifications/${selectedStudent._id}/decline`, {
                reason: declineReason.trim()
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            toast.info(`Registration declined for ${selectedStudent.user?.firstName}. Feedback sent.`);
            setShowDeclineModal(false);
            setDeclineReason('');
            setSelectedStudent(null);
            fetchVerifications();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to decline student');
        } finally {
            setIsDeclining(false);
        }
    };

    const isPdf = (url?: string) => {
        return url?.toLowerCase().endsWith('.pdf');
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Student Registration Verification
                        <span className="bg-primary-100 text-primary-main text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            GCTSO Gatekeeper
                        </span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Accurately verify university enrollment documents (COR & Student ID) before granting system access.
                    </p>
                </div>

                <button
                    onClick={fetchVerifications}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-colors shadow-2xs self-start sm:self-auto"
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh List
                </button>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                    onClick={() => setStatusFilter('pending')}
                    className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'pending' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-gray-100 hover:border-amber-200'}`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-700">Pending Review</span>
                        <Clock size={16} className="text-amber-500" />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{counts.pending}</span>
                </button>

                <button
                    onClick={() => setStatusFilter('resubmitted')}
                    className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'resubmitted' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400' : 'bg-white border-gray-100 hover:border-purple-200'}`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-700">Resubmitted</span>
                        <RefreshCw size={16} className="text-purple-500" />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{counts.resubmitted}</span>
                </button>

                <button
                    onClick={() => setStatusFilter('approved')}
                    className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'approved' ? 'bg-green-50 border-green-300 ring-2 ring-green-400' : 'bg-white border-gray-100 hover:border-green-200'}`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-green-700">Approved</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{counts.approved}</span>
                </button>

                <button
                    onClick={() => setStatusFilter('declined')}
                    className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'declined' ? 'bg-red-50 border-red-300 ring-2 ring-red-400' : 'bg-white border-gray-100 hover:border-red-200'}`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-red-700">Declined</span>
                        <XCircle size={16} className="text-red-500" />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{counts.declined}</span>
                </button>

                <button
                    onClick={() => setStatusFilter('all')}
                    className={`col-span-2 sm:col-span-1 p-4 rounded-2xl border text-left transition-all ${statusFilter === 'all' ? 'bg-gray-100 border-gray-300 ring-2 ring-gray-400' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-600">Total Records</span>
                        <ShieldCheck size={16} className="text-gray-400" />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{counts.total}</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search size={16} className="absolute inset-y-0 left-3.5 my-auto text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search student by name, student ID, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-main outline-none"
                    />
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Department Filter */}
                    <div className="relative">
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary-main outline-none cursor-pointer"
                        >
                            <option value="all">All Colleges / Depts</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept.code}>
                                    {dept.code} - {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Level Filter */}
                    <div className="relative">
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary-main outline-none cursor-pointer"
                        >
                            <option value="all">All Year Levels</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="glass-slab rounded-3xl overflow-hidden">
                {isLoading ? (
                    <div className="p-16 text-center text-gray-400">
                        <Loader2 size={32} className="animate-spin mx-auto text-primary-main mb-3" />
                        <p className="text-sm font-semibold">Loading registration applications...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-3">
                            <ShieldCheck size={32} />
                        </div>
                        <h4 className="text-base font-bold text-gray-700">No student registrations found</h4>
                        <p className="text-xs text-gray-400 mt-1">There are no records matching your current filter criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-black uppercase tracking-wider text-gray-400">
                                    <th className="py-4 px-6">Student Applicant</th>
                                    <th className="py-4 px-6">Academic Dossier</th>
                                    <th className="py-4 px-6">Submitted Documents</th>
                                    <th className="py-4 px-6">Verification Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {students.map((student) => {
                                    const user = student.user || { firstName: 'Unknown', lastName: 'User', email: '' };
                                    const status = student.verificationStatus;
                                    const isResubmitted = student.isResubmitted;

                                    return (
                                        <tr key={student._id} className="hover:bg-gray-50/60 transition-colors">
                                            {/* Student Applicant */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#87CEFA]/40 ring-3 ring-[#87CEFA]/25 shrink-0"
                                                        style={{ backgroundColor: '#87CEFA' }}
                                                    >
                                                        <User size={22} className="text-white drop-shadow-sm" strokeWidth={2.4} />
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                                                            {user.firstName} {user.lastName}
                                                            {status === 'approved' && <VerifiedBadge size="md" />}
                                                        </div>
                                                        <p className="text-xs text-gray-400">{user.email}</p>
                                                        <span className="text-[10px] font-mono text-gray-500 font-bold">
                                                            ID: {student.studentId}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Academic Dossier */}
                                            <td className="py-4 px-6">
                                                <div className="text-xs">
                                                    <span className="font-bold text-gray-800 block truncate max-w-55">
                                                        {student.course}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {student.department && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-semibold text-[10px]">
                                                                {student.department}
                                                            </span>
                                                        )}
                                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-[10px]">
                                                            Year {student.yearLevel} - Sec {student.section}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Submitted Documents */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {student.documents?.corUrl ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setActiveDocTab('cor');
                                                            }}
                                                            className="flex items-center gap-1 px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold border border-green-200 transition-colors"
                                                            title="Inspect COR"
                                                        >
                                                            <FileText size={13} /> COR
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-gray-400 italic">No COR</span>
                                                    )}

                                                    {student.documents?.idCardUrl ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setActiveDocTab('id');
                                                            }}
                                                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                                                            title="Inspect Student ID"
                                                        >
                                                            <IdCard size={13} /> ID Card
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-gray-400 italic">No ID</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Verification Status */}
                                            <td className="py-4 px-6">
                                                {status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-blue-50 text-[#1877F2] border border-blue-200 shadow-2xs">
                                                        <VerifiedBadge size="sm" /> Verified Student
                                                    </span>
                                                )}
                                                {status === 'pending' && !isResubmitted && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <Clock size={13} /> Awaiting Review
                                                    </span>
                                                )}
                                                {status === 'pending' && isResubmitted && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
                                                        <RefreshCw size={13} /> Resubmitted
                                                    </span>
                                                )}
                                                {status === 'declined' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                                                        <XCircle size={13} /> Declined
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setActiveDocTab('cor');
                                                        setZoomLevel(1);
                                                    }}
                                                    className="px-4 py-2 bg-primary-main hover:bg-primary-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 ml-auto"
                                                >
                                                    <Eye size={14} /> Review & Action
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* DOCUMENT INSPECTION & AUDIT DRAWER / MODAL */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                    <div className="glass-modal rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-main flex items-center justify-center font-bold text-sm">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2.5">
                                        Verification Dossier: {selectedStudent.user?.firstName} {selectedStudent.user?.lastName}
                                        {selectedStudent.verificationStatus === 'approved' && <VerifiedBadge size="md" />}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Student ID: <span className="font-mono font-bold text-gray-700">{selectedStudent.studentId}</span> · {selectedStudent.user?.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body (2 Columns: Left Dossier, Right Document Viewer) */}
                        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {/* Left Column: Academic & Status Info (5 Cols) */}
                            <div className="md:col-span-5 p-6 space-y-5 bg-gray-50/40">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Academic Program</h4>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-200/70 space-y-2.5 text-xs shadow-2xs">
                                        <div>
                                            <span className="text-gray-400 block text-[10px]">Course / Degree</span>
                                            <span className="font-bold text-gray-900 text-sm leading-tight block">{selectedStudent.course}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">College</span>
                                                <span className="font-bold text-gray-800">{selectedStudent.department || 'Not specified'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Year & Section</span>
                                                <span className="font-bold text-gray-800">Year {selectedStudent.yearLevel} - {selectedStudent.section}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Current Verification Status</h4>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-200/70 space-y-2 text-xs shadow-2xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Status</span>
                                            <span className="font-bold capitalize">{selectedStudent.verificationStatus}</span>
                                        </div>
                                        {selectedStudent.isResubmitted && (
                                            <div className="flex items-center justify-between text-purple-700 font-bold">
                                                <span>Application Update</span>
                                                <span className="bg-purple-100 px-2 py-0.5 rounded-full text-[10px]">Resubmitted by Student</span>
                                            </div>
                                        )}
                                        {selectedStudent.verificationDetails?.declineReason && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <span className="text-[10px] text-red-600 font-bold block mb-1">Previous Decline Feedback:</span>
                                                <p className="text-xs text-gray-700 italic bg-red-50/70 p-2.5 rounded-xl border border-red-100">
                                                    "{selectedStudent.verificationDetails.declineReason}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Document Selectors */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Switch Document to Inspect</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => { setActiveDocTab('cor'); setZoomLevel(1); }}
                                            className={`p-3 rounded-xl border text-left font-bold text-xs flex items-center justify-between transition-all ${activeDocTab === 'cor' ? 'bg-primary-50 border-primary-main text-primary-main' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <span className="flex items-center gap-1.5"><FileText size={15} /> COR</span>
                                            {selectedStudent.documents?.corUrl && <Check size={14} className="text-green-600" />}
                                        </button>

                                        <button
                                            onClick={() => { setActiveDocTab('id'); setZoomLevel(1); }}
                                            className={`p-3 rounded-xl border text-left font-bold text-xs flex items-center justify-between transition-all ${activeDocTab === 'id' ? 'bg-primary-50 border-primary-main text-primary-main' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <span className="flex items-center gap-1.5"><IdCard size={15} /> Student ID</span>
                                            {selectedStudent.documents?.idCardUrl && <Check size={14} className="text-green-600" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Interactive Document Viewer (7 Cols) */}
                            <div className="md:col-span-7 p-6 flex flex-col bg-gray-900 text-white min-h-105">
                                {/* Viewer Controls Bar */}
                                <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-xs">
                                    <span className="font-bold flex items-center gap-1.5 text-gray-300">
                                        {activeDocTab === 'cor' ? <FileText size={15} className="text-primary-400" /> : <IdCard size={15} className="text-primary-400" />}
                                        {activeDocTab === 'cor' ? 'Certificate of Registration (COR)' : 'Official Student ID Card'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut size={14} />
                                        </button>
                                        <span className="text-[11px] font-mono font-bold text-gray-400 px-1">{Math.round(zoomLevel * 100)}%</span>
                                        <button
                                            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                                            title="Zoom In"
                                        >
                                            <ZoomIn size={14} />
                                        </button>
                                        {((activeDocTab === 'cor' ? selectedStudent.documents?.corUrl : selectedStudent.documents?.idCardUrl)) && (
                                            <a
                                                href={activeDocTab === 'cor' ? selectedStudent.documents?.corUrl : selectedStudent.documents?.idCardUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                <ExternalLink size={12} /> Open Full Tab
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Preview Canvas */}
                                <div className="flex-1 flex items-center justify-center p-4 overflow-auto min-h-90 relative">
                                    {(() => {
                                        const docUrl = activeDocTab === 'cor'
                                            ? selectedStudent.documents?.corUrl
                                            : selectedStudent.documents?.idCardUrl;

                                        if (!docUrl) {
                                            return (
                                                <div className="text-center text-gray-500">
                                                    <AlertTriangle size={36} className="mx-auto mb-2 text-gray-600" />
                                                    <p className="text-xs font-bold">No document uploaded for this slot</p>
                                                </div>
                                            );
                                        }

                                        if (isPdf(docUrl)) {
                                            return (
                                                <div className="w-full h-full min-h-95 bg-white rounded-xl overflow-hidden shadow-lg">
                                                    <iframe
                                                        src={`${docUrl}#toolbar=0`}
                                                        title="PDF Document Viewer"
                                                        className="w-full h-full min-h-95 border-0"
                                                    />
                                                </div>
                                            );
                                        }

                                        return (
                                            <img
                                                src={docUrl}
                                                alt="Verification Document"
                                                style={{ transform: `scale(${zoomLevel})` }}
                                                className="max-h-95 max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-200 select-none"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer / Action Toolbar */}
                        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between gap-3">
                            <div className="text-xs text-gray-400">
                                Reviewed records receive official GCTSO certification and audit timestamps.
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setDeclineReason('');
                                        setShowDeclineModal(true);
                                    }}
                                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                                >
                                    <XCircle size={15} /> Decline Application
                                </button>

                                <button
                                    onClick={() => {
                                        setConfirmInput('');
                                        setShowApproveModal(true);
                                    }}
                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={15} /> Approve Registration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SAFETY GUARD: APPROVE MODAL (TYPE "CONFIRM") */}
            {showApproveModal && selectedStudent && (
                <div className="fixed inset-0 z-60 bg-gray-900/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="glass-modal rounded-3xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-green-100 shadow-2xs">
                            <ShieldCheck size={32} />
                        </div>

                        <h3 className="text-xl font-black text-gray-900 text-center tracking-tight mb-2">
                            Final Approval Confirmation
                        </h3>
                        <p className="text-gray-500 text-xs text-center leading-relaxed mb-6">
                            You are about to officially verify and grant active student portal access to{' '}
                            <strong className="text-gray-900">{selectedStudent.user?.firstName} {selectedStudent.user?.lastName}</strong>{' '}
                            (Student ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-800">{selectedStudent.studentId}</code>).
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                            <label className="block text-xs font-bold text-amber-900 mb-1.5">
                                Safety Guard: Please type <span className="font-mono text-primary-main font-black">CONFIRM</span> to verify:
                            </label>
                            <input
                                type="text"
                                autoFocus
                                value={confirmInput}
                                onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && confirmInput.trim() === 'CONFIRM') {
                                        handleApprove();
                                    }
                                }}
                                placeholder="Type CONFIRM"
                                className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl font-mono text-center font-black tracking-widest text-gray-900 uppercase focus:ring-2 focus:ring-green-500 outline-none text-base"
                            />
                            <p className="text-[10px] text-amber-700 mt-1.5 text-center">
                                Input automatically capitalizes regardless of CapsLock.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowApproveModal(false)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={confirmInput.trim() !== 'CONFIRM' || isApproving}
                                onClick={handleApprove}
                                className={`flex-1 py-3 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    confirmInput.trim() === 'CONFIRM'
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isApproving ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Verify & Grant</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DECLINE MODAL (WITH REASON CHIPS) */}
            {showDeclineModal && selectedStudent && (
                <div className="fixed inset-0 z-60 bg-gray-900/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="glass-modal rounded-3xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-red-100 shadow-2xs">
                            <XCircle size={32} />
                        </div>

                        <h3 className="text-xl font-black text-gray-900 text-center tracking-tight mb-2">
                            Decline Student Registration
                        </h3>
                        <p className="text-gray-500 text-xs text-center leading-relaxed mb-6">
                            Provide feedback so <strong className="text-gray-900">{selectedStudent.user?.firstName}</strong> can correct their details and re-upload valid documents.
                        </p>

                        {/* Quick Suggestion Chips */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-600 mb-2">Common Decline Reasons (Click to insert):</label>
                            <div className="flex flex-wrap gap-1.5">
                                {declineSuggestions.map((chip, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setDeclineReason(chip)}
                                        className="text-[11px] px-2.5 py-1 bg-gray-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-600 rounded-lg border border-gray-200 transition-colors text-left"
                                    >
                                        + {chip}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reason Textarea */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Decline Feedback Note *</label>
                            <textarea
                                required
                                rows={3}
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="State clearly what document or information is missing or mismatched..."
                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeclineModal(false)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!declineReason.trim() || isDeclining}
                                onClick={handleDecline}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeclining ? <Loader2 size={16} className="animate-spin" /> : <><XCircle size={16} /> Decline & Send</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentVerification;
