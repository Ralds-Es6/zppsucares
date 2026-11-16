import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Heart, FileText, User,
    BookOpen, GraduationCap, Calendar, Clock, Building2
} from 'lucide-react';

export interface StudentOverviewData {
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

export interface AppointmentItem {
    _id: string;
    status: string;
    date: string | Date;
    timeSlot: string;
}

interface OverviewTabProps {
    studentData: StudentOverviewData;
    appointments: AppointmentItem[];
    setActiveTab: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    studentData,
    appointments,
    setActiveTab
}) => {
    return (
        <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-slab-interactive p-6 rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-light/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-colors group-hover:bg-primary-light"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-primary-100 text-primary-main rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-wider mb-1">Health Status</h3>
                        <p className="text-2xl font-black text-gray-900 tracking-tight">{studentData.status}</p>
                    </div>
                </div>

                <div className="glass-slab-interactive p-6 rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-colors group-hover:bg-blue-100"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <Heart size={24} />
                        </div>
                        <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-wider mb-1">Assigned Counselor</h3>
                        <p className="text-2xl font-black text-gray-900 truncate tracking-tight">{studentData.assignedCounselor}</p>
                    </div>
                </div>

                <div className="glass-slab-interactive p-6 rounded-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-light/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-colors group-hover:bg-accent-light"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-accent-light text-accent-main rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-gray-400 font-extrabold text-[10px] uppercase tracking-wider mb-1">Active Reports</h3>
                        <p className="text-2xl font-black text-gray-900 tracking-tight">{studentData.concernsRaised} Pending</p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* Profile Summary */}
                <section className="glass-slab p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-4xl">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight uppercase">
                        <User className="text-primary-main" size={24} /> Profile Summary
                    </h3>
                    <div className="space-y-6">
                        {studentData.department && studentData.department !== 'N/A' && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm"><Building2 size={24} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">College / Department</p>
                                    <p className="font-bold text-gray-900">{studentData.department}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-main shadow-sm"><BookOpen size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Course & Major</p>
                                <p className="font-bold text-gray-900">{studentData.course}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><GraduationCap size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Year & Section</p>
                                <p className="font-bold text-gray-900">Year {studentData.yearLevel} • Section {studentData.section}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary-main/5 text-primary-main rounded-2xl border border-primary-100">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Physical Concern</p>
                                <p className="font-bold">{studentData.physicalStatus}</p>
                            </div>
                            <div className="p-4 bg-accent-main/5 text-accent-main rounded-2xl border border-accent-light">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Mental Wellbeing</p>
                                <p className="font-bold">{studentData.mentalStatus}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Appointments */}
                <section className="glass-slab p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-4xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tight uppercase">
                            <Calendar className="text-primary-main" size={24} /> Appointments
                        </h3>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className="text-primary-main font-bold text-xs uppercase tracking-wider hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <p className="text-sm text-gray-500 font-bold p-4 text-center">No upcoming appointments.</p>
                        ) : appointments.slice(0, 3).map((app) => (
                            <div key={app._id} className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary-main transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${app.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : app.status === 'Approved' ? 'bg-primary-50 text-primary-main' : 'bg-gray-50 text-gray-600'}`}>
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Counseling Session</p>
                                        <p className="text-xs text-gray-500 font-medium">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {app.timeSlot}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : app.status === 'Approved' ? 'bg-primary-100 text-primary-main' : 'bg-gray-100 text-gray-700'}`}>
                                        {app.status}
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{studentData.assignedCounselor}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default OverviewTab;
