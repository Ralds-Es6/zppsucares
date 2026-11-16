import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldCheck, Clock, X } from 'lucide-react';
import VerifiedBadge from '../../common/VerifiedBadge';

export interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    isRead?: boolean;
    createdAt?: string;
    [key: string]: unknown;
}

export interface StudentUserHeader {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    studentProfile?: {
        studentId?: string;
        verificationStatus?: string;
    };
}

interface StudentHeaderProps {
    user: StudentUserHeader | null;
    notifications: NotificationItem[];
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    markNotificationAsRead: (id: string) => void;
    viewingNotification: NotificationItem | null;
    setViewingNotification: React.Dispatch<React.SetStateAction<NotificationItem | null>> | ((notification: NotificationItem | null) => void);
}

const StudentHeader: React.FC<StudentHeaderProps> = ({
    user,
    notifications,
    showNotifications,
    setShowNotifications,
    markNotificationAsRead,
    viewingNotification,
    setViewingNotification
}) => {
    const isVerified = user?.studentProfile?.verificationStatus === 'approved' || !user?.studentProfile?.verificationStatus;

    return (
        <header className="flex flex-row items-center justify-between gap-4 mb-8 md:mb-12">
            <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="truncate">Welcome, {user?.firstName}!</span>
                    {isVerified && <VerifiedBadge size="lg" />}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1 font-medium flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-500 shrink-0" />
                    <span>Your student portal is secured and active.</span>
                </p>
            </div>
            <div className="flex items-center gap-3 relative shrink-0">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all shadow-sm relative">
                    <motion.div
                        animate={notifications.some(n => !n.isRead) ? {
                            rotate: [0, -25, 25, -25, 25, 0],
                            scale: [1, 1.3, 1.3, 1.3, 1.3, 1],
                            color: ['#6b7280', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#6b7280']
                        } : {}}
                        transition={{
                            repeat: Infinity,
                            duration: 0.5,
                            repeatDelay: 3
                        }}
                    >
                        <Bell size={20} />
                    </motion.div>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                        <motion.span
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                            }}
                            className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        ></motion.span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                    {showNotifications && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-14 sm:top-16 right-0 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                        >
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="font-black text-gray-900">Notifications</h3>
                                <span className="text-xs font-bold bg-primary-100 text-primary-main px-2 py-1 rounded-full">
                                    {notifications.filter(n => !n.isRead).length} New
                                </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            onClick={() => {
                                                markNotificationAsRead(notification._id);
                                                setViewingNotification(notification);
                                                setShowNotifications(false);
                                            }}
                                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notification.isRead ? 'bg-primary-100 text-primary-main' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Bell size={14} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Recent'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                        <Bell size={32} className="text-gray-300 mb-2" />
                                        <p className="font-bold">You're all caught up!</p>
                                        <p className="text-xs mt-1">No new notifications here.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Notification Full Detail Modal */}
                <AnimatePresence>
                    {viewingNotification && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white w-full max-w-xl rounded-3xl sm:rounded-[3rem] p-5 sm:p-10 shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setViewingNotification(null)}
                                    className="absolute top-5 right-5 sm:top-8 sm:right-8 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                                    <div className="w-14 h-14 bg-primary-100 text-primary-main rounded-2xl flex items-center justify-center shadow-lg">
                                        <Bell size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 leading-tight">{viewingNotification.title}</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                            <Clock size={12} /> {viewingNotification.createdAt ? new Date(viewingNotification.createdAt).toLocaleString() : 'Recent'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingNotification.message}</p>
                                </div>

                                <button
                                    onClick={() => setViewingNotification(null)}
                                    className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-sm"
                                >
                                    Close Update
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default StudentHeader;
