import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Palette as PaletteIcon } from 'lucide-react';

const SystemSettings: React.FC = () => {
    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl space-y-8"
        >
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">System Settings</h1>
                <p className="text-gray-500 font-medium text-lg mt-1 italic">Manage global preferences and application security.</p>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <div className="flex border-b border-gray-100 bg-gray-50/30">
                    {['General', 'Security', 'Branding', 'Notifications'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${tab === 'General' ? 'text-primary-main bg-white' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                            {tab === 'General' && <motion.div layoutId="activeSettingTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-main" />}
                        </button>
                    ))}
                </div>

                <div className="p-12 space-y-12">
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-main shadow-inner">
                                <PaletteIcon size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Portal Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Portal Display Name</label>
                                <input type="text" defaultValue="ZPPSU CARES" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-main focus:shadow-xl focus:shadow-primary-main/5 transition-all outline-none font-bold text-gray-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official System Email</label>
                                <input type="email" defaultValue="admin@zppsu.edu.ph" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-main focus:shadow-xl focus:shadow-primary-main/5 transition-all outline-none font-bold text-gray-800" />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-main shadow-inner">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Security Protocol</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:border-primary-main/20 transition-all group">
                                <div>
                                    <p className="font-black text-gray-900 uppercase tracking-tight text-lg">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-400 font-bold mt-1 italic uppercase tracking-widest">Enforce biometric or SMS verification for admins.</p>
                                </div>
                                <div className="w-16 h-8 bg-primary-main rounded-full relative cursor-pointer shadow-lg shadow-primary-main/20">
                                    <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full transition-transform"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:border-primary-main/20 transition-all group">
                                <div>
                                    <p className="font-black text-gray-900 uppercase tracking-tight text-lg">Automated Cloud Backups</p>
                                    <p className="text-xs text-gray-400 font-bold mt-1 italic uppercase tracking-widest">Perform nightly redundancy sync of all student reports.</p>
                                </div>
                                <div className="w-16 h-8 bg-gray-200 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-10 border-t border-gray-100 flex justify-end gap-4">
                        <button className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors">Discard Local Edits</button>
                        <button className="px-10 py-4 bg-primary-main text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-900 transition-all shadow-2xl shadow-primary-main/30 active:scale-95">Save Global Configuration</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemSettings;
