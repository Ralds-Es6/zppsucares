import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserCog, Search, Plus, UserPlus,
    CheckCircle2, Ban, RefreshCw, Mail, Building, KeyRound, X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { authStorage } from '../../../utils/authStorage';
import OnboardFacultyModal from './modals/OnboardFacultyModal';

interface AccountStats {
    totalSubAdmins: number;
    activeSubAdmins: number;
    inactiveSubAdmins: number;
    totalFaculty: number;
    activeFaculty: number;
    inactiveFaculty: number;
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
}

interface SubAdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt?: string;
}

interface FacultyUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    department: string;
    designation: string;
    employeeId: string;
    createdAt?: string;
}

interface StudentUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    studentId: string;
    department: string;
    course: string;
    yearLevel: string;
    section: string;
    verificationStatus: string;
    createdAt?: string;
}

const AccountDirectory: React.FC = () => {
    const [activeSegment, setActiveSegment] = useState<'subadmins' | 'faculty' | 'students'>('subadmins');
    const [stats, setStats] = useState<AccountStats>({
        totalSubAdmins: 0,
        activeSubAdmins: 0,
        inactiveSubAdmins: 0,
        totalFaculty: 0,
        activeFaculty: 0,
        inactiveFaculty: 0,
        totalStudents: 0,
        activeStudents: 0,
        suspendedStudents: 0,
    });

    const [subadmins, setSubadmins] = useState<SubAdminUser[]>([]);
    const [faculty, setFaculty] = useState<FacultyUser[]>([]);
    const [students, setStudents] = useState<StudentUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Modals
    const [showOnboardFacultyModal, setShowOnboardFacultyModal] = useState(false);
    const [showCreateSubAdminModal, setShowCreateSubAdminModal] = useState(false);
    const [targetSuspendUser, setTargetSuspendUser] = useState<{
        userId: string;
        userType: 'subadmin' | 'faculty' | 'student';
        userName: string;
        currentStatus: boolean;
    } | null>(null);

    // Sub-Admin Form
    const [subAdminFirst, setSubAdminFirst] = useState('');
    const [subAdminLast, setSubAdminLast] = useState('');
    const [subAdminEmail, setSubAdminEmail] = useState('');
    const [subAdminPassword, setSubAdminPassword] = useState('Staff@2026!');
    const [isCreatingSubAdmin, setIsCreatingSubAdmin] = useState(false);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            const adminInfo = authStorage.getAdmin() || {};
            const { data } = await axios.get('/api/admin/accounts/summary', {
                params: { search: searchQuery },
                headers: { Authorization: `Bearer ${adminInfo.token}` }
            });
            if (data.stats) setStats(data.stats);
            if (data.subadmins) setSubadmins(data.subadmins);
            if (data.faculty) setFaculty(data.faculty);
            if (data.students) setStudents(data.students);
        } catch (error) {
            console.error('Failed to fetch account directory:', error);
            toast.error('Failed to load account records.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [searchQuery]);

    // Handle Sub-Admin Creation
    const handleCreateSubAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subAdminFirst.trim() || !subAdminLast.trim() || !subAdminEmail.trim() || !subAdminPassword.trim()) {
            toast.error('All fields are required.');
            return;
        }

        setIsCreatingSubAdmin(true);
        try {
            const adminInfo = authStorage.getAdmin() || {};
            await axios.post('/api/admin/accounts/subadmin', {
                firstName: subAdminFirst.trim(),
                lastName: subAdminLast.trim(),
                email: subAdminEmail.toLowerCase().trim(),
                password: subAdminPassword.trim()
            }, {
                headers: { Authorization: `Bearer ${adminInfo.token}` }
            });

            toast.success(`Sub-Admin ${subAdminFirst} ${subAdminLast} created successfully!`);
            setShowCreateSubAdminModal(false);
            setSubAdminFirst('');
            setSubAdminLast('');
            setSubAdminEmail('');
            setSubAdminPassword('Staff@2026!');
            fetchAccounts();
        } catch (error: any) {
            console.error('Error creating subadmin:', error);
            toast.error(error.response?.data?.message || 'Failed to create sub-admin account.');
        } finally {
            setIsCreatingSubAdmin(false);
        }
    };

    // Handle User Status Toggle (Suspend / Reactivate)
    const handleConfirmToggleStatus = async () => {
        if (!targetSuspendUser) return;
        try {
            const adminInfo = authStorage.getAdmin() || {};
            const newStatus = !targetSuspendUser.currentStatus;

            await axios.put('/api/admin/accounts/toggle-status', {
                userId: targetSuspendUser.userId,
                userType: targetSuspendUser.userType,
                isActive: newStatus
            }, {
                headers: { Authorization: `Bearer ${adminInfo.token}` }
            });

            toast.success(`Account for ${targetSuspendUser.userName} is now ${newStatus ? 'ACTIVE' : 'SUSPENDED'}.`);
            setTargetSuspendUser(null);
            fetchAccounts();
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update account status.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">ACCOUNT DIRECTORY</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">
                        Super Admin Command • Institutional privileges, staff governance, and user statuses.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAccounts}
                        className="p-3.5 bg-white border border-gray-200/80 rounded-2xl text-gray-600 hover:text-primary-main hover:border-primary-main/30 shadow-xs transition-all cursor-pointer"
                        title="Refresh Directory"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    {activeSegment === 'subadmins' && (
                        <button
                            onClick={() => setShowCreateSubAdminModal(true)}
                            className="bg-primary-main text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                            <Plus size={18} /> Add Sub-Admin
                        </button>
                    )}
                    {activeSegment === 'faculty' && (
                        <button
                            onClick={() => setShowOnboardFacultyModal(true)}
                            className="bg-primary-main text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-main/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                            <UserPlus size={18} /> Onboard New Faculty
                        </button>
                    )}
                </div>
            </div>

            {/* Aggregate Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sub-Admins Card */}
                <div
                    onClick={() => setActiveSegment('subadmins')}
                    className={`p-6 rounded-3xl cursor-pointer transition-all ${
                        activeSegment === 'subadmins'
                            ? 'bg-sky-50/90 border-2 border-sky-400 ring-4 ring-sky-400/10 shadow-md'
                            : 'glass-slab hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                            <UserCog size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-sky-200/70 text-sky-900 rounded-full">
                            Staff Officers
                        </span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalSubAdmins}</p>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mt-2">
                        <span>Sub-Administrators</span>
                        <span className="text-green-600 font-bold">{stats.activeSubAdmins} Active</span>
                    </div>
                </div>

                {/* Faculty Card */}
                <div
                    onClick={() => setActiveSegment('faculty')}
                    className={`p-6 rounded-3xl cursor-pointer transition-all ${
                        activeSegment === 'faculty'
                            ? 'bg-sky-50/90 border-2 border-sky-400 ring-4 ring-sky-400/10 shadow-md'
                            : 'glass-slab hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            <Building size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-200/70 text-amber-900 rounded-full">
                            Faculty / Counselors
                        </span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalFaculty}</p>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mt-2">
                        <span>Faculty Members</span>
                        <span className="text-green-600 font-bold">{stats.activeFaculty} Verified</span>
                    </div>
                </div>

                {/* Students Card */}
                <div
                    onClick={() => setActiveSegment('students')}
                    className={`p-6 rounded-3xl cursor-pointer transition-all ${
                        activeSegment === 'students'
                            ? 'bg-sky-50/90 border-2 border-sky-400 ring-4 ring-sky-400/10 shadow-md'
                            : 'glass-slab hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-main flex items-center justify-center font-bold">
                            <Users size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary-100 text-primary-main rounded-full">
                            Students
                        </span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalStudents}</p>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mt-2">
                        <span>Enrolled Students</span>
                        {stats.suspendedStudents > 0 ? (
                            <span className="text-rose-600 font-bold">{stats.suspendedStudents} Suspended</span>
                        ) : (
                            <span className="text-green-600 font-bold">All Active</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Segment Controls & Search Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60 w-full md:w-auto">
                    <button
                        onClick={() => setActiveSegment('subadmins')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            activeSegment === 'subadmins'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Sub-Admins ({stats.totalSubAdmins})
                    </button>
                    <button
                        onClick={() => setActiveSegment('faculty')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            activeSegment === 'faculty'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Faculty ({stats.totalFaculty})
                    </button>
                    <button
                        onClick={() => setActiveSegment('students')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            activeSegment === 'students'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Students ({stats.totalStudents})
                    </button>
                </div>

                <div className="w-full md:w-96 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeSegment}...`}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-main/10 shadow-2xs"
                    />
                </div>
            </div>

            {/* Tables Container */}
            <div className="glass-slab rounded-[3rem] overflow-hidden">
                {/* 1. Sub-Admins Table */}
                {activeSegment === 'subadmins' && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-6 font-black">Staff Officer</th>
                                <th className="px-8 py-6 font-black">Role / Level</th>
                                <th className="px-8 py-6 font-black">Status</th>
                                <th className="px-8 py-6 font-black">Created Date</th>
                                <th className="px-8 py-6 font-black text-right">Authority Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="w-9 h-9 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Sub-Admins...</p>
                                    </td>
                                </tr>
                            ) : subadmins.length > 0 ? (
                                subadmins.map((admin) => (
                                    <tr key={admin._id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                                                    <UserCog size={22} />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-gray-900 text-sm">{admin.firstName} {admin.lastName}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500 font-medium">
                                                        <Mail size={12} className="text-gray-400" />
                                                        <span>{admin.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-[10px] font-black uppercase tracking-wider border border-sky-200">
                                                Staff Officer (Sub-Admin)
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">Application Assessment & Intake</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            {admin.isActive !== false ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">
                                                    Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                                            {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setTargetSuspendUser({
                                                    userId: admin._id,
                                                    userType: 'subadmin',
                                                    userName: `${admin.firstName} ${admin.lastName}`,
                                                    currentStatus: admin.isActive !== false
                                                })}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                                    admin.isActive !== false
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200'
                                                }`}
                                            >
                                                {admin.isActive !== false ? 'Suspend Access' : 'Reactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <UserCog size={44} className="text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-base font-black text-gray-400 uppercase tracking-wider">No Sub-Admins Found</h3>
                                        <p className="text-xs text-gray-400 mt-1">Create a sub-admin to delegate student application assessment.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* 2. Faculty Table */}
                {activeSegment === 'faculty' && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-6 font-black">Faculty Member</th>
                                <th className="px-8 py-6 font-black">Department & Role</th>
                                <th className="px-8 py-6 font-black">Account Status</th>
                                <th className="px-8 py-6 font-black">Member Since</th>
                                <th className="px-8 py-6 font-black text-right">Authority Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="w-9 h-9 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Faculty Records...</p>
                                    </td>
                                </tr>
                            ) : faculty.length > 0 ? (
                                faculty.map((f) => (
                                    <tr key={f._id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
                                                    <Building size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-extrabold text-gray-900 text-sm">{f.firstName} {f.lastName}</p>
                                                        {f.employeeId && (
                                                            <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                                                                {f.employeeId}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium">{f.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-gray-800 text-xs">{f.department}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{f.designation}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            {f.isActive !== false ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">
                                                    Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Active'}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setTargetSuspendUser({
                                                    userId: f._id,
                                                    userType: 'faculty',
                                                    userName: `${f.firstName} ${f.lastName}`,
                                                    currentStatus: f.isActive !== false
                                                })}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                                    f.isActive !== false
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200'
                                                }`}
                                            >
                                                {f.isActive !== false ? 'Suspend Faculty' : 'Reactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Building size={44} className="text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-base font-black text-gray-400 uppercase tracking-wider">No Faculty Accounts</h3>
                                        <p className="text-xs text-gray-400 mt-1">Onboard teachers and counselors directly with auto-generated IDs.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* 3. Students Table */}
                {activeSegment === 'students' && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-6 font-black">Student Profile</th>
                                <th className="px-8 py-6 font-black">Academic Program</th>
                                <th className="px-8 py-6 font-black">Registration Status</th>
                                <th className="px-8 py-6 font-black">Portal Access</th>
                                <th className="px-8 py-6 font-black text-right">Authority Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="w-9 h-9 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Student Directory...</p>
                                    </td>
                                </tr>
                            ) : students.length > 0 ? (
                                students.map((s) => (
                                    <tr key={s._id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-extrabold text-gray-900 text-sm">{s.firstName} {s.lastName}</p>
                                                    <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                                                        {s.studentId}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">{s.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-gray-800 text-xs">{s.department}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">
                                                {s.course} • {s.yearLevel ? `Year ${s.yearLevel}` : ''} {s.section}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            {s.verificationStatus === 'approved' ? (
                                                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-green-200">
                                                    Verified & Approved
                                                </span>
                                            ) : s.verificationStatus === 'pending' ? (
                                                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-200">
                                                    Pending Review
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    {s.verificationStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            {s.isActive !== false ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">
                                                    Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setTargetSuspendUser({
                                                    userId: s._id,
                                                    userType: 'student',
                                                    userName: `${s.firstName} ${s.lastName} (${s.studentId})`,
                                                    currentStatus: s.isActive !== false
                                                })}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                                    s.isActive !== false
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200'
                                                }`}
                                            >
                                                {s.isActive !== false ? 'Suspend Account' : 'Reactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Users size={44} className="text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-base font-black text-gray-400 uppercase tracking-wider">No Students Found</h3>
                                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal: Create Sub-Admin */}
            {showCreateSubAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden glass-modal"
                    >
                        <div className="p-6 bg-linear-to-r from-sky-50 to-primary-main/10 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30">
                                    <UserCog size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Create Sub-Admin Staff</h2>
                                    <p className="text-[11px] font-semibold text-gray-500">Delegated Student Assessment Officer</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreateSubAdminModal(false)}
                                className="p-2 rounded-full hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubAdmin} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={subAdminFirst}
                                        onChange={(e) => setSubAdminFirst(e.target.value)}
                                        placeholder="e.g. Juan"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary-main outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={subAdminLast}
                                        onChange={(e) => setSubAdminLast(e.target.value)}
                                        placeholder="e.g. Dela Cruz"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary-main outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Institutional Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={subAdminEmail}
                                        onChange={(e) => setSubAdminEmail(e.target.value)}
                                        placeholder="juan.delacruz@zppsu.edu.ph"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary-main outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Initial Password *</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={subAdminPassword}
                                        onChange={(e) => setSubAdminPassword(e.target.value)}
                                        placeholder="Staff@2026!"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-primary-main outline-none"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Can log in immediately at /admin/login with delegated assessment privileges.</p>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateSubAdminModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 uppercase cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingSubAdmin}
                                    className="px-6 py-2.5 bg-primary-main text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isCreatingSubAdmin ? 'Creating...' : 'Provision Sub-Admin'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Modal: Confirm Status Toggle (Suspend / Reactivate) */}
            {targetSuspendUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden glass-modal p-6 text-center space-y-4"
                    >
                        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                            targetSuspendUser.currentStatus ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-700'
                        }`}>
                            {targetSuspendUser.currentStatus ? <Ban size={28} /> : <CheckCircle2 size={28} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                {targetSuspendUser.currentStatus ? 'Confirm Account Suspension' : 'Reactivate Account'}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 mt-1">
                                Are you sure you want to {targetSuspendUser.currentStatus ? 'suspend' : 'reactivate'} the account for:
                            </p>
                            <p className="font-bold text-gray-900 text-sm mt-1 bg-gray-50 py-1.5 px-3 rounded-lg inline-block border border-gray-200">
                                {targetSuspendUser.userName}
                            </p>
                            {targetSuspendUser.currentStatus && (
                                <p className="text-[11px] text-rose-600 font-semibold mt-2">
                                    When suspended, this user will be blocked from logging into the portal immediately.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setTargetSuspendUser(null)}
                                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 uppercase cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmToggleStatus}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer ${
                                    targetSuspendUser.currentStatus
                                        ? 'bg-rose-600 hover:bg-rose-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {targetSuspendUser.currentStatus ? 'Yes, Suspend Account' : 'Yes, Reactivate'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Onboard Faculty Modal */}
            <OnboardFacultyModal
                isOpen={showOnboardFacultyModal}
                onClose={() => setShowOnboardFacultyModal(false)}
                onSuccess={fetchAccounts}
            />
        </motion.div>
    );
};

export default AccountDirectory;
