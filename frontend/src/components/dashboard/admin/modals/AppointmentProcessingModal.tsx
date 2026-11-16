import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, X, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

interface AppointmentProcessingModalProps {
    appointment: any;
    onClose: () => void;
    onUpdateStatus: (id: string, status: string, notes: string) => void;
}

const AppointmentProcessingModal: React.FC<AppointmentProcessingModalProps> = ({
    appointment,
    onClose,
    onUpdateStatus
}) => {
    const [status, setStatus] = useState(appointment?.status || 'Pending');
    const [notes, setNotes] = useState(appointment?.adminNotes || '');

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="glass-modal w-full max-w-2xl rounded-3xl sm:rounded-[3rem] relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Modal Header */}
                <div className="p-5 sm:p-10 pb-5 sm:pb-6 border-b border-gray-100 relative bg-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[4rem] z-0"></div>
                    <div className="flex justify-between items-start gap-3 relative z-10">
                        <div className="space-y-1 min-w-0">
                            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2 sm:gap-3 uppercase">
                                <Calendar className="text-primary-main shrink-0" size={26} /> REVIEW APPOINTMENT
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary-main text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary-main/20">
                                    {appointment.student?.firstName[0]}{appointment.student?.lastName[0]}
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-900 leading-tight">{appointment.student?.firstName} {appointment.student?.lastName}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Counseling Request Log</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={24} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-gray-50/30">
                    <section className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Requested Date</p>
                            <p className="font-extrabold text-gray-900">{new Date(appointment.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Time Slot</p>
                            <p className="font-extrabold text-primary-main uppercase flex items-center gap-2"><Clock size={14} /> {appointment.timeSlot}</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student's Stated Reason</label>
                        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
                            <div className="absolute top-6 right-6 text-primary-main/10 group-hover:text-primary-main/20 transition-colors">
                                <MessageSquare size={48} />
                            </div>
                            <p className="text-gray-800 font-black text-lg leading-relaxed italic relative z-10">"{appointment.reason}"</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Status</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Pending', 'Approved', 'Rejected', 'Completed'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${status === s ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Internal Remarks / Notes (Visible to Student)</label>
                        <div className="relative">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Instructions or feedback for the student regarding this appointment..."
                                className="w-full p-8 bg-white border-2 border-transparent rounded-[2.5rem] outline-none focus:border-primary-main transition-all font-bold text-gray-800 shadow-sm placeholder-gray-300 resize-none"
                            ></textarea>
                        </div>
                    </section>
                </div>

                <div className="p-8 border-t border-gray-100 bg-white flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 bg-white text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onUpdateStatus(appointment._id, status, notes)}
                        className="flex-2 py-5 bg-primary-main text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-main/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <ShieldCheck size={18} /> Update Appointment State
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AppointmentProcessingModal;
