import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, ChevronRight, ArrowLeft, Mail, Lock, User, Hash, Loader2, Eye, EyeOff, Building2, GraduationCap, FileText, IdCard, CheckCircle2, Upload, ShieldCheck, Check, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import guidanceLogo from '../assets/guidance_logo.jpeg';
import { authStorage } from '../utils/authStorage';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DepartmentItem {
    _id: string;
    name: string;
    code: string;
}

interface CourseItem {
    _id: string;
    code: string;
    name: string;
    duration: string;
    degreeType: string;
    category?: string;
}

interface PublicSettings {
    academicYear?: string;
    semester?: string;
    allowStudentRegistration?: boolean;
    studentLoginAccess?: boolean;
    registrationClosedMessage?: string;
    maintenanceMessage?: string;
    announcementBanner?: {
        isActive?: boolean;
        message?: string;
        type?: 'info' | 'warning' | 'alert';
    };
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    type ViewState = 'selection' | 'login' | 'register' | 'review' | 'submitted';
    const [view, setView] = useState<ViewState>('selection');
    const navigate = useNavigate();
    const [publicSettings, setPublicSettings] = useState<PublicSettings | null>(null);

    // Form States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Academic Data States
    const [departments, setDepartments] = useState<DepartmentItem[]>([]);
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Register State
    const [regData, setRegData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        department: '',
        course: '',
        yearLevel: '1',
        section: 'A',
        password: '',
        corUrl: '',
        idCardUrl: ''
    });

    const [corName, setCorName] = useState('');
    const [idCardName, setIdCardName] = useState('');
    const [isUploadingCor, setIsUploadingCor] = useState(false);
    const [isUploadingId, setIsUploadingId] = useState(false);
    const [isGeneratingId, setIsGeneratingId] = useState(false);

    const capitalizeWords = (str: string) => {
        return str
            .toLowerCase()
            .replace(/(^\w|[\s-]\w)/g, m => m.toUpperCase());
    };

    // Sync Student ID initials if name changes after generation
    useEffect(() => {
        if (regData.studentId) {
            const parts = regData.studentId.split('-');
            if (parts.length === 3) {
                const firstInitial = regData.firstName.trim().charAt(0) || 'X';
                const lastInitial = regData.lastName.trim().charAt(0) || 'X';
                const newInitials = `${firstInitial}${lastInitial}`.toUpperCase();
                
                if (parts[1] !== newInitials) {
                    parts[1] = newInitials;
                    setRegData(prev => ({ ...prev, studentId: parts.join('-') }));
                }
            }
        }
    }, [regData.firstName, regData.lastName, regData.studentId]);

    const handleGenerateStudentId = async () => {
        if (regData.studentId || isGeneratingId) return;

        if (!regData.firstName.trim() || !regData.lastName.trim()) {
            toast.warning("Please enter your First Name and Last Name first to generate your Student ID.");
            return;
        }

        setIsGeneratingId(true);
        try {
            const { data } = await axios.get('/api/auth/generate-student-id', {
                params: {
                    firstName: regData.firstName,
                    lastName: regData.lastName
                }
            });
            setRegData(prev => ({ ...prev, studentId: data.studentId }));
        } catch (err: unknown) {
            console.error("Failed to generate student ID:", err);
            toast.error("Failed to auto-generate Student ID.");
        } finally {
            setIsGeneratingId(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/login', {
                email: loginEmail,
                password: loginPassword
            });
            authStorage.setStudent(data);
            onClose();
            toast.success("Welcome back! Student portal authorized.");
            navigate('/student-dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCorName(file.name);
        setIsUploadingCor(true);
        const formData = new FormData();
        formData.append('document', file);
        try {
            const { data } = await axios.post('/api/auth/upload-document', formData);
            setRegData(prev => ({ ...prev, corUrl: data.url }));
            toast.success("COR successfully attached!");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Failed to upload COR");
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
        const formData = new FormData();
        formData.append('document', file);
        try {
            const { data } = await axios.post('/api/auth/upload-document', formData);
            setRegData(prev => ({ ...prev, idCardUrl: data.url }));
            toast.success("Student ID successfully attached!");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Failed to upload Student ID");
            setIdCardName('');
        } finally {
            setIsUploadingId(false);
        }
    };

    const handleProceedToReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!regData.firstName.trim() || !regData.lastName.trim()) {
            const msg = 'Please enter your First Name and Last Name.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!regData.email.trim()) {
            const msg = 'Please enter your email address.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!regData.studentId.trim()) {
            const msg = 'Please generate your official Student ID before proceeding.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!regData.department) {
            const msg = 'Please select your College / Department.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!regData.course) {
            const msg = 'Please select your Course / Program.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (regData.password.length < 6) {
            const msg = 'Password must be at least 6 characters.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (regData.password !== confirmPassword) {
            const msg = 'Passwords do not match.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!regData.corUrl) {
            const msg = 'Please attach your Certificate of Registration (COR) for verification.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!regData.idCardUrl) {
            const msg = 'Please attach your Student ID for identity verification.';
            setError(msg);
            toast.error(msg);
            return;
        }

        setError('');
        setView('review');
    };

    const handleFinalRegister = async () => {
        setIsLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/register', regData);
            setView('submitted');
            toast.success("Registration submitted for GCTSO verification!");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const msg = error.response?.data?.message || 'Registration failed.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch Departments & Public System Settings when modal opens
    useEffect(() => {
        if (isOpen) {
            axios.get('/api/settings/public')
                .then(({ data }) => setPublicSettings(data))
                .catch((err) => console.error("Could not fetch public settings", err));

            if (departments.length === 0) {
                const fetchDepartments = async () => {
                    setIsLoadingDepartments(true);
                    try {
                        const { data } = await axios.get('/api/academic/departments');
                        setDepartments(data);
                    } catch (err) {
                        console.error("Failed to load departments:", err);
                    } finally {
                        setIsLoadingDepartments(false);
                    }
                };
                fetchDepartments();
            }
        }
    }, [isOpen, departments.length]);

    // Interactive Course Fetching on Department Selection
    const handleDepartmentChange = async (deptCode: string) => {
        setRegData(prev => ({ ...prev, department: deptCode, course: '' }));
        if (!deptCode) {
            setCourses([]);
            return;
        }

        setIsLoadingCourses(true);
        try {
            const { data } = await axios.get(`/api/academic/departments/${encodeURIComponent(deptCode)}/courses`);
            setCourses(data.courses || []);
        } catch (err) {
            console.error("Failed to load courses for department:", err);
            toast.error("Could not fetch courses for this department.");
            setCourses([]);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    // Reset view and state when modal closes
    const handleClose = () => {
        setTimeout(() => {
            setView('selection');
            setError('');
            setLoginEmail('');
            setLoginPassword('');
            setShowLoginPassword(false);
            setShowRegPassword(false);
            setConfirmPassword('');
            setShowConfirmPassword(false);
            setCourses([]);
            setCorName('');
            setIdCardName('');
            setRegData({
                firstName: '',
                lastName: '',
                email: '',
                studentId: '',
                department: '',
                course: '',
                yearLevel: '1',
                section: 'A',
                password: '',
                corUrl: '',
                idCardUrl: ''
            });
        }, 300);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-modal rounded-4xl w-full max-w-4xl overflow-hidden relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col md:flex-row h-full">

                                {/* Left Side - Brand Context */}
                                <div className="hidden md:flex md:w-5/12 bg-primary-900 p-10 flex-col justify-between relative overflow-hidden text-white">
                                    <div className="absolute inset-0 opacity-10 background-pattern"></div>
                                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-main rounded-full blur-3xl opacity-50"></div>

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-125"></div>
                                            <img
                                                src={guidanceLogo}
                                                alt="ZPPSU GCTSO Seal"
                                                className="w-36 h-36 object-cover relative z-10 shadow-2xl hover:scale-105 transition-transform duration-300 rounded-full border-2 border-white/40"
                                                style={{ borderRadius: '50%' }}
                                            />
                                        </div>
                                        <h2 className="text-3xl font-black mb-3 text-white">ZPPSU CARES</h2>
                                        <p className="text-primary-100/90 leading-relaxed text-sm">
                                            Guidance and Counseling and Testing Services Office (GCTSO). Securely connecting ZPPSU students with assigned counselors and support services.
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-center gap-2 pt-6 border-t border-white/10">
                                        <p className="text-xs font-black text-accent-main uppercase tracking-widest">OFFICIAL STUDENT PORTAL</p>
                                    </div>
                                </div>

                                {/* Right Side - Dynamic Content Area */}
                                <div className="md:w-7/12 p-5 sm:p-8 md:p-10 pb-10 sm:pb-12 relative max-h-[90vh] overflow-y-auto">

                                    {/* Back Button (Only show in forms) */}
                                    {view !== 'selection' && (
                                        <button
                                            onClick={() => setView('selection')}
                                            className="absolute top-5 left-5 sm:top-8 sm:left-8 text-gray-400 hover:text-gray-700 font-medium text-sm flex items-center gap-1 transition-colors"
                                        >
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                    )}

                                    <AnimatePresence mode="wait">

                                        {/* SELECTION VIEW */}
                                        {view === 'selection' && (
                                            <motion.div
                                                key="selection"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-8 md:mt-0"
                                            >
                                                <div className="text-center mb-8 flex flex-col items-center">
                                                    <div className="relative mb-4">
                                                        <div className="absolute inset-0 bg-primary-100 rounded-full blur-lg scale-125"></div>
                                                        <img
                                                            src={guidanceLogo}
                                                            alt="ZPPSU GCTSO Seal"
                                                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full relative z-10 shadow-xl hover:scale-105 transition-transform"
                                                            style={{ borderRadius: '50%' }}
                                                        />
                                                    </div>
                                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">ZPPSU CARES Portal</h2>
                                                    <p className="text-gray-500 text-sm mt-1">Select an action below to access your student account</p>
                                                </div>

                                                <div className="grid gap-6">
                                                    {/* Login Card */}
                                                    <div
                                                        onClick={() => setView('login')}
                                                        className="group border-2 border-gray-100 hover:border-primary-main rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary-main/10 relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                                                        <div className="flex items-start gap-5 relative z-10">
                                                            <div className="w-14 h-14 bg-primary-100 text-primary-main rounded-xl flex items-center justify-center shrink-0">
                                                                <LogIn size={28} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-main transition-colors">Student Login</h4>
                                                                    {publicSettings?.studentLoginAccess === false && (
                                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                                                                            Maintenance Active
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                                                    Log in to view your personalized dashboard, track guidance activities, and update your profile.
                                                                </p>
                                                                <span className="inline-flex font-semibold text-primary-main text-sm items-center gap-1">
                                                                    Continue to Login <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Register Card */}
                                                    <div
                                                        onClick={() => {
                                                            if (publicSettings?.allowStudentRegistration === false) {
                                                                toast.warning(publicSettings.registrationClosedMessage || "Student self-registration is currently paused.");
                                                                return;
                                                            }
                                                            setView('register');
                                                        }}
                                                        className={`group border-2 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
                                                            publicSettings?.allowStudentRegistration === false
                                                                ? 'border-gray-200 bg-gray-50/70 cursor-not-allowed opacity-90'
                                                                : 'border-gray-100 hover:border-accent-main cursor-pointer hover:shadow-lg hover:shadow-accent-main/10'
                                                        }`}
                                                    >
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                                                        <div className="flex items-start gap-5 relative z-10">
                                                            <div className="w-14 h-14 bg-yellow-100 text-accent-main rounded-xl flex items-center justify-center shrink-0">
                                                                <UserPlus size={28} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-accent-main transition-colors">Student Registration</h4>
                                                                    {publicSettings?.allowStudentRegistration === false && (
                                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                                                                            Closed for Term
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                                                    {publicSettings?.allowStudentRegistration === false
                                                                        ? publicSettings.registrationClosedMessage
                                                                        : 'New to ZPPSU CARES? Register here to create your student profile and get connected with our support system.'}
                                                                </p>
                                                                <span className={`inline-flex font-semibold text-sm items-center gap-1 ${
                                                                    publicSettings?.allowStudentRegistration === false ? 'text-gray-400' : 'text-accent-main'
                                                                }`}>
                                                                    {publicSettings?.allowStudentRegistration === false ? 'Sign-ups Paused' : 'Create an Account'}
                                                                    {publicSettings?.allowStudentRegistration !== false && (
                                                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </motion.div>
                                        )}

                                        {/* LOGIN VIEW */}
                                        {view === 'login' && (
                                            <motion.div
                                                key="login"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-8 md:mt-2"
                                            >
                                                <div className="mb-6 text-center flex flex-col items-center">
                                                    <div className="relative mb-3">
                                                        <div className="absolute inset-0 bg-primary-100 rounded-full blur-lg scale-125"></div>
                                                        <img
                                                            src={guidanceLogo}
                                                            alt="ZPPSU GCTSO Seal"
                                                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full relative z-10 shadow-xl hover:scale-105 transition-transform"
                                                            style={{ borderRadius: '50%' }}
                                                        />
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 tracking-tight">Student Login</h3>
                                                    <p className="text-gray-500 text-sm">Welcome back! Please enter your student credentials.</p>
                                                </div>

                                                {publicSettings?.studentLoginAccess === false && (
                                                    <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-left">
                                                        <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">Portal Access Locked</h4>
                                                            <p className="text-xs text-rose-700 font-medium mt-0.5 leading-relaxed">
                                                                {publicSettings.maintenanceMessage || 'Student Portal is temporarily closed for term processing.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {error && (
                                                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold animate-pulse">
                                                        {error}
                                                    </div>
                                                )}

                                                <form className="space-y-4" onSubmit={handleLogin}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">University Email</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                <Mail size={18} />
                                                            </div>
                                                            <input
                                                                type="email"
                                                                required
                                                                value={loginEmail}
                                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                                placeholder="student@zppsu.edu.ph"
                                                                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                <Lock size={18} />
                                                            </div>
                                                            <input
                                                                type={showLoginPassword ? 'text' : 'password'}
                                                                required
                                                                value={loginPassword}
                                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                                placeholder="••••••••"
                                                                className="pl-10 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm py-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" className="rounded text-primary-main focus:ring-primary-main border-gray-300 accent-primary-main w-4 h-4 cursor-pointer" />
                                                            <span className="text-gray-600">Remember me</span>
                                                        </label>
                                                        <a href="#" className="font-semibold text-primary-main hover:text-primary-800 transition-colors">Forgot password?</a>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="w-full bg-primary-main hover:bg-primary-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-main/30 hover:shadow-xl hover:shadow-primary-main/40 transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
                                                    >
                                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                                                    </button>
                                                </form>

                                                <p className="text-center mt-6 text-sm text-gray-600">
                                                    Don't have an account? <button onClick={() => setView('register')} className="font-bold text-primary-main hover:underline">Register here</button>
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* REGISTER VIEW */}
                                        {view === 'register' && (
                                            <motion.div
                                                key="register"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-8 md:mt-2"
                                            >
                                                <div className="mb-6 text-center flex flex-col items-center">
                                                    <div className="relative mb-3">
                                                        <div className="absolute inset-0 bg-primary-100 rounded-full blur-lg scale-125"></div>
                                                        <img
                                                            src={guidanceLogo}
                                                            alt="ZPPSU GCTSO Seal"
                                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full relative z-10 shadow-xl hover:scale-105 transition-transform"
                                                            style={{ borderRadius: '50%' }}
                                                        />
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 tracking-tight">Create Student Profile</h3>
                                                    <p className="text-gray-500 text-sm">Join ZPPSU CARES for dedicated guidance and support.</p>
                                                </div>

                                                {publicSettings?.allowStudentRegistration === false ? (
                                                    <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
                                                        <AlertTriangle size={28} className="text-amber-600 mx-auto" />
                                                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Student Registration Paused</h4>
                                                        <p className="text-xs text-amber-800 font-medium leading-relaxed max-w-md mx-auto">
                                                            {publicSettings.registrationClosedMessage || 'Student self-registration is currently closed by the University Administration for this term.'}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setView('login')}
                                                            className="mt-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-700 transition-colors inline-block"
                                                        >
                                                            Go to Student Login
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {error && (
                                                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
                                                                {error}
                                                            </div>
                                                        )}

                                                        <form className="space-y-4" onSubmit={handleProceedToReview}>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={regData.firstName}
                                                                    onChange={(e) => setRegData({ ...regData, firstName: capitalizeWords(e.target.value) })}
                                                                    className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={regData.lastName}
                                                                onChange={(e) => setRegData({ ...regData, lastName: capitalizeWords(e.target.value) })}
                                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">University Email</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                                                            <input
                                                                type="email"
                                                                required
                                                                value={regData.email}
                                                                onChange={(e) => setRegData({ ...regData, email: e.target.value.toLowerCase() })}
                                                                placeholder="student@uzppsu.edu.ph"
                                                                className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Student ID */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Hash size={18} /></div>
                                                            <input
                                                                type="text"
                                                                required
                                                                readOnly={!!regData.studentId || !regData.firstName.trim() || !regData.lastName.trim()}
                                                                value={regData.studentId}
                                                                onChange={(e) => setRegData({ ...regData, studentId: e.target.value })}
                                                                onFocus={handleGenerateStudentId}
                                                                placeholder={isGeneratingId ? "Generating..." : "Click to auto-generate"}
                                                                className={`pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-xl transition-all outline-none ${
                                                                    regData.studentId 
                                                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                                                                        : "bg-gray-50 cursor-pointer focus:ring-2 focus:ring-primary-main focus:border-primary-main"
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Department / College Selection */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">College / Department</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                {isLoadingDepartments ? <Loader2 size={18} className="animate-spin text-primary-main" /> : <Building2 size={18} />}
                                                            </div>
                                                            <select
                                                                required
                                                                value={regData.department}
                                                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                                                disabled={isLoadingDepartments}
                                                                className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-sm appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                                            >
                                                                <option value="">{isLoadingDepartments ? "Loading colleges..." : "Select College / Department"}</option>
                                                                {departments.map((dept) => (
                                                                    <option key={dept._id} value={dept.code}>
                                                                        {dept.name} ({dept.code})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Course / Program Selection (Isolated by Department) */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-sm font-medium text-gray-700">Course / Program</label>
                                                            {regData.department && !isLoadingCourses && courses.length > 0 && (
                                                                <span className="text-[11px] font-bold text-primary-main bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                                                                    {courses.length} Available in {regData.department}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                {isLoadingCourses ? <Loader2 size={18} className="animate-spin text-primary-main" /> : <GraduationCap size={18} />}
                                                            </div>
                                                            <select
                                                                required
                                                                disabled={!regData.department || isLoadingCourses}
                                                                value={regData.course}
                                                                onChange={(e) => setRegData({ ...regData, course: e.target.value })}
                                                                className={`pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-sm appearance-none cursor-pointer ${
                                                                    !regData.department
                                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                        : isLoadingCourses
                                                                        ? "bg-gray-100 text-gray-600 cursor-wait animate-pulse"
                                                                        : "bg-gray-50 text-gray-900"
                                                                }`}
                                                            >
                                                                <option value="">
                                                                    {!regData.department
                                                                        ? "← Select College / Department first"
                                                                        : isLoadingCourses
                                                                        ? "Fetching courses for " + regData.department + "..."
                                                                        : "Select Course / Program"}
                                                                </option>
                                                                {(() => {
                                                                    const hasCategories = courses.some(c => !!c.category);
                                                                    if (hasCategories) {
                                                                        const categories = Array.from(new Set(courses.map(c => c.category || 'General Programs')));
                                                                        return categories.map(cat => (
                                                                            <optgroup key={cat} label={cat} className="font-bold text-gray-800 bg-gray-50">
                                                                                {courses.filter(c => (c.category || 'General Programs') === cat).map(course => (
                                                                                    <option key={course._id} value={`${course.code} - ${course.name}`} className="font-normal text-gray-900 bg-white">
                                                                                        [{course.code}] {course.name} ({course.duration})
                                                                                    </option>
                                                                                ))}
                                                                            </optgroup>
                                                                        ));
                                                                    }

                                                                    return courses.map(course => (
                                                                        <option key={course._id} value={`${course.code} - ${course.name}`}>
                                                                            [{course.code}] {course.name} ({course.duration})
                                                                        </option>
                                                                    ));
                                                                })()}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                                                            <select
                                                                required
                                                                value={regData.yearLevel}
                                                                onChange={(e) => setRegData({ ...regData, yearLevel: e.target.value })}
                                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-sm appearance-none cursor-pointer"
                                                            >
                                                                {[1, 2, 3, 4, 5].map(year => (
                                                                    <option key={year} value={year}>Year {year}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                                            <select
                                                                required
                                                                value={regData.section}
                                                                onChange={(e) => setRegData({ ...regData, section: e.target.value })}
                                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-sm appearance-none cursor-pointer"
                                                            >
                                                                {['A', 'B', 'C', 'D', 'E'].map(sec => (
                                                                    <option key={sec} value={sec}>Section {sec}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                                                                <input
                                                                    type={showRegPassword ? 'text' : 'password'}
                                                                    required
                                                                    value={regData.password}
                                                                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                                                    placeholder="••••••••"
                                                                    className="pl-10 pr-12 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                                >
                                                                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                                                                <input
                                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                                    required
                                                                    value={confirmPassword}
                                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                                    placeholder="••••••••"
                                                                    className="pl-10 pr-12 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                                >
                                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Verification Documents Upload Card */}
                                                    <div className="p-4 bg-primary-50/60 border border-primary-100 rounded-2xl space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck size={18} className="text-primary-main" />
                                                            <div>
                                                                <h5 className="text-xs font-bold uppercase tracking-wider text-primary-900">Student Identity Verification</h5>
                                                                <p className="text-[11px] text-gray-500">Attach official documents for GCTSO administrative approval</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {/* COR Upload */}
                                                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-1.5">
                                                                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                                                        <FileText size={14} className="text-primary-main" /> COR Document *
                                                                    </label>
                                                                    {regData.corUrl && <span className="text-xs text-green-700 font-bold flex items-center gap-1"><Check size={12} /> Ready</span>}
                                                                </div>
                                                                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 hover:border-primary-main rounded-xl cursor-pointer bg-gray-50 hover:bg-primary-50/30 transition-colors">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.png,.jpg,.jpeg"
                                                                        onChange={handleCorUpload}
                                                                        className="hidden"
                                                                        disabled={isUploadingCor}
                                                                    />
                                                                    {isUploadingCor ? (
                                                                        <div className="flex items-center gap-1.5 text-xs text-primary-main font-medium">
                                                                            <Loader2 size={16} className="animate-spin" /> Uploading COR...
                                                                        </div>
                                                                    ) : regData.corUrl ? (
                                                                        <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium truncate max-w-full">
                                                                            <CheckCircle2 size={14} className="shrink-0" />
                                                                            <span className="truncate">{corName || "COR Attached"}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex flex-col items-center text-center">
                                                                            <Upload size={18} className="text-gray-400 mb-1" />
                                                                            <span className="text-[11px] text-gray-600 font-medium">Upload COR (PDF/Image)</span>
                                                                            <span className="text-[9px] text-gray-400">Up to 10MB</span>
                                                                        </div>
                                                                    )}
                                                                </label>
                                                            </div>

                                                            {/* Student ID Card Upload */}
                                                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-1.5">
                                                                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                                                        <IdCard size={14} className="text-primary-main" /> Student ID Card *
                                                                    </label>
                                                                    {regData.idCardUrl && <span className="text-xs text-green-700 font-bold flex items-center gap-1"><Check size={12} /> Ready</span>}
                                                                </div>
                                                                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 hover:border-primary-main rounded-xl cursor-pointer bg-gray-50 hover:bg-primary-50/30 transition-colors">
                                                                    <input
                                                                        type="file"
                                                                        accept=".png,.jpg,.jpeg,.pdf"
                                                                        onChange={handleIdUpload}
                                                                        className="hidden"
                                                                        disabled={isUploadingId}
                                                                    />
                                                                    {isUploadingId ? (
                                                                        <div className="flex items-center gap-1.5 text-xs text-primary-main font-medium">
                                                                            <Loader2 size={16} className="animate-spin" /> Uploading ID...
                                                                        </div>
                                                                    ) : regData.idCardUrl ? (
                                                                        <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium truncate max-w-full">
                                                                            <CheckCircle2 size={14} className="shrink-0" />
                                                                            <span className="truncate">{idCardName || "ID Attached"}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex flex-col items-center text-center">
                                                                            <Upload size={18} className="text-gray-400 mb-1" />
                                                                            <span className="text-[11px] text-gray-600 font-medium">Upload ID (Photo/PDF)</span>
                                                                            <span className="text-[9px] text-gray-400">Up to 10MB</span>
                                                                        </div>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isLoading || isUploadingCor || isUploadingId}
                                                        className="w-full bg-accent-main hover:bg-yellow-500 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-accent-main/30 hover:shadow-xl transition-all mt-4 flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer disabled:opacity-50"
                                                    >
                                                        Review Application Details <ChevronRight size={20} />
                                                    </button>
                                                </form>

                                                <p className="text-center mt-4 text-sm text-gray-600">
                                                    Already have an account? <button onClick={() => setView('login')} className="font-bold text-accent-main hover:underline">Sign in here</button>
                                                </p>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                        {/* REVIEW & CONFIRMATION VIEW */}
                                        {view === 'review' && (
                                            <motion.div
                                                key="review"
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-6 md:mt-1 space-y-5"
                                            >
                                                {/* Header */}
                                                <div className="text-center pb-2 border-b border-gray-100">
                                                    <span className="bg-primary-50 text-primary-main text-xs font-black uppercase px-3 py-1 rounded-full inline-block mb-2 border border-primary-100">
                                                        Step 2 of 2: Pre-Submission Review
                                                    </span>
                                                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Review Your Application</h3>
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        Please double-check that all your details and documents are correct before submitting to GCTSO Administration.
                                                    </p>
                                                </div>

                                                {error && (
                                                    <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
                                                        {error}
                                                    </div>
                                                )}

                                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                                                    {/* Personal Info Card */}
                                                    <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-4.5">
                                                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                                                            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                                                <User size={15} className="text-primary-main" /> Personal Information
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setView('register')}
                                                                className="text-xs font-bold text-accent-main hover:underline cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-400 block uppercase">Full Name</span>
                                                                <span className="text-base font-bold text-gray-900">{regData.firstName} {regData.lastName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-400 block uppercase">Institutional Email</span>
                                                                <span className="text-sm font-bold text-gray-900 truncate block">{regData.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Academic Dossier Card */}
                                                    <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-4.5">
                                                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                                                            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                                                <GraduationCap size={15} className="text-primary-main" /> Academic Record
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setView('register')}
                                                                className="text-xs font-bold text-accent-main hover:underline cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-400 block uppercase">Official Student ID</span>
                                                                <span className="text-base font-black font-mono text-primary-main bg-primary-50 px-2 py-0.5 rounded-md inline-block border border-primary-100">
                                                                    {regData.studentId}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-400 block uppercase">College / Department</span>
                                                                <span className="text-sm font-bold text-gray-900">{regData.department}</span>
                                                            </div>
                                                            <div className="sm:col-span-2">
                                                                <span className="text-xs font-bold text-gray-400 block uppercase">Course / Program</span>
                                                                <span className="text-sm font-bold text-gray-900">{regData.course}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-400 block uppercase">Year & Section</span>
                                                                <span className="text-sm font-bold text-gray-900">Year {regData.yearLevel} — Section {regData.section}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Verification Documents Card */}
                                                    <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-4.5">
                                                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                                                            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                                                <FileText size={15} className="text-primary-main" /> Verification Documents Attached
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setView('register')}
                                                                className="text-xs font-bold text-accent-main hover:underline cursor-pointer"
                                                            >
                                                                Change Files
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="p-3 bg-white rounded-xl border border-green-200 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                                        <FileText size={14} className="text-primary-main" /> Certificate of Reg. (COR)
                                                                    </span>
                                                                    <span className="text-[11px] text-green-700 font-extrabold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                        <CheckCircle2 size={12} /> Ready
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-gray-500 font-medium truncate block max-w-full">
                                                                    {corName || 'COR Document Attached'}
                                                                </span>
                                                            </div>

                                                            <div className="p-3 bg-white rounded-xl border border-green-200 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                                        <IdCard size={14} className="text-primary-main" /> Official Student ID
                                                                    </span>
                                                                    <span className="text-[11px] text-green-700 font-extrabold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                        <CheckCircle2 size={12} /> Ready
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-gray-500 font-medium truncate block max-w-full">
                                                                    {idCardName || 'Student ID Card Attached'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setView('register')}
                                                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        <ArrowLeft size={18} /> Back to Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleFinalRegister}
                                                        disabled={isLoading}
                                                        className="flex-1 bg-accent-main hover:bg-yellow-500 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-accent-main/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 size={20} className="animate-spin" /> Submitting Application...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 size={20} /> Confirm & Submit to Admin
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* SUBMITTED CONFIRMATION VIEW */}
                                        {view === 'submitted' && (
                                            <motion.div
                                                key="submitted"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-6 text-center flex flex-col items-center py-2"
                                            >
                                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mb-5 shadow-lg border border-green-100">
                                                    <CheckCircle2 size={42} />
                                                </div>

                                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">Application Submitted!</h3>
                                                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                                                    Thank you, <span className="font-bold text-gray-900">{regData.firstName}</span>. To protect your student data and ensure campus safety, your registration is currently queued for verification by the <strong>GCTSO Administration</strong>.
                                                </p>

                                                <div className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl p-5 mb-6 text-left space-y-3">
                                                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2.5">
                                                        <span className="text-gray-500 font-medium">Assigned Student ID</span>
                                                        <span className="font-bold text-gray-900 font-mono">{regData.studentId}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2.5">
                                                        <span className="text-gray-500 font-medium">Certificate of Registration (COR)</span>
                                                        <span className="font-bold text-green-700 flex items-center gap-1">
                                                            <CheckCircle2 size={14} /> Attached ({corName || 'Uploaded'})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2.5">
                                                        <span className="text-gray-500 font-medium">Student ID Card</span>
                                                        <span className="font-bold text-green-700 flex items-center gap-1">
                                                            <CheckCircle2 size={14} /> Attached ({idCardName || 'Uploaded'})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs pt-0.5">
                                                        <span className="text-gray-500 font-medium">Status</span>
                                                        <span className="font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                                                            <Clock size={13} className="text-amber-700 animate-pulse" /> Awaiting Admin Verification
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="w-full space-y-3">
                                                    <button
                                                        onClick={() => setView('login')}
                                                        className="w-full bg-primary-main hover:bg-primary-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-main/30 hover:shadow-xl transition-all"
                                                    >
                                                        Proceed to Student Login
                                                    </button>
                                                    <button
                                                        onClick={handleClose}
                                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
