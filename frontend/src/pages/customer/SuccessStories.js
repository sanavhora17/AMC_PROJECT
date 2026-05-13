// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Star, Quote, ChevronRight, Sparkles } from 'lucide-react';

// const SuccessStories = () => {
//     const navigate = useNavigate();

//     const stories = [
//         {
//             company: "TechNova Solutions",
//             feedback: "AMC PRO reduced our server downtime by 40% in just the first quarter. Their response time is unmatched.",
//             author: "Arjun Khanna",
//             role: "CTO",
//             color: "bg-[#6366F1]" // Indigo
//         },
//         {
//             company: "Global Retail Inc.",
//             feedback: "Managing 50+ stores was a nightmare until we switched to this platform. Everything is now automated.",
//             author: "Sarah Jenkins",
//             role: "Operations Manager",
//             color: "bg-slate-900" // Dark Slate
//         },
//         {
//             company: "Luxe Hotels",
//             feedback: "Professional engineers and very transparent billing. The best AMC service we've ever used.",
//             author: "Vikram Singh",
//             role: "Director",
//             color: "bg-indigo-500" // Lighter Indigo
//         }
//     ];

//     return (
//         <div className="h-screen w-full bg-[#FDFDFF] font-sans text-slate-900 flex flex-col overflow-hidden relative">
            
//             {/* 1. Consistent Header */}
//             <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-50 z-50">
//                 <button 
//                     onClick={() => navigate('/')} 
//                     className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#6366F1] transition-all group"
//                 >
//                     <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
//                 </button>
                
//                 <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
//                     <span className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
//                         AMC<span className="text-[#6366F1]">PRO</span>
//                     </span>
//                 </div>

//                 <button 
//                     onClick={() => navigate('/register')} 
//                     className="bg-slate-900 text-white px-7 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#6366F1] transition-all"
//                 >
//                     Join Now
//                 </button>
//             </nav>

//             {/* 2. Main Content */}
//             <main className="flex-grow flex flex-col px-12 py-6 max-w-7xl mx-auto w-full justify-between">
                
//                 {/* Hero Title */}
//                 <div className="text-center mb-6">
//                     <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#6366F1] px-4 py-2 rounded-full mb-3">
//                         <Sparkles size={14} />
//                         <span className="text-[10px] font-black uppercase tracking-widest">Client Testimonials</span>
//                     </div>
//                     <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
//                         Trusted By <span className="text-[#6366F1] not-italic">The Best.</span>
//                     </h2>
//                 </div>

//                 {/* Testimonial Cards - Adjusted for No-Scroll */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
//                     {stories.map((story, index) => (
//                         <div key={index} className={`${story.color} p-10 rounded-[3rem] text-white shadow-xl flex flex-col justify-between min-h-[340px] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden`}>
//                             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-all"></div>
                            
//                             <div>
//                                 <Quote size={32} className="opacity-20 mb-6 group-hover:scale-110 transition-transform" />
//                                 <p className="text-xl font-bold leading-tight mb-6 italic opacity-95 uppercase tracking-tight">"{story.feedback}"</p>
//                             </div>
                            
//                             <div>
//                                 <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 opacity-50">{story.company}</div>
//                                 <div className="flex items-center justify-between border-t border-white/10 pt-5">
//                                     <div>
//                                         <div className="font-black italic uppercase tracking-tighter text-base">{story.author}</div>
//                                         <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{story.role}</div>
//                                     </div>
//                                     <Star size={18} fill="currentColor" className="text-yellow-400" />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* CTA Section - Professional & Clean */}
//                 <section className="bg-white rounded-[2.5rem] p-8 text-center border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] mt-6">
//                     <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-slate-900">
//                         Ready to write your <span className="text-[#6366F1]">Success Story?</span>
//                     </h3>
//                     <p className="text-slate-500 font-bold text-xs mb-6 max-w-lg mx-auto uppercase tracking-widest opacity-70">
//                         Join hundreds of enterprises managing assets with AMC PRO.
//                     </p>
//                     <button 
//                         onClick={() => navigate('/register')} 
//                         className="bg-[#6366F1] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 mx-auto shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all active:scale-95"
//                     >
//                         Create Your Story <ChevronRight size={16}/>
//                     </button>
//                 </section>
//             </main>

//             {/* 3. Professional Dark Footer */}
//             <footer className="bg-slate-900 py-6 px-12 text-center border-t border-slate-800">
//                 <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
//                     <span className="text-2xl font-black italic uppercase tracking-tighter text-white opacity-90">
//                         AMC<span className="text-[#6366F1]">PRO</span>
//                     </span>
//                     <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em]">
//                         © 2026 AMCPRO SYSTEMS. Engineering Excellence.
//                     </p>
//                     <div className="hidden md:block w-20"></div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default SuccessStories;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Quote, ChevronRight, Sparkles } from 'lucide-react';

const SuccessStories = () => {
    const navigate = useNavigate();

    const stories = [
        {
            company: "TechNova Solutions",
            feedback: "AMC PRO reduced our server downtime by 40%. Their response time is unmatched.",
            author: "Arjun Khanna",
            role: "CTO",
            color: "bg-[#6366F1]"
        },
        {
            company: "Global Retail Inc.",
            feedback: "Managing 50+ stores was a nightmare until we switched. Everything is now automated.",
            author: "Sarah Jenkins",
            role: "Operations Manager",
            color: "bg-slate-900"
        },
        {
            company: "Luxe Hotels",
            feedback: "Professional engineers and very transparent billing. The best AMC service ever.",
            author: "Vikram Singh",
            role: "Director",
            color: "bg-indigo-500"
        }
    ];

    return (
        <div className="h-screen w-full bg-[#FDFDFF] font-sans text-slate-900 flex flex-col overflow-hidden">
            
            {/* Header */}
            <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-50">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#6366F1]">
                    <ArrowLeft size={16} /> Back
                </button>
                <span className="text-2xl font-black italic uppercase tracking-tighter">
                    AMC<span className="text-[#6366F1]">PRO</span>
                </span>
                <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-7 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    Join Now
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col px-12 py-6 max-w-7xl mx-auto w-full justify-around">
                <div className="text-center">
                    <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900">
                        Trusted By <span className="text-[#6366F1] not-italic">The Best.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stories.map((story, index) => (
                        <div key={index} className={`${story.color} p-8 rounded-[2.5rem] text-white flex flex-col justify-between min-h-[300px]`}>
                            <div>
                                <Quote size={30} className="opacity-20 mb-4" />
                                <p className="text-lg font-bold italic uppercase tracking-tight">"{story.feedback}"</p>
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <div className="font-black italic uppercase text-sm">{story.author}</div>
                                <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest">{story.role}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-white rounded-[2rem] p-6 text-center border border-slate-100 shadow-sm">
                    <h3 className="text-2xl font-black italic uppercase mb-4">Ready to write your <span className="text-[#6366F1]">Success Story?</span></h3>
                    <button onClick={() => navigate('/register')} className="bg-[#6366F1] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto">
                        Create Your Story <ChevronRight size={16}/>
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 py-6 text-center">
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.5em]">© 2026 AMCPRO SYSTEMS.</p>
            </footer>
        </div>
    );
};

export default SuccessStories;