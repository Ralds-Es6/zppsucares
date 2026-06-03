import { useState, useEffect } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfoRaw = localStorage.getItem('userInfo');
        if (userInfoRaw) {
            try {
                const user = JSON.parse(userInfoRaw);
                if (user.role === 'admin') {
                    navigate('/admin-dashboard', { replace: true });
                }
            } catch (e) {
                console.error("Error parsing userInfo", e);
            }
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post('/api/auth/admin/login', { email, password });

            // Store user info in localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Administrator access granted!");

            // Redirect to dashboard
            navigate('/admin-dashboard', { replace: true });
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Unauthorized: Invalid credentials';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6 text-gray-900 relative overflow-hidden">
            {/* Abstract bg for Admin */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] rounded-full bg-primary-light blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-accent-light blur-3xl opacity-40 pointer-events-none"></div>

            <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-main text-white rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg mx-auto mb-6">
                        ZC
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">System Administrator</h1>
                    <p className="text-gray-500 text-sm">Restricted Access Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Administrator Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@zppsu.edu.ph"
                                required
                                className="pl-11 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Master Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                className="pl-11 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all outline-none text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary-main hover:bg-primary-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-main/20 transition-all mt-4 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Verifying...
                            </>
                        ) : (
                            'Authorize Entry'
                        )}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-gray-500 text-sm z-10 font-medium">ZPPSU CARES Secure Infrastructure</p>
        </div>
    );
};

export default AdminLogin;
