import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ph: '',
        address: ''
    });
    const [activePlan, setActivePlan] = useState(null); // Plan details ke liye state
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) {
                setMessage("User ID missing! Please Login again.");
                setLoading(false);
                return;
            }
            try {
                // 1. Fetch User Profile
                const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setFormData(userRes.data);

                // 2. Fetch Active Plan (Booking History se latest uthayenge)
                const planRes = await axios.get(`http://localhost:5000/api/admin/payments/history`);
                const userPlan = planRes.data.data.find(p => p.userId === userId);
                if (userPlan) {
                    setActivePlan(userPlan);
                }

                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setMessage("Data load nahi ho raha hai.");
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [userId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/users/update/${userId}`, formData);
            alert("Profile Updated Successfully!");
        } catch (err) {
            alert("Update failed!");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: PERSONAL INFO */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-[#6366F1] p-10 text-white relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Account Settings</h2>
                            <p className="opacity-80 font-bold text-xs uppercase tracking-[0.2em] mt-1">Update your personal identification</p>
                        </div>
                        <ShieldCheck size={120} className="absolute right-[-20px] top-[-20px] opacity-10" />
                    </div>

                    <form onSubmit={handleUpdate} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileInput icon={<User size={18}/>} label="Legal Name" 
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            
                            <ProfileInput icon={<Mail size={18}/>} label="Email Address" 
                                value={formData.email} disabled className="bg-slate-50 opacity-60 cursor-not-allowed" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileInput icon={<Phone size={18}/>} label="Mobile Number" 
                                value={formData.ph} onChange={(e) => setFormData({...formData, ph: e.target.value})} />
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Primary Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-3xl outline-none text-sm font-bold border-2 border-transparent focus:border-indigo-500 transition-all min-h-[100px] resize-none"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                            <Save size={20}/> Sync Profile Data
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: ACTIVE PLAN STATUS */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <CreditCard className="text-indigo-600" size={18} /> Active Subscription
                        </h3>

                        {activePlan ? (
                            <div className="space-y-6">
                                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Current Plan</p>
                                    <h4 className="text-2xl font-black text-indigo-900 mt-1">{activePlan.serviceTitle}</h4>
                                    <div className="mt-4 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                                        <CheckCircle size={14} /> Status: {activePlan.paymentStatus}
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Amount Paid</span>
                                        <span className="font-black text-slate-900 tracking-tight">₹{activePlan.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                                        <span className="font-bold text-slate-700 text-xs">{activePlan.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Booked On</span>
                                        </div>
                                        <span className="font-bold text-slate-900 text-xs">{activePlan.date}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 px-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Active AMC Found</p>
                                <button className="mt-4 text-indigo-600 font-black text-[10px] uppercase hover:underline">Browse Plans</button>
                            </div>
                        )}
                    </div>

                    {/* Quick Security Note */}
                    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security Note</p>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                            Email cannot be changed once verified. For phone or address updates, ensure they match your service location.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ProfileInput = ({ icon, label, ...props }) => (
    <div className="space-y-2 w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">{icon}</div>
            <input 
                {...props}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border-2 border-transparent focus:border-indigo-500 transition-all ${props.className}`}
            />
        </div>
    </div>
);

export default Profile;