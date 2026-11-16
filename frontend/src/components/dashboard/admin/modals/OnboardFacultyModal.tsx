import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, UserPlus, Sparkles, Building, Briefcase, Mail, Lock,
    Check, Copy, ShieldCheck, Eye, EyeOff, User
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { authStorage } from '../../../../utils/authStorage';

interface OnboardFacultyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface DepartmentItem {
    _id: string;
    name: string;
    code: string;
}

const DEFAULT_DEPARTMENTS = [
    { _id: '1', name: 'Guidance & Counseling Center (GCTSO)', code: 'GCTSO' },
    { _id: '2', name: 'College of Information & Computing Sciences', code: 'CICS' },
    { _id: '3', name: 'College of Engineering & Technology', code: 'CET' },
    { _id: '4', name: 'College of Teacher Education', code: 'CTE' },
    { _id: '5', name: 'College of Science & Mathematics', code: 'CSM' },
    { _id: '6', name: 'College of Business Administration', code: 'CBA' },
];

const DESIGNATIONS = [
    'Guidance Counselor',
    'Guidance Officer / Facilitator',
    'Department Head / Chairperson',
    'College Dean',
    'Instructor',
    'Assistant Professor',
    'Associate Professor',
    'College Coordinator'
];

export const OnboardFacultyModal: React.FC<OnboardFacultyModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('Guidance & Counseling Center (GCTSO)');
    const [designation, setDesignation] = useState('Guidance Counselor');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);
    const [isGeneratingId, setIsGeneratingId] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdFaculty, setCreatedFaculty] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Fetch active academic departments from server
    useEffect(() => {
        if (isOpen) {
            axios.get('/api/academic/departments')
                .then(({ data }) => {
                    if (Array.isArray(data) && data.length > 0) {
                        setDepartmentsList(data);
                        setDepartment(data[0].name);
                    }
                })
                .catch(() => {
                    // Use DEFAULT_DEPARTMENTS fallback
                });
        }
    }, [isOpen]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFirstName('');
            setLastName('');
            setEmployeeId('');
            setEmail('');
            setPassword('Faculty@2026!');
            setCreatedFaculty(null);
            setCopied(false);
        }
    }, [isOpen]);

    // Auto-generate employee ID
    const handleGenerateId = async () => {
        setIsGeneratingId(true);
        try {
            const adminInfo = authStorage.getAdmin() || {};
            const { data } = await axios.get('/api/auth/generate-faculty-id', {
                params: { firstName, lastName },
                headers: { Authorization: `Bearer ${adminInfo.token}` }
            });
            if (data.employeeId) {
                setEmployeeId(data.employeeId);
                toast.success(`Generated ID: ${data.employeeId}`);
            }
        } catch (error) {
            // Client fallback generator
            const currentYear = new Date().getFullYear();
            const firstStr = firstName.trim().charAt(0) || 'F';
            const lastStr = lastName.trim().charAt(0) || 'C';
            const initials = `${firstStr}${lastStr}`.toUpperCase();
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            const fallbackId = `FAC-${currentYear}-${initials}-${randomDigits}`;
            setEmployeeId(fallbackId);
        } finally {
            setIsGeneratingId(false);
        }
    };

    // Auto-suggest ID when typing names if empty
    const handleNameBlur = () => {
        if (!employeeId && firstName.trim() && lastName.trim()) {
            handleGenerateId();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            toast.error('First name, last name, and institutional email are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const adminInfo = authStorage.getAdmin() || {};
            const payload = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                employeeId: employeeId.trim() || undefined,
                department,
                designation,
                password: password.trim() || undefined
            };

            const { data } = await axios.post('/api/auth/faculty/onboard', payload, {
                headers: { Authorization: `Bearer ${adminInfo.token}` }
            });

            setCreatedFaculty(data.faculty);
            toast.success('Faculty member onboarded successfully!');
            onSuccess();
        } catch (error: any) {
            console.error('Error onboarding faculty:', error);
            toast.error(error.response?.data?.message || 'Failed to onboard faculty member.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyCredentials = () => {
        if (!createdFaculty) return;
        const text = `ZPPSU CARES - Faculty Portal Credentials\nName: ${createdFaculty.firstName} ${createdFaculty.lastName}\nEmployee ID: ${createdFaculty.employeeId}\nEmail: ${createdFaculty.email}\nDepartment: ${createdFaculty.department}\nRole: ${createdFaculty.designation}\nInitial Password: ${createdFaculty.temporaryPassword}\nLogin Portal: ${window.location.origin}/faculty/login`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Credentials copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden glass-modal my-8"
            >
                {/* Header */}
                <div className="p-6 md:p-8 bg-linear-to-r from-primary-main/10 via-sky-50 to-primary-main/5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-primary-main text-white flex items-center justify-center shadow-md shadow-primary-main/30">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Onboard New Faculty</h2>
                            <p className="text-xs font-semibold text-gray-500">Super Admin Direct Provisioning • Auto-Verified Account</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {createdFaculty ? (
                            /* Credential Handoff Screen */
                            <motion.div
                                key="credentials"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="space-y-6"
                            >
                                <div className="p-6 bg-green-50 border border-green-200 rounded-3xl text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-md shadow-green-500/30">
                                        <Check size={26} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-xl font-black text-green-950 uppercase tracking-tight">Faculty Account Ready</h3>
                                    <p className="text-xs font-medium text-green-700 max-w-md mx-auto">
                                        The faculty account has been provisioned and is instantly active. Share the login credentials below with the teacher or counselor.
                                    </p>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 font-mono text-sm">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Full Name:</span>
                                        <span className="font-bold text-gray-900">{createdFaculty.firstName} {createdFaculty.lastName}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Employee ID:</span>
                                        <span className="font-bold text-primary-main bg-primary-50 px-2.5 py-0.5 rounded-lg border border-primary-100">{createdFaculty.employeeId}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Login Email:</span>
                                        <span className="font-bold text-gray-800">{createdFaculty.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Department:</span>
                                        <span className="font-semibold text-gray-700 font-sans text-xs">{createdFaculty.department}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Designation:</span>
                                        <span className="font-semibold text-gray-700 font-sans text-xs">{createdFaculty.designation}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">Temporary Password:</span>
                                        <span className="font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">{createdFaculty.temporaryPassword}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCopyCredentials}
                                        className="flex-1 py-4 px-6 bg-primary-main text-white rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary-main/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied to Clipboard!' : 'Copy Login Credentials'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="py-4 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all cursor-pointer"
                                    >
                                        Done & Close
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* Onboarding Form */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Maria"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                onBlur={handleNameBlur}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Santos"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                onBlur={handleNameBlur}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Auto-Generated Faculty ID */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                                            Faculty / Employee ID <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleGenerateId}
                                            disabled={isGeneratingId}
                                            className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 cursor-pointer bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors"
                                        >
                                            <Sparkles size={13} className={isGeneratingId ? 'animate-spin' : ''} />
                                            {isGeneratingId ? 'Generating...' : 'Auto Generate ID'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-main" size={18} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. FAC-2026-MS-0001"
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono font-bold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                                        Auto-formatted sequential UUID schema matching university faculty credentials.
                                    </p>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                                        Institutional Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="e.g. maria.santos@zppsu.edu.ph"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Department & Designation */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                                            Department / College <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all cursor-pointer"
                                            >
                                                {departmentsList.map((d) => (
                                                    <option key={d._id} value={d.name}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                                            Designation / Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                            <select
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all cursor-pointer"
                                            >
                                                {DESIGNATIONS.map((desig) => (
                                                    <option key={desig} value={desig}>
                                                        {desig}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Temporary Password */}
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                                        Initial Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Faculty@2026!"
                                            className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono font-semibold text-gray-900 focus:bg-white focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                                        Default password provided; faculty member can update this upon login.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="px-6 py-3.5 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors uppercase tracking-wider cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3.5 bg-primary-main text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <UserPlus size={16} />
                                        {isSubmitting ? 'Onboarding...' : 'Create Faculty Account'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardFacultyModal;
