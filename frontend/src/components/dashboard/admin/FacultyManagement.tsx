import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Filter, Edit, Trash2, Mail, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';

const FacultyManagement: React.FC = () => {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFaculty = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const { data } = await axios.get('/api/auth/faculty', {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setFaculty(data);
        } catch (error) {
            console.error("Error fetching faculty", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">FACULTY MANAGEMENT</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">Manage counselors, guidance officers, and administrative staff.</p>
                </div>
                <button className="bg-primary-main text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
                    <UserPlus size={20} /> Onboard New Faculty
                </button>
            </div>

            {/* Quick Actions & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or specialization..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-main/5 transition-all outline-none font-bold text-sm"
                    />
                </div>
                <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                    <Filter size={18} /> Advanced Filtering
                </button>
            </div>

            {/* Faculty List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-8 py-6 font-black">Faculty Profile</th>
                            <th className="px-8 py-6 font-black">Department / Specialization</th>
                            <th className="px-8 py-6 font-black">Account Status</th>
                            <th className="px-8 py-6 font-black">Last Active</th>
                            <th className="px-8 py-6 font-black text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="w-10 h-10 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Faculty Records...</p>
                                </td>
                            </tr>
                        ) : faculty.length > 0 ? (
                            faculty.map((f) => (
                                <tr key={f._id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-main shadow-sm border border-primary-50 relative">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.firstName}`} alt="Avatar" className="w-10 h-10 rounded-xl" />
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-gray-900 group-hover:text-primary-main transition-colors">{f.firstName} {f.lastName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Mail size={12} className="text-gray-400" />
                                                    <p className="text-xs text-gray-500 font-medium">{f.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-primary-main" />
                                            <p className="font-bold text-gray-700 text-sm whitespace-nowrap">{f.department || 'Guidance Office'}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">HCI Spec: Human Factor Analysis</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">Authenticated</span>
                                    </td>
                                    <td className="px-8 py-6 font-medium text-gray-500 flex items-center gap-2 text-sm">
                                        <Clock size={16} /> Just now
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary-main hover:text-white transition-all shadow-sm">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-3 bg-primary-50 text-primary-main rounded-xl hover:bg-primary-main hover:text-white transition-all shadow-sm">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <Users size={48} className="text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Faculty Records Found</h3>
                                    <p className="text-gray-400 mt-2 font-medium">Add faculty members to start managing the platform.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default FacultyManagement;
