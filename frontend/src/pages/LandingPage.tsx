import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Accessibility, BrainCircuit, Users, ChevronRight, Phone, User, Menu, X, ShieldCheck } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import guidanceLogo from '../assets/guidance_logo.jpeg';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-bg-light overflow-x-hidden">
            {/* Navigation Bar */}
            <nav className="fixed w-full z-50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            <img src={guidanceLogo} alt="ZPPSU GCTSO Seal" className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-full shadow-lg hover:scale-105 transition-transform shrink-0" style={{ borderRadius: '50%' }} />
                            <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-primary-900 truncate">
                                ZPPSU <span className="text-accent-main">CARES</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#about" className="text-gray-600 hover:text-primary-main font-medium transition-colors">About Us</a>
                            <a href="#services" className="text-gray-600 hover:text-primary-main font-medium transition-colors">Support Services</a>
                            <a href="#counselors" className="text-gray-600 hover:text-primary-main font-medium transition-colors">Counselors</a>
                            <a href="#contact" className="text-gray-600 hover:text-primary-main font-medium transition-colors">Contact</a>
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="bg-primary-main hover:bg-primary-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Student Login
                            </button>
                        </div>
                        {/* Mobile Action Controls */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="bg-primary-main hover:bg-primary-800 text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                                aria-label="Toggle navigation menu"
                            >
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-2 flex flex-col">
                                <a
                                    href="#about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-primary-main font-semibold text-sm transition-colors"
                                >
                                    About Us
                                </a>
                                <a
                                    href="#services"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-primary-main font-semibold text-sm transition-colors"
                                >
                                    Support Services
                                </a>
                                <a
                                    href="#counselors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-primary-main font-semibold text-sm transition-colors"
                                >
                                    Guidance Counselors
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-primary-main font-semibold text-sm transition-colors"
                                >
                                    Contact
                                </a>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsAuthModalOpen(true);
                                    }}
                                    className="w-full mt-2 bg-primary-main hover:bg-primary-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md"
                                >
                                    Student Login
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 sm:w-125 h-72 sm:h-125 rounded-full bg-primary-light blur-3xl opacity-60 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 sm:w-150 h-80 sm:h-150 rounded-full bg-accent-light blur-3xl opacity-40 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-2xl"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-50 text-primary-main font-medium text-xs sm:text-sm mb-5 sm:mb-6 border border-red-100">
                                <HeartHandshake size={16} className="shrink-0" />
                                <span>Compassion. Assistance. Respect. Empowerment. Service.</span>
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-5 sm:mb-6">
                                Empowering Every Student to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-main to-primary-500">Thrive</span>.
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-base sm:text-lg text-gray-600 mb-7 sm:mb-8 leading-relaxed text-justify">
                                ZPPSU CARES is a dedicated monitoring system and specialized portal designed to ensure no student is left behind. We provide tailored support, guidance, and resources for our physically impaired, mentally disabled, and marginalized students.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="w-full sm:w-auto justify-center bg-primary-main hover:bg-primary-800 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
                                >
                                    Seek Assistance
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full sm:w-auto justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-semibold transition-all shadow-sm flex items-center gap-2">
                                    <Phone size={18} className="text-primary-main" />
                                    Crisis Hotline
                                </button>
                            </motion.div>

                            <motion.div variants={fadeIn} className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-9 h-9 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white" style={{ backgroundColor: '#87CEFA' }}>
                                            <User size={16} className="text-white drop-shadow-xs" />
                                        </div>
                                    ))}
                                </div>
                                <p>Supporting <span className="text-primary-main font-bold">500+</span> marginalized students daily.</p>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            {/* Hero Decorative Image/Card Area */}
                            <div className="absolute inset-0 bg-linear-to-tr from-primary-main to-accent-main rounded-[2.5rem] transform rotate-3 scale-[1.02] opacity-20 blur-lg"></div>
                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden min-h-125 flex items-center justify-center flex-col text-center">

                                <div className="w-full absolute top-0 left-0 h-32 bg-linear-to-b from-primary-light to-transparent"></div>

                                <div className="relative mb-5 z-10 flex flex-col items-center">
                                    <div className="absolute inset-0 bg-primary-main/20 rounded-full blur-3xl scale-125"></div>
                                    <img
                                        src={guidanceLogo}
                                        alt="Guidance and Counseling and Testing Services Office Seal"
                                        className="w-52 h-52 sm:w-56 sm:h-56 object-cover rounded-full shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
                                        style={{ borderRadius: '50%' }}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 z-10 mb-2">Guidance & Counseling</h3>
                                <p className="text-gray-500 max-w-sm z-10 text-sm leading-relaxed text-justify">Official portal of the Guidance and Counseling and Testing Services Office (GCTSO) dedicated to student well-being and barrier-free assistance.</p>

                                {/* Accessibility Status Badge */}
                                <div className="mt-6 z-10 self-start p-3.5 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-pulse" style={{ animationDuration: '4s' }}>
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <Accessibility size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 font-medium">Accessibility Status</p>
                                        <p className="text-sm font-bold text-gray-900">100% Monitored</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Focus Areas Section */}
            <section id="services" className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary-main font-bold tracking-wider uppercase text-sm mb-2">Our Core Pillars</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Dedicated Support Systems</h3>
                        <p className="text-gray-600 text-lg text-justify">We systematically identify, monitor, and assist students facing extraordinary challenges to ensure equal opportunity in education.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Card 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-slab-interactive rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <Accessibility size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Physical Impairment Support</h4>
                            <p className="text-gray-600 mb-6 relative z-10 text-justify leading-relaxed">Tracking barrier-free campus access, specialized exam accommodations, and ensuring assistive technologies are provided to seamlessly integrate students into campus life.</p>
                            <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                                Learn how we help <ChevronRight size={16} />
                            </a>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-slab-interactive rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <BrainCircuit size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Mental Health & Wellness</h4>
                            <p className="text-gray-600 mb-6 relative z-10 text-justify leading-relaxed">Proactive profiling and continuous monitoring for students with mental disabilities or acute anxiety. Direct, confidential communication lines to licensed guidance counselors.</p>
                            <a href="#" className="font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                                View counseling services <ChevronRight size={16} />
                            </a>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-slab-interactive rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-14 h-14 bg-red-100 text-primary-main rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <Users size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Marginalized Student Guidance</h4>
                            <p className="text-gray-600 mb-6 relative z-10 text-justify leading-relaxed">Specialized intervention for socio-economically marginalized students. We track behavioral changes, academic drops, and provide immediate systemic support to prevent dropouts.</p>
                            <a href="#" className="font-semibold text-primary-main hover:text-primary-800 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                                Explore guidance programs <ChevronRight size={16} />
                            </a>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Guidance Counselors Section */}
            <section id="counselors" className="py-20 bg-bg-light relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <h2 className="text-primary-main font-bold tracking-wider uppercase text-sm mb-2">GCTSO Leadership</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Guidance Counselors</h3>
                        <p className="text-gray-600 text-lg text-justify">
                            Our dedicated team of licensed Guidance Counselors at the ZPPSU Guidance and Counseling and Testing Services Office (GCTSO) oversees student welfare, confidential counseling, and personalized support interventions across the university.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Margie B. Janda',
                                role: 'Guidance Counselor',
                                office: 'GCTSO • Super Administrator',
                                bio: 'Leads student welfare coordination, confidential counseling interventions, and inclusive support monitoring for ZPPSU students.',
                            },
                            {
                                name: 'Janet Pangilinan',
                                role: 'Guidance Counselor',
                                office: 'GCTSO • Super Administrator',
                                bio: 'Provides mental health guidance, academic wellness check-ins, and crisis response support for students in need.',
                            },
                            {
                                name: 'Cleir Tayaba',
                                role: 'Guidance Counselor',
                                office: 'GCTSO • Super Administrator',
                                bio: 'Oversees student accessibility assistance, behavioral support programs, and direct counseling consultations.',
                            },
                        ].map((counselor) => (
                            <motion.div
                                key={counselor.name}
                                whileHover={{ y: -8 }}
                                className="glass-slab-interactive rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                                        style={{ backgroundColor: '#87CEFA' }}
                                    >
                                        <User size={26} strokeWidth={2.2} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xl font-extrabold text-gray-900 truncate">{counselor.name}</h4>
                                        <p className="text-xs font-bold text-primary-main uppercase tracking-wider">{counselor.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed text-justify mb-6 flex-1">
                                    {counselor.bio}
                                </p>
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                                    <span className="inline-flex items-center gap-1.5 text-emerald-700">
                                        <ShieldCheck size={15} className="text-emerald-600" />
                                        {counselor.office}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section id="contact" className="py-20 bg-primary-900 relative overflow-hidden border-t-4 border-accent-main">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10 background-pattern"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Welcome Back, Students!</h2>
                    <p className="text-primary-light opacity-90 text-lg mb-10 max-w-2xl mx-auto text-justify leading-relaxed">
                        Log in to the ZPPSU CARES Portal to view your profile status, report concerns confidentially, and connect directly with your assigned guidance counselors.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-accent-main hover:bg-yellow-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center"
                        >
                            Access Student Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-gray-950 py-10 text-center border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <img src={guidanceLogo} alt="ZPPSU GCTSO Seal" className="w-14 h-14 object-cover rounded-full shadow-md" style={{ borderRadius: '50%' }} />
                        <div className="text-left">
                            <p className="text-white font-bold text-sm">Guidance and Counseling and Testing Services Office (GCTSO)</p>
                            <p className="text-gray-400 text-xs">Zamboanga Peninsula Polytechnic State University</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs text-center sm:text-right">
                        © {new Date().getFullYear()} ZPPSU CARES (Compassion. Assistance. Respect. Empowerment. Service). All Rights Reserved.
                    </p>
                </div>
            </footer>

            {/* Global Auth Modal Overlay */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default LandingPage;
