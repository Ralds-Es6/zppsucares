import { useState, useEffect } from 'react';
import { Mail, Lock, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FacultyLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user.role === 'faculty') {
                navigate('/faculty-dashboard', { replace: true });
            }
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Using the same generic login endpoint or specialized if available
            // Assuming /api/auth/login works for all roles
            const { data } = await axios.post('/api/auth/login', { email, password });

            if (data.role !== 'faculty') {
                const msg = 'Access denied. This portal is for Faculty accounts only.';
                setError(msg);
                toast.error(msg);
                localStorage.removeItem('userInfo');
                return;
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Faculty Dashboard authorized.");
            navigate('/faculty-dashboard', { replace: true });
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Unauthorized access. Please check your faculty credentials.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[400px] h-[400px] rounded-full bg-primary-light blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[500px] h-[500px] rounded-full bg-accent-light blur-3xl opacity-40 pointer-events-none"></div>

            <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-main justify-center text-white rounded-2xl flex items-center font-bold text-3xl shadow-lg mx-auto mb-6">
                        ZC
                    </div>
                    <div className="flex justify-center mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-light text-primary-main text-xs font-bold rounded-full border border-primary-100 uppercase tracking-widest">
                            <ShieldCheck size={14} /> Faculty Hub
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Faculty & Counselor Login</h1>
                    <p className="text-gray-500 text-sm">Welcome back to the ZPPSU CARES monitoring portal.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="faculty@zppsu.edu.ph"
                                className="pl-11 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secure Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-11 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-1 pb-3">
                        <a href="#" className="font-semibold text-primary-main text-sm hover:text-primary-800 transition-colors">Forgot credentials?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary-main hover:bg-primary-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-main/20 hover:shadow-xl transition-all mt-2 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <><Loader2 size={20} className="animate-spin" /> Authorizing...</> : 'Access Faculty Dashboard'}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-gray-500 text-sm font-medium z-10 transition-opacity opacity-70 hover:opacity-100">ZPPSU CARES Staff Portal</p>
        </div>
    );
};

export default FacultyLogin;
