import React from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap, User, Heart,
    ShieldCheck
} from 'lucide-react';
import VerifiedBadge from '../../common/VerifiedBadge';

export interface UserProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
}

export interface StudentProfileData {
    studentId?: string;
    department?: string;
    course?: string;
    yearLevel?: number | string;
    section?: string;
    physicalStatus?: string;
    mentalStatus?: string;
}

export interface LatestCaseData {
    _id?: string;
    referralTracking?: {
        latestStatusPhysical?: string;
        latestStatusMental?: string;
        behaviorStatus?: string;
    };
}

interface ProfileTabProps {
    user: UserProfile;
    studentData: StudentProfileData;
    latestCase: LatestCaseData | null;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
    user,
    studentData,
    latestCase
}) => {
    return (
        <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <section className="glass-slab p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-4xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                    <div className="relative">
                        <div className="w-38 h-38 sm:w-44 sm:h-44 rounded-3xl bg-white border-2 border-gray-100 p-2.5 shadow-xl flex items-center justify-center">
                            <div
                                className="w-full h-full rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#87CEFA]/40 ring-4 ring-[#87CEFA]/25"
                                style={{ backgroundColor: '#87CEFA' }}
                            >
                                <User size={68} className="text-white drop-shadow-md" strokeWidth={2.4} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2 sm:gap-3 flex-wrap">
                            {user.firstName} {user.lastName}
                            <VerifiedBadge size="xl" />
                        </h2>
                        <p className="text-primary-main font-bold text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                            < GraduationCap size={24} /> {studentData.course}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold border border-gray-200">ID: {studentData.studentId}</span>
                            {studentData.department && studentData.department !== 'N/A' && (
                                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold border border-purple-200">Dept: {studentData.department}</span>
                            )}
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">Year {studentData.yearLevel}</span>
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold border border-blue-200">Section {studentData.section}</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                <section className="glass-slab p-8 rounded-4xl">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">Personal Information</h3>
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100"><User size={28} /></div>
                            <div className="flex-1 border-b border-gray-50 pb-4">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                <p className="text-lg font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100"><Heart size={28} /></div>
                            <div className="flex-1 border-b border-gray-50 pb-4">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-lg font-bold text-gray-800">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100"><ShieldCheck size={28} /></div>
                            <div className="flex-1 border-b border-gray-50 pb-4">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                                <p className="text-lg font-bold text-primary-main capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-slab p-8 rounded-4xl">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">Specific Profiling</h3>
                    <div className="space-y-6">
                        <div className={`p-6 ${studentData.physicalStatus !== 'None Registered' ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'} rounded-3xl border`}>
                            <p className={`text-xs font-black ${studentData.physicalStatus !== 'None Registered' ? 'text-orange-400' : 'text-gray-400'} uppercase tracking-widest mb-2`}>Physical Condition</p>
                            <p className={`text-xl font-black ${studentData.physicalStatus !== 'None Registered' ? 'text-orange-900' : 'text-gray-900'}`}>{studentData.physicalStatus}</p>
                            <p className={`text-sm ${studentData.physicalStatus !== 'None Registered' ? 'text-orange-600' : 'text-gray-500'} mt-2`}>
                                {latestCase ? `Latest university clinic/counselor case tracking assessment.` : `No physical disabilities or impairments listed in government records.`}
                            </p>
                        </div>
                        <div className={`p-6 ${studentData.mentalStatus !== 'Good Standing' ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'} rounded-3xl border`}>
                            <p className={`text-xs font-black ${studentData.mentalStatus !== 'Good Standing' ? 'text-blue-400' : 'text-green-400'} uppercase tracking-widest mb-2`}>Mental Wellbeing</p>
                            <p className={`text-xl font-black ${studentData.mentalStatus !== 'Good Standing' ? 'text-blue-900' : 'text-green-900'}`}>{studentData.mentalStatus}</p>
                            <p className={`text-sm ${studentData.mentalStatus !== 'Good Standing' ? 'text-blue-600' : 'text-green-600'} mt-2`}>
                                {latestCase ? `Latest referral track status logged by administration.` : `Currently monitored for standard academic stress management.`}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default ProfileTab;
