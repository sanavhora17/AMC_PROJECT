import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Rocket, Sparkles, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full bg-[#FDFDFF] font-sans text-slate-900 flex flex-col overflow-hidden relative">
            
            {/* 1. Consistent Header */}
            <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-50 z-50">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#6366F1] transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                        AMC<span className="text-[#6366F1]">PRO</span>
                    </span>
                </div>

                <button 
                    onClick={() => navigate('/login')} 
                    className="bg-slate-900 text-white px-7 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#6366F1] transition-all"
                >
                    Sign In
                </button>
            </nav>

            {/* 2. Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center px-10 py-4 max-w-7xl mx-auto w-full">
                
                {/* Hero Section */}
                <section className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#6366F1] px-4 py-2 rounded-full mb-4">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Since 2020</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
                        Our <span className="text-[#6366F1] not-italic">Story.</span>
                    </h1>
                    <p className="mt-4 text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        We started with a simple vision: <span className="text-slate-900 font-bold">Maintenance should be invisible.</span> Today, we power thousands of enterprises with tech-first reliability.
                    </p>
                </section>

                {/* Values Grid - Structurally same but bigger/cleaner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
                    <div className="group bg-white border border-slate-100 p-10 rounded-[3rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-indigo-100 transition-all duration-500">
                        <div className="w-14 h-14 bg-slate-50 text-[#6366F1] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#6366F1] group-hover:text-white transition-all shadow-sm">
                            <Target size={30} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Our Mission</h3>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                            To empower modern businesses by providing seamless, tech-driven maintenance solutions that identify and prevent issues before they occur.
                        </p>
                    </div>

                    <div className="group bg-slate-900 p-10 rounded-[3rem] text-white hover:shadow-[0_20px_50px_rgba(99,102,241,0.2)] transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="w-14 h-14 bg-white/10 text-[#6366F1] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#6366F1] group-hover:text-white transition-all shadow-sm">
                            <Rocket size={30} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Our Vision</h3>
                        <p className="text-slate-400 font-bold text-sm leading-relaxed group-hover:text-white transition-colors">
                            Becoming the global benchmark for Annual Maintenance Contracts through relentless innovation, transparency, and engineering excellence.
                        </p>
                    </div>
                </div>

                {/* Stats Bar */}
                <section className="w-full flex justify-around items-center py-8 border-t border-slate-100">
                    <div className="text-center">
                        <div className="text-4xl font-black italic text-[#6366F1] tracking-tighter">2020</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Founded</div>
                    </div>
                    <div className="w-px h-10 bg-slate-100"></div>
                    <div className="text-center">
                        <div className="text-4xl font-black italic text-[#6366F1] tracking-tighter">150+</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Engineers</div>
                    </div>
                    <div className="w-px h-10 bg-slate-100"></div>
                    <div className="text-center">
                        <div className="text-4xl font-black italic text-[#6366F1] tracking-tighter">12K+</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Assets</div>
                    </div>
                </section>
            </main>

            {/* 3. Professional Dark Footer */}
            <footer className="bg-slate-900 py-8 px-12 text-center border-t border-slate-800">
                <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
                    <span className="text-2xl font-black italic uppercase tracking-tighter text-white opacity-90">
                        AMC<span className="text-[#6366F1]">PRO</span>
                    </span>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em]">
                        © 2026 AMCPRO SYSTEMS. Engineering Excellence.
                    </p>
                    <div className="hidden md:block w-20"></div>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;