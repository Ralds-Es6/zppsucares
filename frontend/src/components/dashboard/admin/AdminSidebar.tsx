import React from 'react';
import {
    LayoutDashboard, Users, Activity, Calendar, HandHelping, Settings,
    LogOut, Shield
} from 'lucide-react';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeTab,
    setActiveTab,
    handleLogout
}) => {
    return (
        <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm hidden md:flex z-20 relative">
            <div className="p-8 border-b border-gray-100 bg-white/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-main text-white rounded-[1rem] flex items-center justify-center font-black text-xl shadow-lg shadow-primary-main/20">
                        ZC
                    </div>
                    <div>
                        <h2 className="font-extrabold text-gray-900 text-lg leading-tight uppercase tracking-tight">ZPPSU CARES</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <p className="text-[10px] text-primary-main font-bold uppercase tracking-[0.2em]">Management</p>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-3 mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Core Command</p>
                </div>

                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <LayoutDashboard size={20} /> Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('cases')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'cases' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Shield size={20} /> Case Files
                </button>
                <button
                    onClick={() => setActiveTab('faculty')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'faculty' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Users size={20} /> Faculty
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'reports' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Activity size={20} /> Reports
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'appointments' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Calendar size={20} /> Counseling
                </button>
                <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'pipeline' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <HandHelping size={20} /> Assistance
                </button>

                <div className="pt-8 px-4 pb-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuration</p>
                </div>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${activeTab === 'settings' ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Settings size={20} /> Settings
                </button>
            </nav>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
