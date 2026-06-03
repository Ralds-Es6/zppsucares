import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, ChevronRight, ArrowLeft, Mail, Lock, User, Hash, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    type ViewState = 'selection' | 'login' | 'register';
    const [view, setView] = useState<ViewState>('selection');
    const navigate = useNavigate();

    // Form States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register State
    const [regData, setRegData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        course: '',
        yearLevel: '1',
        section: 'A',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/login', {
                email: loginEmail,
                password: loginPassword
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            onClose();
            toast.success("Welcome back! Student portal authorized.");
            navigate('/student-dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/register', regData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            onClose();
            toast.success("Profile successfully created!");
            navigate('/student-dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset view and state when modal closes
    const handleClose = () => {
        setTimeout(() => {
            setView('selection');
            setError('');
            setLoginEmail('');
            setLoginPassword('');
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
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden relative"
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
                                <div className="md:w-5/12 bg-primary-900 p-10 flex flex-col justify-between relative overflow-hidden text-white hidden md:flex">
                                    <div className="absolute inset-0 opacity-10 background-pattern"></div>
                                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-main rounded-full blur-3xl opacity-50"></div>

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-white text-primary-900 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg mb-6">
                                            ZC
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">Welcome to Your Portal</h2>
                                        <p className="text-primary-100/80 leading-relaxed">
                                            This secure portal is designed exclusively for ZPPSU Students to track their profile, request guidance, and connect with their assigned counselors.
                                        </p>
                                    </div>

                                    <div className="relative z-10">
                                        <p className="text-sm font-medium text-accent-main uppercase tracking-widest font-black">ZPPSU CARES</p>
                                    </div>
                                </div>

                                {/* Right Side - Dynamic Content Area */}
                                <div className="md:w-7/12 p-8 md:p-12 pb-16 relative">

                                    {/* Back Button (Only show in forms) */}
                                    {view !== 'selection' && (
                                        <button
                                            onClick={() => setView('selection')}
                                            className="absolute top-8 left-8 text-gray-400 hover:text-gray-700 font-medium text-sm flex items-center gap-1 transition-colors"
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
                                                <div className="text-center md:text-left mb-8 md:hidden">
                                                    <h2 className="text-2xl font-bold text-gray-900">Portal Access</h2>
                                                    <p className="text-gray-500 text-sm mt-1">Select an action below to continue</p>
                                                </div>

                                                <h3 className="text-2xl font-bold text-gray-900 mb-6 hidden md:block">Select an Action</h3>

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
                                                                <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-main transition-colors">Student Login</h4>
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
                                                        onClick={() => setView('register')}
                                                        className="group border-2 border-gray-100 hover:border-accent-main rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-accent-main/10 relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                                                        <div className="flex items-start gap-5 relative z-10">
                                                            <div className="w-14 h-14 bg-yellow-100 text-accent-main rounded-xl flex items-center justify-center shrink-0">
                                                                <UserPlus size={28} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-accent-main transition-colors">Student Registration</h4>
                                                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                                                    New to ZPPSU CARES? Register here to create your student profile and get connected with our support system.
                                                                </p>
                                                                <span className="inline-flex font-semibold text-accent-main text-sm items-center gap-1">
                                                                    Create an Account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                                                <div className="mb-8 text-center md:text-left">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h3>
                                                    <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
                                                </div>

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
                                                                type="password"
                                                                required
                                                                value={loginPassword}
                                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                                placeholder="••••••••"
                                                                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
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
                                                <div className="mb-6 text-center md:text-left">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Student Profile</h3>
                                                    <p className="text-gray-500 text-sm">Join ZPPSU CARES for dedicated support.</p>
                                                </div>

                                                {error && (
                                                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
                                                        {error}
                                                    </div>
                                                )}

                                                <form className="space-y-4" onSubmit={handleRegister}>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={regData.firstName}
                                                                    onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
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
                                                                onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
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
                                                                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                                                placeholder="student@uzppsu.edu.ph"
                                                                className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Hash size={18} /></div>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={regData.studentId}
                                                                    onChange={(e) => setRegData({ ...regData, studentId: e.target.value })}
                                                                    placeholder="e.g. 2023-0001"
                                                                    className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><BookOpen size={18} /></div>
                                                                <select
                                                                    required
                                                                    value={regData.course}
                                                                    onChange={(e) => setRegData({ ...regData, course: e.target.value })}
                                                                    className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-sm appearance-none cursor-pointer"
                                                                >
                                                                    <option value="">Select Course</option>
                                                                    <option value="BS Information Technology">BS Information Technology</option>
                                                                    <option value="BS Computer Science">BS Computer Science</option>
                                                                    <option value="Bachelor of Secondary Education">BSED</option>
                                                                    <option value="Bachelor of Elementary Education">BEED</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
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

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                                                            <input
                                                                type="password"
                                                                required
                                                                value={regData.password}
                                                                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                                                placeholder="••••••••"
                                                                className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="w-full bg-accent-main hover:bg-yellow-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent-main/30 hover:shadow-xl hover:shadow-accent-main/40 transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
                                                    >
                                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Register Profile'}
                                                    </button>
                                                </form>

                                                <p className="text-center mt-4 text-sm text-gray-600">
                                                    Already have an account? <button onClick={() => setView('login')} className="font-bold text-accent-main hover:underline">Sign in here</button>
                                                </p>
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
