import React, { useState } from 'react';
import {
    LayoutDashboard, Users, Activity, Calendar, HandHelping, Settings,
    LogOut, Shield, UserCheck, User, UserCog, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import guidanceLogo from '../../../assets/guidance_logo.jpeg';
import { authStorage } from '../../../utils/authStorage';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
    pendingCount?: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeTab,
    setActiveTab,
    handleLogout,
    pendingCount = 0
}) => {
    const adminInfo = authStorage.getAdmin();
    const isSuperAdmin = adminInfo?.role === 'admin';
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleSelectTab = (tab: string) => {
        setActiveTab(tab);
        setIsMobileOpen(false);
    };

    const navContent = (
        <>
            <div className="p-6 sm:p-8 border-b border-gray-100/60 bg-transparent">
                <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-3">
                        <img src={guidanceLogo} alt="ZPPSU GCTSO Seal" className="w-12 h-12 sm:w-13 sm:h-13 object-cover rounded-full shadow-lg" style={{ borderRadius: '50%' }} />
                        <div>
                            <h2 className="font-extrabold text-gray-900 text-lg leading-tight uppercase tracking-tight">ZPPSU CARES</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <p className="text-[10px] text-primary-main font-bold uppercase tracking-[0.2em]">
                                    {isSuperAdmin ? 'Super Command' : 'Staff Portal'}
                                </p>
                            </div>
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
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-3 mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Welfare & Guidance</p>
                </div>

                <button
                    onClick={() => handleSelectTab('dashboard')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'dashboard'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <LayoutDashboard size={20} className="shrink-0" />
                        <span>Welfare Overview</span>
                    </div>
                    {activeTab === 'dashboard' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('verifications')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer group ${
                        activeTab === 'verifications'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <UserCheck size={20} className="shrink-0" />
                        <span className="whitespace-nowrap">Student Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {pendingCount > 0 && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs transition-colors ${
                                activeTab === 'verifications'
                                    ? 'bg-sky-200 text-sky-900'
                                    : 'bg-amber-500 text-white group-hover:bg-sky-200 group-hover:text-sky-900'
                            }`}>
                                {pendingCount}
                            </span>
                        )}
                        {activeTab === 'verifications' && (
                            <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                        )}
                    </div>
                </button>
                <button
                    onClick={() => handleSelectTab('cases')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'cases'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Shield size={20} className="shrink-0" />
                        <span>Welfare Cases</span>
                    </div>
                    {activeTab === 'cases' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('faculty')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'faculty'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Users size={20} className="shrink-0" />
                        <span>Faculty & Counselors</span>
                    </div>
                    {activeTab === 'faculty' && (
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
                        <Activity size={20} className="shrink-0" />
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
                        <span>Counseling Sessions</span>
                    </div>
                    {activeTab === 'appointments' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => handleSelectTab('pipeline')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        activeTab === 'pipeline'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                            : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <HandHelping size={20} className="shrink-0" />
                        <span>Grants & Assistance</span>
                    </div>
                    {activeTab === 'pipeline' && (
                        <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                    )}
                </button>

                {isSuperAdmin && (
                    <>
                        <div className="pt-6 px-4 pb-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Governance</p>
                        </div>
                        <button
                            onClick={() => handleSelectTab('accounts')}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                                activeTab === 'accounts'
                                    ? 'bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm shadow-sky-500/10 translate-x-1.5 font-bold'
                                    : 'text-gray-600 border border-transparent hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-100 hover:shadow-xs hover:translate-x-1 font-semibold'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <UserCog size={20} className="shrink-0" />
                                <span>Account Directory</span>
                            </div>
                            {activeTab === 'accounts' && (
                                <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                            )}
                        </button>
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
                                <span>System Settings</span>
                            </div>
                            {activeTab === 'settings' && (
                                <span className="w-1.5 h-4.5 rounded-full bg-[#87CEFA] shadow-xs shrink-0" />
                            )}
                        </button>
                    </>
                )}
            </nav>

            {/* Desktop-only institutional footer to anchor sidebar bottom */}
            <div className="hidden md:block p-4 border-t border-gray-100/80 bg-gray-50/40">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                    <div className="min-w-0">
                        <p className="text-[11px] font-black text-gray-800 uppercase tracking-wider truncate">ZPPSU • GCTSO</p>
                        <p className="text-[10px] font-medium text-gray-400 truncate">Student Welfare Portal</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                    </span>
                </div>
            </div>

            {/* Mobile-only footer inside slide-over drawer */}
            <div className="md:hidden p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
                <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#87CEFA]/40 ring-4 ring-[#87CEFA]/25 shrink-0"
                        style={{ backgroundColor: '#87CEFA' }}
                    >
                        <User size={22} className="text-white drop-shadow-sm" strokeWidth={2.4} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-extrabold text-gray-900 text-sm truncate">
                            {adminInfo?.firstName ? `${adminInfo.firstName} ${adminInfo.lastName}` : (isSuperAdmin ? 'Administrator' : 'Staff Officer')}
                        </p>
                        <p className="text-[10px] text-primary-main font-black uppercase tracking-wider">
                            {isSuperAdmin ? 'Super Administrator' : 'Staff Officer (Sub-Admin)'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-50 text-red-600 hover:bg-red-100/90 hover:text-red-700 rounded-2xl font-bold transition-all duration-200 cursor-pointer group"
                >
                    <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                    <span>Logout</span>
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
                        <p className="text-[9px] text-primary-main font-bold uppercase tracking-widest">
                            {isSuperAdmin ? 'Super Command' : 'Staff Portal'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {pendingCount > 0 && (
                        <button
                            onClick={() => handleSelectTab('verifications')}
                            className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-xs"
                        >
                            {pendingCount} Pending
                        </button>
                    )}
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>
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
            <aside className="hidden md:flex md:sticky md:top-0 md:h-screen w-72 shrink-0 bg-white/90 backdrop-blur-xl border-r border-gray-200/80 flex-col sidebar-elevated z-30">
                {navContent}
            </aside>
        </>
    );
};

export default AdminSidebar;
