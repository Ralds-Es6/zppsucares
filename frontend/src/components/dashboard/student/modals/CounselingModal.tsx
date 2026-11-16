import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import ReactCalendar from 'react-calendar';

interface CounselingModalProps {
    showCounselingModal: boolean;
    setShowCounselingModal: (show: boolean) => void;
    handleCreateAppointment: (e: React.FormEvent) => void;
    getMinSelectableDate: () => Date;
    handleSelectDate: (date: Date) => void;
    counselingDate: string;
    counselingTime: string;
    setCounselingTime: (time: string) => void;
    isSlotsLoading: boolean;
    availableSlots: string[];
    counselingReason: string;
    setCounselingReason: (reason: string) => void;
}

const CounselingModal: React.FC<CounselingModalProps> = ({
    showCounselingModal,
    setShowCounselingModal,
    handleCreateAppointment,
    getMinSelectableDate,
    handleSelectDate,
    counselingDate,
    counselingTime,
    setCounselingTime,
    isSlotsLoading,
    availableSlots,
    counselingReason,
    setCounselingReason
}) => {
    return (
        <AnimatePresence>
            {showCounselingModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass-modal w-full max-w-2xl max-h-[90vh] rounded-3xl sm:rounded-[3rem] p-5 sm:p-10 relative overflow-y-auto custom-scrollbar"
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 text-accent-main rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Calendar size={28} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">REQUEST COUNSELING</h2>
                            <p className="text-gray-500 font-medium italic mt-2">Strictly confidential private session scheduling.</p>
                        </div>

                        <form onSubmit={handleCreateAppointment} className="space-y-6">
                            <div className="space-y-4 max-w-full overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Schedule (Excludes Weekends)</label>
                                </div>

                                <div className="flex justify-center bg-gray-50 p-6 rounded-3xl border-2 border-transparent shadow-inner">
                                    <style>{`
                                        .react-calendar { border: none; width: 100%; font-family: inherit; background: transparent; }
                                        .react-calendar__navigation button { font-weight: 800; font-size: 1rem; border-radius: 0.5rem; }
                                        .react-calendar__navigation button:disabled { background-color: transparent; }
                                        .react-calendar__navigation button:enabled:hover { background-color: #f3f4f6; }
                                        .react-calendar__month-view__days__day--weekend { color: #d1d5db; }
                                        .react-calendar__tile { font-weight: 700; padding: 0.75rem 0.5rem; border-radius: 0.5rem; }
                                        .react-calendar__tile:disabled { background-color: transparent; color: #d1d5db; text-decoration: line-through; cursor: not-allowed; }
                                        .react-calendar__tile--now { background: #fee2e2; color: #ef4444; border-radius: 0.5rem; }
                                        .react-calendar__tile--active { background: #008751 !important; color: white !important; font-weight: 900; border-radius: 0.5rem; box-shadow: 0 4px 14px -4px rgba(0, 135, 81, 0.4); }
                                        .react-calendar__tile:enabled:hover { background-color: #e5e7eb; border-radius: 0.5rem; }
                                    `}</style>
                                    <ReactCalendar
                                        minDate={getMinSelectableDate()}
                                        tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6}
                                        onChange={(val) => {
                                            if (val && !Array.isArray(val)) {
                                                handleSelectDate(val as Date);
                                            }
                                        }}
                                        value={counselingDate ? new Date(counselingDate) : null}
                                    />
                                </div>
                            </div>

                            {counselingDate && (
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Available Time Slots</label>
                                    <div className="relative">
                                        <select
                                            value={counselingTime}
                                            onChange={(e) => setCounselingTime(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-accent-main focus:bg-white transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                                            required
                                            disabled={isSlotsLoading || availableSlots.length === 0}
                                        >
                                            {isSlotsLoading ? (
                                                <option value="" disabled>Loading slots...</option>
                                            ) : availableSlots.length === 0 ? (
                                                <option value="" disabled>No Time Available</option>
                                            ) : (
                                                <option value="" disabled>Select a Time Slot</option>
                                            )}
                                            {!isSlotsLoading && [
                                                '9:00 AM - 10:00 AM',
                                                '10:00 AM - 11:00 AM',
                                                '11:00 AM - 12:00 PM',
                                                '1:00 PM - 2:00 PM',
                                                '2:00 PM - 3:00 PM',
                                                '3:00 PM - 4:00 PM',
                                                '4:00 PM - 5:00 PM'
                                            ].map((slot) => {
                                                const isAvailable = availableSlots.includes(slot);
                                                if (!isAvailable) return null; // Only show available slots in dropdown
                                                return (
                                                    <option key={slot} value={slot}>
                                                        {slot}
                                                    </option>
                                                );
                                            })}
                                        </select>

                                        {/* Dropdown Icon */}
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    {availableSlots.length === 0 && !isSlotsLoading && (
                                        <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1">
                                            <AlertCircle size={12} /> All slots are fully booked for this day.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Reason for consultation</label>
                                <textarea
                                    required
                                    value={counselingReason}
                                    onChange={(e) => setCounselingReason(e.target.value)}
                                    rows={3}
                                    placeholder="Briefly state your concern (fully encrypted & isolated)..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-accent-main focus:bg-white transition-all font-bold text-gray-800 placeholder-gray-300 resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowCounselingModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={!counselingDate || !counselingTime || !counselingReason}
                                    className="flex-1 py-4 bg-accent-main text-white rounded-2xl font-black shadow-lg shadow-accent-main/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Confirm Slot
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CounselingModal;
