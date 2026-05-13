import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CheckCircle, Clock, RefreshCw, CreditCard, Landmark, QrCode, User, AlertCircle } from 'lucide-react';

const AdminPaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:5000/api/admin/payments/history');
            if (res.data.success) {
                setPayments(res.data.data);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Database connection failed. Please check your backend terminal.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    // ✅ Email ko naam mein convert karo
    const getDisplayName = (pay) => {
        const name = pay.userName || '';
        // Agar email hai toh userId se naam dhundo
        if (name.includes('@')) {
            return pay.userId?.name || name.split('@')[0] || 'Guest';
        }
        return name || 'Guest';
    };

    const filteredPayments = payments.filter(pay =>
        getDisplayName(pay).toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="md:ml-64 p-4 md:p-10 bg-[#F1F5F9] min-h-screen transition-all duration-300">

            {/* Top Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Transactions</h1>
                    <div className="h-1.5 w-16 bg-indigo-600 rounded-full mt-1"></div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                    <div className="bg-white border-2 border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 flex-1 lg:w-80 shadow-sm focus-within:border-indigo-500 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Name/Transaction..."
                            className="outline-none text-sm font-bold w-full bg-transparent"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchHistory} className="bg-indigo-600 p-3 rounded-2xl text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-xl">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Customer</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Plan & Amount</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Payment Method Info</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Transaction ID</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-20 text-center font-black text-slate-300 animate-pulse">CONNECTING TO SERVER...</td></tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr><td colSpan="6" className="p-20 text-center font-black text-slate-300 tracking-widest uppercase">No Transaction Data Available</td></tr>
                            ) : filteredPayments.map((pay) => (
                                <tr key={pay._id} className="hover:bg-slate-50/50 transition-colors group">

                                    {/* ✅ Customer — naam dikhega email nahi */}
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                                <User size={18} className="text-slate-500 group-hover:text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-none mb-1">
                                                    {getDisplayName(pay)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                    ID: {typeof pay.userId === 'string' ? pay.userId?.slice(-6) : pay.userId?._id?.slice(-6) || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-6">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{pay.serviceTitle || "Premium Plan"}</p>
                                        <p className="font-black text-slate-900 text-lg tracking-tighter">₹{pay.amount}</p>
                                    </td>

                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                {pay.paymentMethod === 'UPI' && <QrCode size={18} className="text-emerald-500" />}
                                                {pay.paymentMethod === 'Card' && <CreditCard size={18} className="text-blue-500" />}
                                                {(pay.paymentMethod === 'Bank Transfer' || pay.paymentMethod === 'Net Banking') && <Landmark size={18} className="text-amber-500" />}
                                            </div>
                                            <div className="leading-tight">
                                                <p className="text-[10px] font-black text-slate-700 uppercase">{pay.paymentMethod}</p>
                                                <p className="text-[10px] font-mono font-bold text-slate-400">
                                                    {pay.upiId || pay.cardNumber || pay.accountNo || "Verification Proof"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-6">
                                        <div className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100 w-fit">
                                            {pay.transactionId || pay.paymentScreenshot || "NO_TRX_ID"}
                                        </div>
                                    </td>

                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 w-fit shadow-sm border ${
                                            pay.paymentStatus === 'Paid'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {pay.paymentStatus === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                            {pay.paymentStatus || 'Pending'}
                                        </span>
                                    </td>

                                    <td className="p-6">
                                        <div className="text-right lg:text-left">
                                            <p className="text-[11px] font-bold text-slate-600">{pay.date || "N/A"}</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{pay.time || "N/A"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentHistory;