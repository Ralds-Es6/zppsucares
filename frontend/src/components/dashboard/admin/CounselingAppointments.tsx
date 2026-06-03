import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

interface CounselingAppointmentsProps {
    appointments: any[];
    isAppointmentsLoading: boolean;
    setProcessingAppointment: (app: any) => void;
}

const CounselingAppointments: React.FC<CounselingAppointmentsProps> = ({
    appointments,
    isAppointmentsLoading,
    setProcessingAppointment
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Counseling Appointments</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">Review and manage private session requests.</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-8 py-6 font-black text-left">Requesting Student</th>
                            <th className="px-8 py-6 font-black text-left">Proposed Schedule</th>
                            <th className="px-8 py-6 font-black text-left">Intention / Reason</th>
                            <th className="px-8 py-6 font-black text-left">Flow Status</th>
                            <th className="px-8 py-6 font-black text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isAppointmentsLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-20">
                                    <div className="w-10 h-10 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Accessing Calendars...</p>
                                </td>
                            </tr>
                        ) : appointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Counseling Requests</h3>
                                    <p className="text-gray-400 mt-2 font-medium">Session requests from students will appear here.</p>
                                </td>
                            </tr>
                        ) : (
                            appointments.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-main flex items-center justify-center font-black uppercase shadow-sm border border-primary-50">
                                                {app.student?.firstName?.[0]}{app.student?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-primary-main transition-colors">{app.student?.firstName} {app.student?.lastName}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                                                    STU-ID: {app.student?.studentProfile?.studentId || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-gray-900 font-black text-sm uppercase tracking-tight">{new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <div className="text-primary-main text-[10px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                            <Clock size={12} /> {app.timeSlot}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-600 text-sm max-w-[240px] truncate italic font-medium">
                                        "{app.reason}"
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border
                                            ${app.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    app.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                        `}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setProcessingAppointment(app)}
                                            className="px-6 py-2.5 bg-primary-main text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-main/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Review Request
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default CounselingAppointments;
