import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Mail, ShieldCheck, Clock, User } from 'lucide-react';
import axios from 'axios';
import { authStorage } from '../../../utils/authStorage';
import OnboardFacultyModal from './modals/OnboardFacultyModal';

export interface FacultyMember {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
    designation?: string;
    employeeId?: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
}

const FacultyManagement: React.FC = () => {
    const [faculty, setFaculty] = useState<FacultyMember[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboardModal, setShowOnboardModal] = useState(false);

    const isSuperAdmin = authStorage.isSuperAdmin();

    const fetchFaculty = async () => {
        setIsLoading(true);
        try {
            const userInfo = authStorage.getAdmin() || {};
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

    const filteredFaculty = faculty.filter(f => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            f.firstName.toLowerCase().includes(query) ||
            f.lastName.toLowerCase().includes(query) ||
            f.email.toLowerCase().includes(query) ||
            (f.employeeId && f.employeeId.toLowerCase().includes(query)) ||
            (f.department && f.department.toLowerCase().includes(query)) ||
            (f.designation && f.designation.toLowerCase().includes(query))
        );
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">FACULTY MANAGEMENT</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base lg:text-lg mt-1 italic">
                        {isSuperAdmin
                            ? 'Manage counselors, guidance officers, and onboard new faculty.'
                            : 'Directory of institutional faculty, counselors, and guidance officers.'}
                    </p>
                </div>
                {/* Onboard button only visible to Super Admin */}
                {isSuperAdmin && (
                    <button
                        onClick={() => setShowOnboardModal(true)}
                        className="w-full md:w-auto justify-center bg-primary-main text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <UserPlus size={20} /> Onboard New Faculty
                    </button>
                )}
            </div>

            {/* Quick Actions & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, employee ID, department, or role..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-main/5 transition-all outline-none font-bold text-sm shadow-xs"
                    />
                </div>
            </div>

            {/* Faculty List */}
            <div className="glass-slab rounded-3xl sm:rounded-[3rem] overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-8 py-6 font-black">Faculty Profile</th>
                            <th className="px-8 py-6 font-black">Department & Role</th>
                            <th className="px-8 py-6 font-black">Account Status</th>
                            <th className="px-8 py-6 font-black">Member Since</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="w-10 h-10 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Faculty Records...</p>
                                </td>
                            </tr>
                        ) : filteredFaculty.length > 0 ? (
                            filteredFaculty.map((f) => (
                                <tr key={f._id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#87CEFA]/40 ring-4 ring-[#87CEFA]/25 relative shrink-0"
                                                style={{ backgroundColor: '#87CEFA' }}
                                            >
                                                <User size={26} className="text-white drop-shadow-sm" strokeWidth={2.4} />
                                                <div className={`absolute -top-1 -right-1 w-4 h-4 ${f.isActive !== false ? 'bg-green-500' : 'bg-red-500'} border-2 border-white rounded-full`}></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-extrabold text-gray-900 group-hover:text-primary-main transition-colors">
                                                        {f.firstName} {f.lastName}
                                                    </p>
                                                    {f.employeeId && (
                                                        <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md border border-sky-200">
                                                            {f.employeeId}
                                                        </span>
                                                    )}
                                                </div>
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
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">
                                            {f.designation || 'Faculty / Counselor'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        {f.isActive !== false ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">
                                                Active & Verified
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">
                                                Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 font-medium text-gray-500 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Active'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <Users size={48} className="text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Faculty Records Found</h3>
                                    <p className="text-gray-400 mt-2 font-medium">
                                        {searchQuery ? 'No faculty members match your search criteria.' : 'Add faculty members to start managing the platform.'}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Onboard Faculty Modal (Super Admin Only) */}
            {isSuperAdmin && (
                <OnboardFacultyModal
                    isOpen={showOnboardModal}
                    onClose={() => setShowOnboardModal(false)}
                    onSuccess={fetchFaculty}
                />
            )}
        </motion.div>
    );
};

export default FacultyManagement;
