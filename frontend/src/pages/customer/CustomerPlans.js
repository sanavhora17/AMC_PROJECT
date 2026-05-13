import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, Crown, ArrowRight } from 'lucide-react';
import axios from 'axios';

const CustomerPlans = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // URL check karein: Kya apka backend port 5000 hai?
                const res = await axios.get('http://localhost:5000/api/plans/all');
                setPlans(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching plans:", err);
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleBuyPlan = (plan) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Please Login first!");
            navigate('/login');
            return;
        }

        const cleanPlan = {
            id: plan._id, 
            name: plan.name,
            price: plan.price
        };
        // Sirf local storage mein save karke payment page par bhej rahe hain
        localStorage.setItem('selectedPlan', JSON.stringify(cleanPlan));
        navigate('/customer/payment');
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex-grow flex flex-col items-center justify-center p-6">
                <div className="text-center mb-10 shrink-0">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Choose Your Maintenance Plan</h1>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {loading ? (
                        <div className="col-span-3 text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-slate-400 font-black text-xl italic uppercase">Syncing with MongoDB...</p>
                        </div>
                    ) : plans.length > 0 ? (
                        plans.map((plan) => (
                            <div 
                                key={plan._id} 
                                onClick={() => setSelectedId(plan._id)}
                                className={`group bg-white p-8 rounded-[3.5rem] flex flex-col justify-between transition-all duration-300 cursor-pointer border-2 ${
                                    selectedId === plan._id 
                                    ? 'border-indigo-600 shadow-2xl scale-[1.03] ring-4 ring-indigo-50' 
                                    : 'border-white shadow-lg'
                                }`}
                            >
                                <div>
                                    <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                                        {plan.type === 'Premium' ? <Crown className="text-orange-500" size={32} /> : 
                                         plan.type === 'Standard' ? <Shield className="text-yellow-500" size={32} /> : 
                                         <Zap className="text-indigo-600" size={32} />}
                                    </div>
                                    <h3 className="text-2xl font-black mb-1 text-slate-900 tracking-tight">{plan.name}</h3>
                                    <div className="mt-8 mb-8">
                                        <span className="text-5xl font-black text-slate-900 italic">₹{plan.price}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleBuyPlan(plan); }}
                                    className="w-full py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] bg-slate-900 text-white hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                                >
                                    BUY PLAN <ArrowRight size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        // Agar Database empty hai toh ye dikhega
                        <div className="col-span-3 text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-black text-xl italic uppercase tracking-widest">No Active Plans Found</p>
                            <p className="text-slate-300 text-xs font-bold uppercase mt-2">Check Admin Panel to add new plans</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full shrink-0">
                <div className="h-2 w-full bg-[#0F172A]"></div>
                <div className="py-4 bg-white border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 AMC-PRO | Secure Gateway</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerPlans;