import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Send, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const CustomerServicePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [paymentDone, setPaymentDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        appliance: '',
        otherAppliance: '',
        issue: '',
        preferredDate: '',
        description: '',
        address: ''
    });

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchUser(userId);
    }, [navigate]);

    // ✅ Backend se user fetch
    const fetchUser = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
            setUser(res.data);
            checkPayment(res.data.email);
        } catch (err) {
            console.error('User fetch error', err);
            navigate('/login');
        }
    };

    // ✅ Backend se payment check
    const checkPayment = async (email) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings/check/${email}`);
            setPaymentDone(res.data.paid === true);
        } catch (err) {
            setPaymentDone(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentDone) return;

        setSubmitting(true);

        const finalAppliance = formData.appliance === 'Other'
            ? formData.otherAppliance
            : formData.appliance;

        const requestData = {
            requestId: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.ph || 'N/A',
            appliance: finalAppliance,
            issue: formData.issue,
            preferredDate: formData.preferredDate,
            description: formData.description,
            address: formData.address,
            status: 'Pending'
        };

        try {
            await axios.post('http://localhost:5000/api/requests/add', requestData);
            setSubmitting(false);
            alert('✅ Service Request successfully submitted! Admin will review shortly.');
            navigate('/customer/dashboard');
        } catch (err) {
            console.error(err);
            setSubmitting(false);
            alert('Database error: Could not save request.');
        }
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100 mb-2">
                            <ArrowLeft size={14}/> Back
                        </button>
                        <h2 className="text-3xl font-black tracking-tight italic">NEW REQUEST</h2>
                        <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Account: {user.name} | Plan: {user.activePlan || 'Standard'}
                        </p>
                    </div>
                    <Wrench size={40} className="opacity-20" />
                </div>

                {/* Payment Required Banner */}
                {!paymentDone && (
                    <div className="mx-8 mt-8 p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-4">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-rose-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-rose-700 text-sm">Payment Required</p>
                            <p className="text-rose-500 text-xs font-medium mt-0.5">
                                Please complete your payment first to book a service request.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/customer/payment')}
                            className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-rose-700 transition-all shrink-0"
                        >
                            Pay Now
                        </button>
                    </div>
                )}

                {/* Payment Done Banner */}
                {paymentDone && (
                    <div className="mx-8 mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-emerald-700 text-xs font-black uppercase tracking-widest">
                            Payment Verified — You can book a service request
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className={`space-y-6 ${!paymentDone ? 'opacity-40 pointer-events-none select-none' : ''}`}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Select Appliance</label>
                                <select
                                    required
                                    value={formData.appliance}
                                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all"
                                    onChange={(e) => setFormData({...formData, appliance: e.target.value, otherAppliance: ''})}
                                >
                                    <option value="">Choose Device...</option>
                                    <option value="AC">Air Conditioner</option>
                                    <option value="Washing Machine">Washing Machine</option>
                                    <option value="Refrigerator">Refrigerator</option>
                                    <option value="Microwave">Microwave</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Preferred Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.preferredDate}
                                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all"
                                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Other Device */}
                        {formData.appliance === 'Other' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                                    Specify Your Device
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Water Purifier, Geyser, TV..."
                                    required
                                    value={formData.otherAppliance}
                                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all"
                                    onChange={(e) => setFormData({...formData, otherAppliance: e.target.value})}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Issue Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Water Leakage, Not Powering On"
                                required
                                value={formData.issue}
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all"
                                onChange={(e) => setFormData({...formData, issue: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                                Service Premises
                            </label>
                            <input
                                type="text"
                                placeholder="House No., Street, Area, City, Pincode"
                                required
                                value={formData.address}
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all"
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Detailed Description</label>
                            <textarea
                                placeholder="Explain the problem in detail..."
                                value={formData.description}
                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all h-32"
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!paymentDone || submitting}
                            className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 text-xs ${
                                paymentDone && !submitting
                                    ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : paymentDone ? (
                                <><Send size={18}/> Submit Request</>
                            ) : (
                                <><AlertCircle size={18}/> Payment Required</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerServicePage;