import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    UserX,
    UserCheck,
    Lock,
    Unlock,
    Megaphone,
    Save,
    RotateCcw,
    AlertTriangle,
    Info,
    AlertCircle,
    Eye
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { authStorage } from '../../../utils/authStorage';

export interface SystemSettingsData {
    academicYear: string;
    semester: string;
    allowStudentRegistration: boolean;
    studentLoginAccess: boolean;
    registrationClosedMessage: string;
    maintenanceMessage: string;
    announcementBanner: {
        isActive: boolean;
        message: string;
        type: 'info' | 'warning' | 'alert';
    };
    updatedBy?: string;
    updatedAt?: string;
}

const DEFAULT_SETTINGS: SystemSettingsData = {
    academicYear: '2025-2026',
    semester: '2nd Semester',
    allowStudentRegistration: true,
    studentLoginAccess: true,
    registrationClosedMessage: 'Student self-registration is currently closed by the University Administration for this academic term.',
    maintenanceMessage: 'Student Portal is temporarily in maintenance mode for semester processing. Guidance and Counseling offices remain open.',
    announcementBanner: {
        isActive: false,
        message: 'Welcome to the new academic semester! Please verify your student profile with the Guidance Office.',
        type: 'info'
    }
};

const SystemSettings: React.FC = () => {
    const [settings, setSettings] = useState<SystemSettingsData>(DEFAULT_SETTINGS);
    const [originalSettings, setOriginalSettings] = useState<SystemSettingsData>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'Academic & Access' | 'Announcement Banner'>('Academic & Access');

    const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    const fetchSettings = async () => {
        try {
            const admin = authStorage.getAdmin();
            const { data } = await axios.get('/api/settings/admin', {
                headers: { Authorization: `Bearer ${admin?.token}` }
            });
            if (data) {
                setSettings(data);
                setOriginalSettings(data);
            }
        } catch (error: unknown) {
            console.error('Failed to load system settings', error);
            toast.error('Failed to fetch system settings. Showing local defaults.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            const admin = authStorage.getAdmin();
            const { data } = await axios.put('/api/settings/admin', settings, {
                headers: { Authorization: `Bearer ${admin?.token}` }
            });
            setSettings(data.settings);
            setOriginalSettings(data.settings);
            toast.success('System configuration saved & enforced university-wide!');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error('Error saving settings', error);
            toast.error(err.response?.data?.message || 'Failed to save system settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        setSettings(originalSettings);
        toast.info('Local edits discarded.');
    };

    if (isLoading) {
        return (
            <div className="py-24 text-center">
                <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading System Controls...</p>
            </div>
        );
    }

    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-5xl space-y-8 pb-16"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">System Settings & Controls</h1>
                    <p className="text-gray-500 font-medium text-lg mt-1 italic">
                        Configure academic terms, student registration toggles, and portal access lockdown.
                    </p>
                </div>

                {hasUnsavedChanges && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-5 py-3 rounded-2xl shadow-sm"
                    >
                        <AlertCircle className="text-amber-600" size={18} />
                        <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Unsaved Changes</span>
                    </motion.div>
                )}
            </div>

            {/* Container */}
            <div className="glass-slab rounded-4xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/60 px-4 pt-3 gap-2">
                    {(['Academic & Access', 'Announcement Banner'] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 text-xs font-black uppercase tracking-wider transition-all relative rounded-t-2xl ${
                                activeTab === tab
                                    ? 'text-primary-main bg-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/60'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-main rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-8 sm:p-12 space-y-10">
                    {activeTab === 'Academic & Access' && (
                        <div className="space-y-10">
                            {/* Academic Term Configuration */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-main font-bold">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Active Academic Session</h3>
                                        <p className="text-xs text-gray-400">Controls the current semester tag applied to registrations, reports, and grants.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Academic Year</label>
                                        <input
                                            type="text"
                                            value={settings.academicYear}
                                            onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                                            placeholder="e.g. 2025-2026"
                                            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-main/10 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Semester / Term</label>
                                        <select
                                            value={settings.semester}
                                            onChange={(e) => setSettings({ ...settings, semester: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-main/10 transition-all"
                                        >
                                            <option value="1st Semester">1st Semester</option>
                                            <option value="2nd Semester">2nd Semester</option>
                                            <option value="Summer Term">Summer Term</option>
                                            <option value="Midyear Term">Midyear Term</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Access Control Toggles */}
                            <section className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Student Access & Gatekeeping</h3>
                                    <p className="text-xs text-gray-400">Real-time switches to allow, pause, or freeze student access across the entire university.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Toggle 1: Student Registration */}
                                    <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                                        settings.allowStudentRegistration
                                            ? 'bg-emerald-50/30 border-emerald-200/60'
                                            : 'bg-amber-50/40 border-amber-200'
                                    }`}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                                    settings.allowStudentRegistration ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {settings.allowStudentRegistration ? <UserCheck size={24} /> : <UserX size={24} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">
                                                            Student Self-Registration
                                                        </h4>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            settings.allowStudentRegistration ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                        }`}>
                                                            {settings.allowStudentRegistration ? 'Active (Open)' : 'Paused (Closed)'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium mt-1">
                                                        When disabled, new students cannot register accounts. Existing students can still log in normally.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Toggle Switch */}
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, allowStudentRegistration: !settings.allowStudentRegistration })}
                                                className={`w-16 h-9 rounded-full relative transition-colors p-1 shrink-0 ${
                                                    settings.allowStudentRegistration ? 'bg-emerald-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <motion.div
                                                    layout
                                                    className="w-7 h-7 bg-white rounded-full shadow-md"
                                                    animate={{ x: settings.allowStudentRegistration ? 28 : 0 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>

                                        {!settings.allowStudentRegistration && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-6 pt-6 border-t border-amber-200/80 space-y-2"
                                            >
                                                <label className="text-xs font-black text-amber-900 uppercase tracking-wider">
                                                    Notice Shown to Students when Registration is Closed:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.registrationClosedMessage}
                                                    onChange={(e) => setSettings({ ...settings, registrationClosedMessage: e.target.value })}
                                                    className="w-full px-5 py-3 bg-white border border-amber-300 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-amber-400"
                                                />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Toggle 2: Student Portal Login Access */}
                                    <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                                        settings.studentLoginAccess
                                            ? 'bg-blue-50/30 border-blue-200/60'
                                            : 'bg-rose-50/50 border-rose-300'
                                    }`}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                                    settings.studentLoginAccess ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {settings.studentLoginAccess ? <Unlock size={24} /> : <Lock size={24} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">
                                                            Student Portal Login Access
                                                        </h4>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            settings.studentLoginAccess ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                                                        }`}>
                                                            {settings.studentLoginAccess ? 'Normal (Unlocked)' : 'Maintenance (Locked)'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium mt-1">
                                                        When locked, students are blocked from logging in. <strong className="text-gray-800">Faculty and Admins remain 100% accessible.</strong>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Toggle Switch */}
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, studentLoginAccess: !settings.studentLoginAccess })}
                                                className={`w-16 h-9 rounded-full relative transition-colors p-1 shrink-0 ${
                                                    settings.studentLoginAccess ? 'bg-blue-600' : 'bg-rose-600'
                                                }`}
                                            >
                                                <motion.div
                                                    layout
                                                    className="w-7 h-7 bg-white rounded-full shadow-md"
                                                    animate={{ x: settings.studentLoginAccess ? 28 : 0 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>

                                        {!settings.studentLoginAccess && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-6 pt-6 border-t border-rose-200 space-y-2"
                                            >
                                                <label className="text-xs font-black text-rose-900 uppercase tracking-wider">
                                                    Notice Shown to Students attempting Login during Maintenance:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.maintenanceMessage}
                                                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                                    className="w-full px-5 py-3 bg-white border border-rose-300 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-rose-400"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'Announcement Banner' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-main font-bold">
                                    <Megaphone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">University Announcement Banner</h3>
                                    <p className="text-xs text-gray-400">Broadcast a real-time banner displayed on student and portal dashboards.</p>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 bg-gray-50/80 rounded-3xl border border-gray-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Display Banner</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Toggle banner visibility across student accounts</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSettings({
                                                ...settings,
                                                announcementBanner: {
                                                    ...settings.announcementBanner,
                                                    isActive: !settings.announcementBanner.isActive
                                                }
                                            })
                                        }
                                        className={`w-16 h-9 rounded-full relative transition-colors p-1 shrink-0 ${
                                            settings.announcementBanner.isActive ? 'bg-primary-main' : 'bg-gray-300'
                                        }`}
                                    >
                                        <motion.div
                                            layout
                                            className="w-7 h-7 bg-white rounded-full shadow-md"
                                            animate={{ x: settings.announcementBanner.isActive ? 28 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {(['info', 'warning', 'alert'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                setSettings({
                                                    ...settings,
                                                    announcementBanner: { ...settings.announcementBanner, type }
                                                })
                                            }
                                            className={`p-4 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                                settings.announcementBanner.type === type
                                                    ? 'border-primary-main bg-white shadow-md text-primary-main ring-2 ring-primary-main/20'
                                                    : 'border-gray-200 bg-white/60 text-gray-500 hover:bg-white'
                                            }`}
                                        >
                                            {type === 'info' && <Info size={16} className="text-blue-500" />}
                                            {type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                                            {type === 'alert' && <AlertCircle size={16} className="text-rose-500" />}
                                            {type} style
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Announcement Text</label>
                                    <textarea
                                        rows={3}
                                        value={settings.announcementBanner.message}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                announcementBanner: { ...settings.announcementBanner, message: e.target.value }
                                            })
                                        }
                                        placeholder="Type important notice or announcement..."
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-medium text-sm text-gray-900 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-main/10 transition-all"
                                    />
                                </div>

                                {/* Live Preview */}
                                <div className="space-y-2 pt-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Eye size={12} /> Student Dashboard Live Preview:
                                    </span>
                                    <div
                                        className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                                            settings.announcementBanner.type === 'alert'
                                                ? 'bg-rose-50 border-rose-200 text-rose-900'
                                                : settings.announcementBanner.type === 'warning'
                                                ? 'bg-amber-50 border-amber-200 text-amber-900'
                                                : 'bg-blue-50 border-blue-200 text-blue-900'
                                        }`}
                                    >
                                        <div className="shrink-0">
                                            {settings.announcementBanner.type === 'alert' && <AlertCircle size={20} className="text-rose-600" />}
                                            {settings.announcementBanner.type === 'warning' && <AlertTriangle size={20} className="text-amber-600" />}
                                            {settings.announcementBanner.type === 'info' && <Info size={20} className="text-blue-600" />}
                                        </div>
                                        <div className="text-xs font-bold leading-relaxed">
                                            {settings.announcementBanner.message || 'No announcement message entered.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-400 font-medium">
                            {settings.updatedBy && (
                                <span>
                                    Last modified by <strong className="text-gray-700">{settings.updatedBy}</strong>
                                    {settings.updatedAt && ` on ${new Date(settings.updatedAt).toLocaleDateString()}`}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleDiscard}
                                disabled={!hasUnsavedChanges || isSaving}
                                className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={16} /> Discard Edits
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSave()}
                                disabled={!hasUnsavedChanges || isSaving}
                                className="flex-1 sm:flex-initial px-8 py-3.5 bg-primary-main text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-primary-900 transition-all shadow-xl shadow-primary-main/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 active:scale-95"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                Save & Enforce
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemSettings;
