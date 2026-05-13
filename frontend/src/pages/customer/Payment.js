import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, QrCode, CreditCard, Landmark, CheckCircle2, ChevronRight, Lock, ScanLine, X } from 'lucide-react';
import axios from 'axios';

const Payment = () => {
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('idle');
    const [paymentMode, setPaymentMode] = useState("UPI");
    const [txnId, setTxnId] = useState("");
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchUser(userId);

        const savedPlan = localStorage.getItem('selectedPlan');
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
        } else {
            navigate('/customer/plans');
        }
    }, [navigate]);

    const fetchUser = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error('User fetch error', err);
            navigate('/login');
        }
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();

        if (paymentMode === 'UPI' && !txnId) {
            alert("Please enter Transaction UTR/Ref Number");
            return;
        }

        setStatus('processing');

        const generatedTxnId = txnId || 'TXN' + Math.floor(100000 + Math.random() * 900000);

        const paymentData = {
            userId: user._id,
            // ✅ naam save hoga email nahi — PaymentHistory mein naam dikhe
            userName: user.name,
            serviceId: plan?._id || "65f1a2b3c4d5e6f7a8b9c0d1",
            serviceTitle: plan?.name || "AMC Plan",
            planName: plan?.name,
            amount: plan?.price?.toString(),
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN'),
            address: user?.address || "Service Address",
            paymentMethod: paymentMode === 'Bank' ? 'Bank Transfer' : paymentMode,
            transactionId: generatedTxnId,
            paymentStatus: 'Paid',
            bookingStatus: 'New'
        };

        try {
            // ✅ Step 1 — Booking save karo
            await axios.post('http://localhost:5000/api/bookings/add', paymentData);

            // ✅ Step 2 — Contract create karo taaki Active plan dike
            await axios.post('http://localhost:5000/api/contracts/buy', {
                userId: user._id,
                planName: plan.name,
                durationMonths: 12,
                price: plan.price,
                paymentId: generatedTxnId,
            });

            setTimeout(() => {
                setStatus('success');
                setTimeout(() => navigate('/customer/dashboard'), 3000);
            }, 2000);

        } catch (err) {
            console.error("Payment Error:", err.response?.data);
            alert("Payment Failed: " + (err.response?.data?.message || "Server Error"));
            setStatus('idle');
        }
    };

    if (!plan || !user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE]">
            <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Loading...</p>
        </div>
    );

    return (
        <div className="h-screen bg-[#F4F7FE] flex items-center justify-center p-6 font-sans overflow-hidden relative">

            {showScanner && (
                <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white p-8 rounded-[3rem] text-center max-w-xs w-full relative shadow-2xl">
                        <button onClick={() => setShowScanner(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
                            <X size={24}/>
                        </button>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-4">Scan QR Code</h3>
                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 mb-4">
                            <QrCode size={180} className="mx-auto text-slate-800" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                            Scan using GPay, PhonePe, or Paytm to complete transaction of <span className="text-indigo-600">₹{plan.price}</span>
                        </p>
                    </div>
                </div>
            )}

            {status !== 'idle' && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
                    {status === 'processing' ? (
                        <div className="flex flex-col items-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={30} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Securing Transaction</h2>
                            <p className="text-slate-500 font-bold mt-3 animate-pulse">Encryption in progress...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="bg-green-500 p-8 rounded-full shadow-[0_20px_50px_rgba(34,197,94,0.3)] mb-8">
                                <CheckCircle2 size={100} className="text-white" />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">Payment Received</h2>
                            <p className="text-xl text-slate-500 font-bold mb-6 italic">Order Total: ₹{plan.price}</p>
                            <div className="bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-lg shadow-indigo-200">
                                Redirecting to Dashboard...
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden">

                <div className="bg-gradient-to-br from-[#1E293B] to-[#4F46E5] p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><ShieldCheck size={180} /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-2 opacity-80">Checkout Summary</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-6xl font-black tracking-tighter">₹{plan.price}</span>
                        </div>
                        <p className="text-indigo-200 text-xs font-bold mt-2 uppercase tracking-widest">{plan.name}</p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Secure Live Connection</span>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 rounded-[2.2rem]">
                        {[
                            { id: 'UPI', icon: <QrCode size={18} /> },
                            { id: 'Card', icon: <CreditCard size={18} /> },
                            { id: 'Bank', icon: <Landmark size={18} /> }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setPaymentMode(m.id)}
                                className={`flex flex-col items-center gap-1.5 py-4 rounded-[1.8rem] text-[10px] font-black uppercase transition-all duration-300 ${
                                    paymentMode === m.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {m.icon} {m.id}
                            </button>
                        ))}
                    </div>

                    <div className="h-[200px] flex flex-col justify-center">
                        {paymentMode === 'UPI' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600"><ScanLine size={24} /></div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 uppercase">Scan to Pay</p>
                                            <p className="text-[10px] font-bold text-slate-500">VPA: admin@upi</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowScanner(true)}
                                        className="text-[10px] font-black text-indigo-600 uppercase bg-white px-4 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        Open Scanner
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter 12-Digit Ref Number / UTR"
                                    className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-black border-none outline-none focus:ring-2 ring-indigo-500 shadow-inner placeholder:text-slate-300"
                                    value={txnId}
                                    onChange={(e) => setTxnId(e.target.value)}
                                />
                            </div>
                        )}

                        {paymentMode === 'Card' && (
                            <div className="space-y-4">
                                <input type="text" placeholder="Cardholder Name" className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-black outline-none shadow-inner border-none focus:ring-2 ring-indigo-500" />
                                <div className="flex gap-3">
                                    <input type="text" placeholder="Card Number" className="flex-[2.5] p-5 bg-slate-50 rounded-2xl text-sm font-black outline-none shadow-inner border-none focus:ring-2 ring-indigo-500" />
                                    <input type="password" placeholder="CVV" className="flex-1 p-5 bg-slate-50 rounded-2xl text-sm font-black outline-none shadow-inner border-none focus:ring-2 ring-indigo-500" />
                                </div>
                            </div>
                        )}

                        {paymentMode === 'Bank' && (
                            <div className="space-y-4">
                                <div className="bg-slate-900 p-4 rounded-2xl text-[10px] font-black text-indigo-300 grid grid-cols-2 gap-2 text-center uppercase tracking-tighter">
                                    <span>BANK: SBI BANK</span>
                                    <span>IFSC: SBIN000124</span>
                                </div>
                                <input type="text" placeholder="Your Bank Name" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-black outline-none shadow-inner border-none focus:ring-2 ring-indigo-500" />
                                <input type="text" placeholder="Account Holder Name" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-black outline-none shadow-inner border-none focus:ring-2 ring-indigo-500" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleConfirmPayment}
                        className="group w-full bg-indigo-600 text-white py-6 rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 active:scale-95"
                    >
                        Securely Pay ₹{plan.price} <ChevronRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </button>

                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Payments are encrypted and secured by 256-Bit SSL
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;