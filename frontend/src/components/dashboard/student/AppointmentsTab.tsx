import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

interface AppointmentsTabProps {
    isAppointmentsLoading: boolean;
    appointments: any[];
    setShowCounselingModal: (show: boolean) => void;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
    isAppointmentsLoading,
    appointments,
    setShowCounselingModal
}) => {
    return (
        <motion.div
            key="appointments"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass p-8 rounded-[2.5rem] border border-white/20">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">My Private Consultations</h3>
                        <div className="space-y-6">
                            {isAppointmentsLoading ? (
                                <div className="p-10 text-center text-gray-400 font-bold">Checking Schedule...</div>
                            ) : appointments.length > 0 ? (
                                appointments.map((app: any) => {
                                    const appDate = new Date(app.date);
                                    const month = appDate.toLocaleString('default', { month: 'short' });
                                    const day = appDate.getDate();

                                    return (
                                        <div key={app._id} className="p-8 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:border-primary-main transition-all">
                                            <div className={`absolute top-0 right-0 w-32 h-20 bg-${app.status === 'Approved' ? 'green' : 'primary'}-light/10 rounded-bl-[4rem] group-hover:scale-110 transition-transform`}></div>
                                            <div className={`w-24 h-24 ${app.status === 'Approved' ? 'bg-green-600' : 'bg-primary-main'} text-white rounded-3xl flex flex-col items-center justify-center shadow-lg transition-colors`}>
                                                <span className="text-xs font-bold uppercase tracking-widest opacity-80">{month}</span>
                                                <span className="text-3xl font-black">{day}</span>
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h4 className="text-2xl font-black text-gray-900 mb-1">Private Counseling</h4>
                                                <p className="text-gray-500 font-bold flex items-center justify-center md:justify-start gap-2">
                                                    <Clock size={16} /> {app.timeSlot}
                                                </p>
                                                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${app.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                            'bg-blue-100 text-blue-700 border-blue-200'
                                                        } border`}>
                                                        {app.status}
                                                    </span>
                                                    {app.adminNotes && (
                                                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                                                            " {app.adminNotes} "
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                                    <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400 tracking-tight">No Appointments</h3>
                                    <p className="text-gray-400 mt-2">You have no upcoming or past private counseling sessions.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <section className="glass p-8 rounded-[2.5rem] border border-white/20 flex flex-col h-full bg-gradient-to-b from-white/40 to-white/10">
                    <div className="w-16 h-16 bg-accent-main/10 rounded-2xl flex items-center justify-center text-accent-main mb-6">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Request a Private Session</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">Schedule a strictly confidential 1-on-1 session with our guidance counselors. Information submitted here is isolated strictly for counseling integrity.</p>
                    <div className="space-y-3 mt-auto">
                        <button
                            onClick={() => setShowCounselingModal(true)}
                            className="w-full bg-accent-main hover:bg-yellow-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-accent-main/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar size={20} /> Request Schedule
                        </button>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default AppointmentsTab;
