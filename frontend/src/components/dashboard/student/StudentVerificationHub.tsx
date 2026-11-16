import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Clock, AlertTriangle, CheckCircle2, Upload, LogOut,
    FileText, IdCard, ShieldCheck, Loader2, Building2,
    GraduationCap, Hash, ArrowRight, RefreshCw, ExternalLink, Lock,
    ClipboardList, Lightbulb
} from 'lucide-react';
import guidanceLogo from '../../../assets/guidance_logo.jpeg';
import { authStorage } from '../../../utils/authStorage';

export interface StudentVerificationUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    token?: string;
    studentProfile?: {
        _id?: string;
        studentId?: string;
        department?: string;
        course?: string;
        yearLevel?: number | string;
        section?: string;
        verificationStatus?: 'pending' | 'approved' | 'declined';
        documents?: {
            corUrl?: string;
            idCardUrl?: string;
            submittedAt?: string;
        };
        verificationDetails?: {
            reviewedAt?: string;
            declineReason?: string;
        };
        isResubmitted?: boolean;
    };
}

interface StudentVerificationHubProps {
    user: StudentVerificationUser;
    onUserUpdate: (updatedUser: StudentVerificationUser) => void;
    handleLogout: () => void;
}

export const StudentVerificationHub: React.FC<StudentVerificationHubProps> = ({
    user,
    onUserUpdate,
    handleLogout
}) => {
    const profile = user?.studentProfile || {};
    const status = profile.verificationStatus || 'pending';
    const declineReason = profile.verificationDetails?.declineReason || 'Documents or student details require correction.';

    // Document state for re-uploading
    const [corUrl, setCorUrl] = useState(profile.documents?.corUrl || '');
    const [idCardUrl, setIdCardUrl] = useState(profile.documents?.idCardUrl || '');
    const [corName, setCorName] = useState('');
    const [idCardName, setIdCardName] = useState('');
    const [isUploadingCor, setIsUploadingCor] = useState(false);
    const [isUploadingId, setIsUploadingId] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Document upload handlers
    const handleCorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCorName(file.name);
        setIsUploadingCor(true);
        const data = new FormData();
        data.append('document', file);
        try {
            const res = await axios.post('/api/auth/upload-document', data);
            setCorUrl(res.data.url);
            toast.success('Replacement COR uploaded!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to upload COR');
            setCorName('');
        } finally {
            setIsUploadingCor(false);
        }
    };

    const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIdCardName(file.name);
        setIsUploadingId(true);
        const data = new FormData();
        data.append('document', file);
        try {
            const res = await axios.post('/api/auth/upload-document', data);
            setIdCardUrl(res.data.url);
            toast.success('Replacement Student ID uploaded!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to upload Student ID');
            setIdCardName('');
        } finally {
            setIsUploadingId(false);
        }
    };

    // Resubmit updated documents
    const handleResubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!corUrl) {
            toast.error('Please upload a valid Certificate of Registration (COR).');
            return;
        }
        if (!idCardUrl) {
            toast.error('Please upload a valid Student ID Card.');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = user?.token;
            const { data } = await axios.put('/api/auth/student/resubmit', {
                corUrl,
                idCardUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update user in localStorage and state
            const updatedUser: StudentVerificationUser = {
                ...user,
                studentProfile: {
                    ...profile,
                    ...data.student,
                    verificationStatus: 'pending',
                    isResubmitted: true,
                    documents: {
                        ...profile.documents,
                        corUrl,
                        idCardUrl,
                        submittedAt: new Date().toISOString()
                    }
                }
            };
            authStorage.setStudent(updatedUser);
            onUserUpdate(updatedUser);
            toast.success('Your replacement documents have been resubmitted for GCTSO review!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to resubmit application.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
            {/* Top Brand Bar */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-3.5">
                    <img
                        src={guidanceLogo}
                        alt="ZPPSU GCTSO Seal"
                        className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white"
                    />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                            ZPPSU-CARES Portal
                        </h1>
                        <p className="text-xs sm:text-sm font-semibold text-gray-500">
                            Guidance and Counseling and Testing Services Office (GCTSO)
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 transition-colors shadow-xs"
                >
                    <LogOut size={16} /> Log Out
                </button>
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-4xl glass-slab rounded-4xl overflow-hidden">
                {/* STATUS: PENDING / UNDER REVIEW */}
                {status === 'pending' && (
                    <div className="p-8 sm:p-12 text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-amber-100">
                                <Clock size={48} className="animate-pulse" />
                            </div>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-black uppercase px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                                Under Review
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">
                            Account Verification In Progress
                        </h2>
                        <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed mb-8">
                            Welcome, <strong className="text-gray-900">{user.firstName} {user.lastName}</strong>! Your registration has been received and is awaiting validation from the <strong>Guidance and Counseling and Testing Services Office (GCTSO)</strong>.
                        </p>

                        {/* Verification Timeline */}
                        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 mb-8 text-left">
                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-primary-main" /> Identity Verification Roadmap
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-white rounded-xl border border-green-200 shadow-xs">
                                    <div className="flex items-center gap-2 text-green-700 font-extrabold text-sm mb-1.5">
                                        <CheckCircle2 size={18} /> 1. Registration
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">COR and Student ID uploaded</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 shadow-xs">
                                    <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm mb-1.5">
                                        <Clock size={18} /> 2. Admin Review
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">GCTSO reviewing document validity</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-gray-200 opacity-60">
                                    <div className="flex items-center gap-2 text-gray-500 font-extrabold text-sm mb-1.5">
                                        <ShieldCheck size={18} /> 3. Verified Portal
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">Full counseling services unlocked</p>
                                </div>
                            </div>
                        </div>

                        {/* Submitted Profile Details */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left space-y-4 shadow-xs">
                            <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">Submitted Applicant Profile</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                <div>
                                    <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider">Student ID</span>
                                    <span className="font-extrabold text-gray-900 font-mono text-base">{profile.studentId || 'Auto-assigned'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider">College / Dept</span>
                                    <span className="font-bold text-gray-900 text-sm">{profile.department || 'Not selected'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider">Course & Year</span>
                                    <span className="font-bold text-gray-900 text-sm truncate block">{profile.course} (Yr {profile.yearLevel})</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider">Documents</span>
                                    <div className="flex items-center gap-3 mt-1 text-sm font-bold">
                                        {profile.documents?.corUrl && (
                                            <a href={profile.documents.corUrl} target="_blank" rel="noopener noreferrer" className="text-primary-main hover:underline inline-flex items-center gap-1">
                                                COR <ExternalLink size={12} />
                                            </a>
                                        )}
                                        {profile.documents?.idCardUrl && (
                                            <a href={profile.documents.idCardUrl} target="_blank" rel="noopener noreferrer" className="text-primary-main hover:underline inline-flex items-center gap-1">
                                                ID <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto px-8 py-3.5 bg-primary-main hover:bg-primary-800 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-main/20"
                            >
                                <RefreshCw size={16} /> Refresh Verification Status
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors"
                            >
                                Log Out For Now
                            </button>
                        </div>
                    </div>
                )}

                {/* STATUS: DECLINED / CORRECTION HUB */}
                {status === 'declined' && (
                    <div className="p-6 sm:p-10">
                        {/* Header Banner */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                                <AlertTriangle size={28} />
                            </div>
                            <div className="flex-1">
                                <span className="bg-red-100 text-red-700 text-xs font-black uppercase px-3 py-1 rounded-full inline-block mb-1.5">
                                    Action Required
                                </span>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registration Verification Incomplete</h2>
                                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                    The GCTSO administration reviewed your application, but some documents require correction before your account can be verified.
                                </p>
                            </div>
                        </div>

                        {/* Admin Feedback Box */}
                        <div className="bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-2xl p-6 mb-8">
                            <h3 className="text-sm font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-2">
                                <ClipboardList size={18} className="text-amber-800 shrink-0" /> GCTSO Reviewer Feedback & Decline Reason:
                            </h3>
                            <p className="text-base font-semibold text-gray-800 italic bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                                "{declineReason}"
                            </p>
                            <p className="text-xs text-amber-900 mt-2.5 font-medium flex items-center gap-2">
                                <Lightbulb size={16} className="text-amber-700 shrink-0" /> Please upload clear and valid replacement documents below, then click "Resubmit Documents" to send for review.
                            </p>
                        </div>

                        {/* LOCKED ACADEMIC DOSSIER */}
                        <div className="glass-slab rounded-3xl p-6 sm:p-8 mb-8">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                                <div>
                                    <h4 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                        <Lock size={18} className="text-gray-400" /> Official Academic Profile (Locked)
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
                                        Your academic information is tied to your registration and cannot be modified here.
                                    </p>
                                </div>
                                <span className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-extrabold flex items-center gap-1.5 shrink-0 border border-gray-200">
                                    <Lock size={12} /> Read-Only Record
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-50/90 p-4 rounded-xl border border-gray-200/80">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        <Hash size={13} /> Student ID
                                    </span>
                                    <span className="text-base font-black font-mono text-gray-900 mt-1 block">
                                        {profile.studentId || 'N/A'}
                                    </span>
                                </div>
                                <div className="bg-gray-50/90 p-4 rounded-xl border border-gray-200/80">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        <Building2 size={13} /> College / Dept
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 mt-1 block">
                                        {profile.department || 'N/A'}
                                    </span>
                                </div>
                                <div className="bg-gray-50/90 p-4 rounded-xl border border-gray-200/80 sm:col-span-2">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        <GraduationCap size={13} /> Course / Program
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 mt-1 block truncate">
                                        {profile.course || 'N/A'}
                                    </span>
                                </div>
                                <div className="bg-gray-50/90 p-4 rounded-xl border border-gray-200/80 sm:col-span-2">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                                        Year Level & Section
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 mt-1 block">
                                        Year {profile.yearLevel || 1} — Section {profile.section || 'A'}
                                    </span>
                                </div>
                                <div className="bg-gray-50/90 p-4 rounded-xl border border-gray-200/80 sm:col-span-2">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                                        Student Full Name
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 mt-1 block">
                                        {user.firstName} {user.lastName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RE-UPLOAD DOCUMENTS FORM */}
                        <form onSubmit={handleResubmit} className="space-y-6">
                            <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                                <h4 className="text-base font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                                    <FileText size={18} className="text-primary-main" /> Re-Upload Verification Documents
                                </h4>
                                <span className="text-xs font-semibold text-gray-500">PDF, PNG, JPG accepted (Max 10MB)</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* COR Upload */}
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-black text-gray-900 flex items-center gap-2">
                                            <FileText size={16} className="text-primary-main" /> Certificate of Reg. (COR) *
                                        </span>
                                        {corUrl && (
                                            <span className="text-xs text-green-700 font-extrabold bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Ready
                                            </span>
                                        )}
                                    </div>
                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-main rounded-xl cursor-pointer bg-white hover:bg-primary-50/20 transition-colors">
                                        <input
                                            type="file"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={handleCorUpload}
                                            className="hidden"
                                            disabled={isUploadingCor}
                                        />
                                        {isUploadingCor ? (
                                            <div className="flex items-center gap-2 text-sm text-primary-main font-bold">
                                                <Loader2 size={18} className="animate-spin" /> Uploading COR...
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Upload size={22} className="text-gray-400 mx-auto mb-2" />
                                                <span className="text-sm font-bold text-gray-800 block truncate max-w-50">
                                                    {corName || (corUrl ? 'Replace current COR' : 'Choose replacement COR')}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-1 block">Click to browse file</span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* Student ID Upload */}
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-black text-gray-900 flex items-center gap-2">
                                            <IdCard size={16} className="text-primary-main" /> Student ID Card *
                                        </span>
                                        {idCardUrl && (
                                            <span className="text-xs text-green-700 font-extrabold bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Ready
                                            </span>
                                        )}
                                    </div>
                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-primary-main rounded-xl cursor-pointer bg-white hover:bg-primary-50/20 transition-colors">
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.pdf"
                                            onChange={handleIdUpload}
                                            className="hidden"
                                            disabled={isUploadingId}
                                        />
                                        {isUploadingId ? (
                                            <div className="flex items-center gap-2 text-sm text-primary-main font-bold">
                                                <Loader2 size={18} className="animate-spin" /> Uploading ID...
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Upload size={22} className="text-gray-400 mx-auto mb-2" />
                                                <span className="text-sm font-bold text-gray-800 block truncate max-w-50">
                                                    {idCardName || (idCardUrl ? 'Replace current ID' : 'Choose replacement Student ID')}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-1 block">Click to browse file</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploadingCor || isUploadingId}
                                    className="flex-1 bg-primary-main hover:bg-primary-800 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg shadow-primary-main/20 transition-all flex items-center justify-center gap-2.5 text-base uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> Submitting for Review...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight size={20} /> Resubmit Documents to GCTSO
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-base transition-colors cursor-pointer"
                                >
                                    Log Out
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentVerificationHub;
