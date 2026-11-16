import React, { useState } from 'react';
import {
    User, FileText, Calendar, HandHelping, Settings,
    LogOut, Activity, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import guidanceLogo from '../../../assets/guidance_logo.jpeg';
import VerifiedBadge from '../../common/VerifiedBadge';

export interface StudentUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    studentProfile?: {
        studentId?: string;
        department?: string;
        course?: string;
        yearLevel?: number | string;
        section?: string;
    };
    token?: string;
}

export interface StudentSidebarData {
    studentId?: string;
    department?: string;
    course?: string;
    yearLevel?: number | string;
    section?: string;
    assignedCounselor?: string;
    status?: string;
    concernsRaised?: number;
    appointments?: unknown[];
    recentReports?: unknown[];
    physicalStatus?: string;
    mentalStatus?: string;
    behaviorStatus?: string;
}

interface StudentSidebarProps {
    user: StudentUser | null;
    studentData: StudentSidebarData;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
    user,
    studentData,
    activeTab,
    setActiveTab,
    handleLogout
}) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleSelectTab = (tab: string) => {
        setActiveTab(tab);
        setIsMobileOpen(false);
    };

    const navContent = (
        <>
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <img src={guidanceLogo} alt="ZPPSU GCTSO Seal" className="w-12 h-12 sm:w-13 sm:h-13 object-cover rounded-full shadow-lg" style={{ borderRadius: '50%' }} />
                        <div>
                            <h2 className="font-bold text-gray-900 text-lg leading-tight uppercase tracking-tight">ZPPSU CARES</h2>
                            <p className="text-[10px] text-primary-main font-bold uppercase tracking-widest">Student Portal</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-4 p-4 sm:p-4.5 glass-slab rounded-2xl mb-2">
                    <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-md shadow-[#87CEFA]/40 ring-4 ring-[#87CEFA]/25 shrink-0"
                        style={{ backgroundColor: '#87CEFA' }}
                    >
                        <User size={24} className="text-white drop-shadow-sm" strokeWidth={2.4} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-extrabold text-gray-900 text-sm sm:text-base truncate flex items-center gap-2">
                            {user?.firstName} {user?.lastName}
                            <VerifiedBadge size="md" />
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{studentData?.studentId}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 sm:px-6 pb-4 space-y-1.5 sm:space-y-2 overflow-y-auto custom-scrollbar">
                <button
                    onClick={() => handleSelectTab('overview')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'overview'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Activity size={20} className="shrink-0" />
                        <span>Overview</span>
                    </div>
                    {activeTab === 'overview' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('profile')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'profile'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <User size={20} className="shrink-0" />
                        <span>My Profile</span>
                    </div>
                    {activeTab === 'profile' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('reports')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'reports'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="shrink-0" />
                        <span>Support Reports</span>
                    </div>
                    {activeTab === 'reports' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('appointments')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'appointments'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className="shrink-0" />
                        <span>Appointments</span>
                    </div>
                    {activeTab === 'appointments' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('grants')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'grants'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <HandHelping size={20} className="shrink-0" />
                        <span>Grants & Aid</span>
                    </div>
                    {activeTab === 'grants' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                        onClick={() => handleSelectTab('settings')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                            activeTab === 'settings'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                                : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Settings size={20} className="shrink-0" />
                            <span>Settings</span>
                        </div>
                        {activeTab === 'settings' && (
                            <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                        )}
                    </button>
                </div>
            </nav>

            <div className="p-4 sm:p-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 sm:py-4 bg-red-50 text-red-600 hover:bg-red-100/90 hover:text-red-700 rounded-2xl font-bold transition-all duration-200 cursor-pointer group"
                >
                    <LogOut size={20} className="transition-transform group-hover:-translate-x-0.5" />
                    <span>Secure Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Top Header Bar */}
            <div className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                    <img src={guidanceLogo} alt="ZPPSU GCTSO Seal" className="w-9 h-9 object-cover rounded-full shadow-sm" style={{ borderRadius: '50%' }} />
                    <div>
                        <h2 className="font-extrabold text-gray-900 text-sm leading-tight uppercase tracking-tight">ZPPSU CARES</h2>
                        <p className="text-[9px] text-primary-main font-bold uppercase tracking-widest">Student Portal</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile Slide-Over Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="relative w-72 max-w-[85vw] h-full bg-white flex flex-col shadow-2xl z-10"
                        >
                            {navContent}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 lg:w-72 shrink-0 bg-white/90 backdrop-blur-xl border-r border-r-gray-200/80 border-b border-b-gray-200/60 flex-col sidebar-elevated z-30 relative">
                {navContent}
            </aside>
        </>
    );
};

export default StudentSidebar;
