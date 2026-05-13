import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Settings, Sparkles } from 'lucide-react';
import axios from 'axios';

const ServicesPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/services/all');
                setServices(res.data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#FDFDFF] font-sans text-slate-900 flex flex-col relative overflow-x-hidden">
            
            {/* 1. Tight Header */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-50 z-50 sticky top-0">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#6366F1] transition-all"
                >
                    <ArrowLeft size={14} /> Back
                </button>
                
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
                        AMC<span className="text-[#6366F1]">PRO</span>
                    </span>
                </div>

                <button 
                    onClick={() => navigate('/login')} 
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#6366F1] transition-all"
                >
                    Sign In
                </button>
            </nav>

            {/* 2. Hero Section */}
            <header className="px-10 pt-12 pb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#6366F1] px-3 py-1.5 rounded-full mb-3">
                    <Sparkles size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Premium Plans</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-tight">
                    Our <span className="text-[#6366F1] not-italic">Solutions</span>
                </h1>
                <p className="mt-2 text-slate-500 font-medium text-sm max-w-xl mx-auto leading-relaxed">
                    High-performance maintenance tailored for your enterprise.
                </p>
            </header>

            {/* 3. Services Grid */}
            <main className="flex-grow px-10 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                    {services.length > 0 ? services.map((service) => (
                        <div 
                            key={service._id} 
                            className="group bg-white border border-slate-100 rounded-[3rem] hover:shadow-[0_30px_60px_rgba(99,102,241,0.12)] hover:border-[#6366F1]/20 transition-all duration-500 flex flex-col overflow-hidden relative"
                        >
                            {/* IMAGE AREA - Yahan Admin wali image aayegi */}
                            <div className="w-full h-56 overflow-hidden bg-slate-50 relative">
                                {service.imageUrl ? (
                                    <img 
                                        src={service.imageUrl} 
                                        alt={service.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => { e.target.style.display = 'none'; }} // Fallback if link breaks
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-indigo-200">
                                        <Settings size={64} strokeWidth={1} />
                                    </div>
                                )}
                                
                            </div>

                            {/* CONTENT AREA */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-slate-900 group-hover:text-[#6366F1] transition-colors">
                                    {service.title}
                                </h3>
                                
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-[10px] font-black uppercase text-slate-300">Rate Start:</span>
                                    <span className="text-3xl font-black text-slate-900 ml-1 tracking-tighter">
                                        <span className="text-sm font-bold mr-0.5">₹</span>{service.price}
                                    </span>
                                </div>

                                <p className="text-slate-500 font-bold text-[13px] mb-6 leading-relaxed line-clamp-3 italic">
                                    {service.description}
                                </p>

                                <div className="mt-auto">
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <CheckCircle2 size={14} className="text-[#6366F1]" /> Priority Support
                                        </li>
                                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <CheckCircle2 size={14} className="text-[#6366F1]" /> Genuine Parts
                                        </li>
                                    </ul>

                                    <button 
                                        onClick={() => navigate('/register')}
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] group-hover:bg-[#6366F1] shadow-lg group-hover:shadow-indigo-200 transition-all"
                                    >
                                        Select Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-[#6366F1] rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.4em]">Optimizing Solutions...</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 4. Footer */}
            <footer className="bg-slate-900 py-8 px-10 text-center border-t border-slate-800">
                <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
                    <span className="text-lg font-black italic uppercase tracking-tighter text-white opacity-80">
                        AMC<span className="text-[#6366F1]">PRO</span>
                    </span>
                    <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.4em]">
                        ©️ 2026 AMCPRO SYSTEMS. Engineering Excellence.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ServicesPage;