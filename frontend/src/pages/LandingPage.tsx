import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Accessibility, BrainCircuit, Users, ChevronRight, Phone } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-main rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                ZC
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-primary-900">
                                ZPPSU <span className="text-accent-main">CARES</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#about" className="text-gray-600 hover:text-primary-main font-medium transition-colors">About Us</a>
                            <a href="#services" className="text-gray-600 hover:text-primary-main font-medium transition-colors">Support Services</a>
                            <a href="#contact" className="text-gray-600 hover:text-primary-main font-medium transition-colors">Contact</a>
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="bg-primary-main hover:bg-primary-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Student Login
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-primary-light blur-3xl opacity-60 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-accent-light blur-3xl opacity-40 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-2xl"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-primary-main font-medium text-sm mb-6 border border-red-100">
                                <HeartHandshake size={16} />
                                <span>Compassion. Assistance. Respect. Empowerment. Service.</span>
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                                Empowering Every Student to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-primary-500">Thrive</span>.
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-lg text-gray-600 mb-8 leading-relaxed">
                                ZPPSU CARES is a dedicated monitoring system and specialized portal designed to ensure no student is left behind. We provide tailored support, guidance, and resources for our physically impaired, mentally disabled, and marginalized students.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                                <button className="bg-primary-main hover:bg-primary-800 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
                                    Seek Assistance
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-semibold transition-all shadow-sm flex items-center gap-2">
                                    <Phone size={18} className="text-primary-main" />
                                    Crisis Hotline
                                </button>
                            </motion.div>

                            <motion.div variants={fadeIn} className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=fef2f2`} alt="avatar" />
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
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-main to-accent-main rounded-[2.5rem] transform rotate-3 scale-[1.02] opacity-20 blur-lg"></div>
                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden h-[500px] flex items-center justify-center flex-col text-center">

                                <div className="w-full absolute top-0 left-0 h-32 bg-gradient-to-b from-primary-light to-transparent"></div>

                                <HeartHandshake size={80} className="text-primary-main mb-6 drop-shadow-md z-10 animate-bounce" style={{ animationDuration: '3s' }} />
                                <h3 className="text-2xl font-bold text-gray-900 z-10 mb-2">You Are Not Alone</h3>
                                <p className="text-gray-500 max-w-sm z-10">Our faculty and guidance counselors are deeply committed to providing an inclusive, barrier-free learning environment for your success.</p>

                                {/* Decorative elements */}
                                <div className="absolute bottom-10 left-10 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-pulse" style={{ animationDuration: '4s' }}>
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
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
                        <p className="text-gray-600 text-lg">We systematically identify, monitor, and assist students facing extraordinary challenges to ensure equal opportunity in education.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Card 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-bg-light rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <Accessibility size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Physical Impairment Support</h4>
                            <p className="text-gray-600 mb-6 relative z-10">Tracking barrier-free campus access, specialized exam accommodations, and ensuring assistive technologies are provided to seamlessly integrate students into campus life.</p>
                            <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                                Learn how we help <ChevronRight size={16} />
                            </a>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-bg-light rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <BrainCircuit size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Mental Health & Wellness</h4>
                            <p className="text-gray-600 mb-6 relative z-10">Proactive profiling and continuous monitoring for students with mental disabilities or acute anxiety. Direct, confidential communication lines to licensed guidance counselors.</p>
                            <a href="#" className="font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                                View counseling services <ChevronRight size={16} />
                            </a>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-bg-light rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-14 h-14 bg-red-100 text-primary-main rounded-2xl flex items-center justify-center mb-6 relative z-10">
                                <Users size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Marginalized Student Guidance</h4>
                            <p className="text-gray-600 mb-6 relative z-10">Specialized intervention for socio-economically marginalized students. We track behavioral changes, academic drops, and provide immediate systemic support to prevent dropouts.</p>
                            <a href="#" className="font-semibold text-primary-main hover:text-primary-800 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10">
                                Explore guidance programs <ChevronRight size={16} />
                            </a>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 bg-primary-900 relative overflow-hidden border-t-4 border-accent-main">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10 background-pattern"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Welcome Back, Students!</h2>
                    <p className="text-primary-light opacity-90 text-lg mb-10 max-w-2xl mx-auto">
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
            <footer className="bg-gray-950 py-8 text-center border-t border-gray-800">
                <p className="text-white text-sm">© {new Date().getFullYear()} ZPPSU CARES (Compassion. Assistance. Respect. Empowerment. Service). All Rights Reserved.</p>
            </footer>

            {/* Global Auth Modal Overlay */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default LandingPage;
