import React from 'react';
import {
    User, FileText, Calendar, HandHelping, Settings,
    LogOut, Activity
} from 'lucide-react';

interface StudentSidebarProps {
    user: any;
    studentData: any;
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
    return (
        <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm hidden md:flex z-20 relative">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary-main text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                        ZC
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg leading-tight uppercase tracking-tight">ZPPSU CARES</h2>
                        <p className="text-[10px] text-primary-main font-bold uppercase tracking-widest">Student Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-main border-2 border-white shadow-sm overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}&backgroundColor=f8fafc`} alt="User avatar" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 font-medium">{studentData?.studentId}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${activeTab === 'overview' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Activity size={20} /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${activeTab === 'profile' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <User size={20} /> My Profile
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${activeTab === 'reports' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <FileText size={20} /> Support Reports
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${activeTab === 'appointments' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Calendar size={20} /> Appointments
                </button>
                <button
                    onClick={() => setActiveTab('grants')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${activeTab === 'grants' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <HandHelping size={20} /> Grants & Aid
                </button>
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${activeTab === 'settings' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20 translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Settings size={20} /> Settings
                    </button>
                </div>
            </nav>

            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-bold transition-all"
                >
                    <LogOut size={20} /> Secure Logout
                </button>
            </div>
        </aside>
    );
};

export default StudentSidebar;
