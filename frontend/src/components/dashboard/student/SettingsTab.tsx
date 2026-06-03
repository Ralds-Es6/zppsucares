import React from 'react';
import { motion } from 'framer-motion';
import {
    Lock, ChevronRight, ShieldCheck,
    Bell
} from 'lucide-react';

const SettingsTab: React.FC = () => {
    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <section className="glass p-10 rounded-[3rem] border border-white/20">
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Settings & Preferences</h2>
                <p className="text-gray-500 font-medium mb-12">Manage your account security and portal experience.</p>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Lock className="text-primary-main" size={20} /> Account Security
                            </h4>
                            <div className="space-y-4">
                                <button className="w-full text-left p-6 bg-white/40 hover:bg-white rounded-3xl border border-gray-100 transition-all flex items-center justify-between group">
                                    <div>
                                        <p className="font-bold text-gray-800">Change Password</p>
                                        <p className="text-xs text-gray-500 font-medium mt-1">Last updated 3 months ago</p>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-main transition-all" />
                                </button>
                                <button className="w-full text-left p-6 bg-white/40 hover:bg-white rounded-3xl border border-gray-100 transition-all flex items-center justify-between group">
                                    <div>
                                        <p className="font-bold text-gray-800">Two-Factor Authentication</p>
                                        <p className="text-xs text-green-500 font-bold mt-1 uppercase tracking-widest">Active & Secured</p>
                                    </div>
                                    <ShieldCheck size={20} className="text-green-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Bell className="text-primary-main" size={20} /> Portal Preferences
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-2">
                                    <div>
                                        <p className="font-bold text-gray-800">Email Notifications</p>
                                        <p className="text-xs text-gray-500 font-medium tracking-tight">Receive updates about appointments & reports</p>
                                    </div>
                                    <div className="w-14 h-8 bg-primary-main rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2">
                                    <div>
                                        <p className="font-bold text-gray-800">Dark Mode</p>
                                        <p className="text-xs text-gray-500 font-medium tracking-tight">Switch portal theme between light and dark</p>
                                    </div>
                                    <div className="w-14 h-8 bg-gray-200 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-400">
                        Version 1.0.4 (Stable)
                    </div>
                    <button className="bg-red-50 text-red-600 font-bold px-6 py-3 rounded-2xl hover:bg-red-100 transition-all">Deactivate Profile</button>
                </div>
            </section>
        </motion.div>
    );
};

export default SettingsTab;
