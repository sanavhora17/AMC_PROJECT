import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Star, Zap, Activity, Award } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="h-screen w-full bg-white flex flex-col font-sans selection:bg-indigo-100 overflow-hidden relative">
            
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/70 rounded-full blur-[100px] -z-10 animate-pulse"></div>

            {/* 1. Header/Navbar */}
            <nav className="flex items-center justify-between px-8 md:px-16 py-5 bg-white border-b border-slate-50 relative z-50">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-[#6366F1] p-2 rounded-xl rotate-3 group-hover:rotate-0 transition-all shadow-lg shadow-indigo-100">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">
                        AMC<span className="text-[#6366F1]">PRO</span>
                    </span>
                </div>
                
                {/* Navigation Links - Fixed Hover to Blue */}
                <div className="hidden md:flex gap-10 font-bold text-[13px] uppercase tracking-[0.2em]">
                    <button 
                        onClick={() => navigate('/services')} 
                        className={`transition-all relative group ${isActive('/services') ? 'text-[#6366F1]' : 'text-slate-500 hover:text-[#6366F1]'}`}
                    >
                        Services
                    </button>
                    <button 
                        onClick={() => navigate('/about')} 
                        className={`transition-all relative group ${isActive('/about') ? 'text-[#6366F1]' : 'text-slate-500 hover:text-[#6366F1]'}`}
                    >
                        Our Story
                    </button>
                    <button 
                        onClick={() => navigate('/success-stories')} 
                        className={`transition-all relative group ${isActive('/success-stories') ? 'text-[#6366F1]' : 'text-slate-500 hover:text-[#6366F1]'}`}
                    >
                        Success Stories
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/login')} className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-900 hover:text-[#6366F1] transition-all">
                        Login
                    </button>
                    <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-9 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#6366F1] hover:-translate-y-0.5 transition-all active:scale-95">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-4 relative">
                
                <div className="mb-6 flex items-center gap-3 bg-white border border-slate-100 shadow-sm text-slate-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> 4.9</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    Trusted by 500+ Enterprise Clients
                </div>

                <h1 className="text-6xl md:text-[8.5rem] font-black tracking-tighter leading-[0.82] italic uppercase text-slate-900">
                    Reliability <br /> 
                    <span className="text-[#6366F1] not-italic tracking-[-0.04em]">Redefined.</span>
                </h1>

                <p className="mt-8 text-slate-500 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                    The ultimate platform to manage Annual Maintenance Contracts. 
                    <span className="text-slate-900 font-black italic block mt-1"> Built for speed, transparency, and zero downtime.</span>
                </p>

                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={() => navigate('/services')} 
                        className="bg-[#6366F1] text-white px-16 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(99,102,241,0.35)] hover:scale-105 transition-all group"
                    >
                        Explore Solutions <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </main>

            {/* 3. Professional Trust Bar */}
            <section className="bg-slate-900 py-10 text-white px-10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="flex items-center gap-5 justify-center md:justify-start group cursor-default">
                        <div className="bg-white/5 p-4 rounded-xl text-[#6366F1] group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-300">
                            <Zap size={24} />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="font-black uppercase text-[12px] tracking-widest text-white">Instant Booking</p>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">One-click service requests</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-5 justify-center md:justify-start border-y md:border-y-0 md:border-x border-slate-800 py-6 md:py-0 md:px-12 group cursor-default">
                        <div className="bg-white/5 p-4 rounded-xl text-[#6366F1] group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-300">
                            <Activity size={24} />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="font-black uppercase text-[12px] tracking-widest text-white">Real-time Status</p>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">Live contract health tracking</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-5 justify-center md:justify-start group cursor-default">
                        <div className="bg-white/5 p-4 rounded-xl text-[#6366F1] group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-300">
                            <Award size={24} />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="font-black uppercase text-[12px] tracking-widest text-white">Expert Support</p>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">Certified on-site engineers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Footer */}
            <footer className="py-6 bg-slate-900 text-center border-t border-slate-800 relative z-10">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em]">
                    © 2026 <span className="text-[#6366F1]">AMCPRO</span> SYSTEMS. Engineering Excellence.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;