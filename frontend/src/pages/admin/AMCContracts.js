import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, ArrowRight, X, User, Phone, MapPin, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const DUMMY_EXPIRED = [
    {
        _id: 'dummy_exp_1',
        userId: { name: 'Ramesh Gupta', email: 'ramesh@gmail.com', ph: '9876543210', address: '12, MG Road, Vadodara' },
        planName: 'Gold Plan',
        price: 4999,
        expiryDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        calculatedStatus: 'Expired',
        isDummy: true,
    },
    {
        _id: 'dummy_exp_2',
        userId: { name: 'Sunita Desai', email: 'sunita@gmail.com', ph: '9823456789', address: '5, Alkapuri, Vadodara' },
        planName: 'Silver Plan',
        price: 2999,
        expiryDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        calculatedStatus: 'Expired',
        isDummy: true,
    },
];

const DUMMY_RENEWAL = [
    {
        _id: 'dummy_ren_1',
        userId: { name: 'Manoj Shah', email: 'manoj@gmail.com', ph: '9712345678', address: '8, Fatehgunj, Vadodara' },
        planName: 'Platinum Plan',
        price: 7999,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        calculatedStatus: 'Renewal Due',
        isDummy: true,
    },
    {
        _id: 'dummy_ren_2',
        userId: { name: 'Priya Mehta', email: 'priya@gmail.com', ph: '9654321098', address: '22, Sayajigunj, Vadodara' },
        planName: 'Gold Plan',
        price: 4999,
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        calculatedStatus: 'Renewal Due',
        isDummy: true,
    },
];

const AMCContracts = () => {
    const [filter, setFilter] = useState('All');
    const [contracts, setContracts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renewalLoading, setRenewalLoading] = useState(false);
    const [renewalSuccess, setRenewalSuccess] = useState(false);
    const [renewMonths, setRenewMonths] = useState(12);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            // ✅ FIXED — populate ke saath wala route
            const res = await axios.get(`${API}/contracts/contracts`);
            const liveData = Array.isArray(res.data) ? res.data : [];
            const merged = [...liveData, ...DUMMY_EXPIRED, ...DUMMY_RENEWAL];
            setContracts(merged);
        } catch (err) {
            console.error('Fetch error:', err);
            setContracts([...DUMMY_EXPIRED, ...DUMMY_RENEWAL]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContracts(); }, []);

    const filtered = filter === 'All'
        ? contracts
        : contracts.filter(c => c.calculatedStatus === filter);

    const handleRenewal = async () => {
        if (!selectedClient || selectedClient.isDummy) {
            setRenewalSuccess(true);
            setTimeout(() => setRenewalSuccess(false), 2500);
            return;
        }
        setRenewalLoading(true);
        try {
            await axios.post(`${API}/contracts/buy`, {
                userId: selectedClient.userId?._id || selectedClient.userId,
                planName: selectedClient.planName,
                durationMonths: renewMonths,
                price: selectedClient.price,
                paymentId: `RENEWAL_${Date.now()}`,
            });
            setRenewalSuccess(true);
            setTimeout(() => {
                setRenewalSuccess(false);
                setSelectedClient(null);
                fetchContracts();
            }, 2000);
        } catch (err) {
            alert('Renewal failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setRenewalLoading(false);
        }
    };

    const handleDelete = async (contractId, isDummy) => {
        if (isDummy) { alert('Dummy contract — delete not applicable.'); return; }
        if (!window.confirm('Are you sure you want to delete this contract?')) return;
        try {
            await axios.delete(`${API}/contracts/contracts/${contractId}`);
            setContracts(prev => prev.filter(c => c._id !== contractId));
            if (selectedClient?._id === contractId) setSelectedClient(null);
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A';

    const daysLeft = (d) => {
        if (!d) return null;
        return Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    };

    if (loading) return (
        <div className="ml-64 p-10 flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="font-black text-slate-400 italic text-[10px] uppercase tracking-widest">Syncing Live Database...</p>
        </div>
    );

    return (
        <div className="flex-1 ml-64 p-10 bg-[#F8FAFC] min-h-screen relative font-sans">

            {/* ── HEADER ── */}
            <header className="mb-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">AMC Contracts</h1>
                        <p className="text-slate-500 font-medium text-sm">Client service agreements and live statuses.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchContracts} className="p-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                            <RefreshCw size={16} className="text-slate-500" />
                        </button>
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Sync</p>
                            <p className="text-xl font-black text-emerald-500 uppercase italic">Live</p>
                        </div>
                    </div>
                </div>

                {/* Count Badges */}
                <div className="flex gap-4 mt-6">
                    {[
                        { label: 'Total', count: contracts.length, color: 'text-slate-700' },
                        { label: 'Active', count: contracts.filter(c => c.calculatedStatus === 'Active').length, color: 'text-emerald-600' },
                        { label: 'Renewal Due', count: contracts.filter(c => c.calculatedStatus === 'Renewal Due').length, color: 'text-orange-500' },
                        { label: 'Expired', count: contracts.filter(c => c.calculatedStatus === 'Expired').length, color: 'text-rose-500' },
                    ].map(({ label, count, color }) => (
                        <div key={label} className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className={`text-xl font-black ${color}`}>{count}</p>
                        </div>
                    ))}
                </div>
            </header>

            {/* ── FILTER TABS ── */}
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
                    {['All', 'Active', 'Renewal Due', 'Expired'].map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                            {t}
                        </button>
                    ))}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{filtered.length} Records</span>
            </div>

            {/* ── CONTRACT CARDS ── */}
            {filtered.length === 0 ? (
                <div className="w-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-200">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-slate-400 font-black italic uppercase tracking-widest text-lg">No Records Found</h3>
                    <p className="text-slate-300 text-xs mt-2 font-medium">No contracts match this filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(c => {
                        const days = daysLeft(c.expiryDate);
                        const isExpired = c.calculatedStatus === 'Expired';
                        const isRenewal = c.calculatedStatus === 'Renewal Due';
                        const isActive = c.calculatedStatus === 'Active';

                        return (
                            <div key={c._id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between">

                                {/* Status Badge */}
                                <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                    isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    isExpired ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                    {c.calculatedStatus}
                                </div>

                                {/* Sample Badge */}
                                {c.isDummy && (
                                    <div className="absolute top-6 left-6 px-3 py-1 rounded-full text-[8px] font-black uppercase bg-slate-100 text-slate-400 border border-slate-200">
                                        Sample
                                    </div>
                                )}

                                <div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                                        isActive ? 'bg-emerald-50 text-emerald-600' :
                                        isExpired ? 'bg-rose-50 text-rose-500' :
                                        'bg-orange-50 text-orange-500'}`}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight pr-16">
                                        {c.userId?.name || 'Unknown Client'}
                                    </h3>
                                    <p className="text-[#6366F1] font-black text-[10px] uppercase tracking-[0.2em] mt-2 italic">{c.planName}</p>
                                    <p className="text-lg font-black text-slate-800 mt-1">₹{(c.price || 0).toLocaleString('en-IN')}</p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-500 mb-3">
                                        <Calendar size={16} className="text-slate-300" />
                                        <div className="leading-none">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Expiry Date</p>
                                            <p className="text-sm font-bold text-slate-900">{formatDate(c.expiryDate)}</p>
                                        </div>
                                    </div>

                                    {days !== null && (
                                        <div className={`text-[10px] font-black uppercase tracking-wider mb-4 ${
                                            days < 0 ? 'text-rose-500' :
                                            days <= 30 ? 'text-orange-500' :
                                            'text-emerald-500'}`}>
                                            {days < 0
                                                ? `Expired ${Math.abs(days)} days ago`
                                                : days === 0 ? 'Expires today!'
                                                : `${days} days remaining`}
                                        </div>
                                    )}

                                    <button onClick={() => setSelectedClient(c)}
                                        className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                                            isRenewal ? 'bg-orange-500 text-white shadow-lg hover:bg-orange-600' :
                                            isExpired ? 'bg-rose-500 text-white shadow-lg hover:bg-rose-600' :
                                            'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                        {isRenewal ? 'Process Renewal' : isExpired ? 'View & Renew' : 'View Details'}
                                        <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── MODAL ── */}
            {selectedClient && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">

                        <div className={`p-8 text-white flex justify-between items-center ${
                            selectedClient.calculatedStatus === 'Expired' ? 'bg-rose-600' :
                            selectedClient.calculatedStatus === 'Renewal Due' ? 'bg-orange-500' :
                            'bg-slate-900'}`}>
                            <div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tight">
                                    {selectedClient.calculatedStatus === 'Renewal Due' ? 'Process Renewal' :
                                     selectedClient.calculatedStatus === 'Expired' ? 'Contract Expired' :
                                     'Client Details'}
                                </h2>
                                <p className="text-white/60 text-xs mt-1 font-medium uppercase tracking-widest">
                                    {selectedClient.planName} · {selectedClient.isDummy ? 'Sample Entry' : 'Live Record'}
                                </p>
                            </div>
                            <button onClick={() => { setSelectedClient(null); setRenewalSuccess(false); }}
                                className="bg-white/10 p-2 rounded-xl hover:bg-white/20">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-5">
                            <DetailRow icon={<User size={18}/>} label="Customer Name" value={selectedClient.userId?.name} />
                            <DetailRow icon={<Phone size={18}/>} label="Phone Number" value={selectedClient.userId?.ph || selectedClient.userId?.phone} />
                            <DetailRow icon={<MapPin size={18}/>} label="Address" value={selectedClient.userId?.address} />
                            <DetailRow icon={<Calendar size={18}/>} label="Expiry Date" value={formatDate(selectedClient.expiryDate)} />

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Value</span>
                                <span className="text-lg font-black text-emerald-600">₹{(selectedClient.price || 0).toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                <span className={`text-sm font-black px-4 py-1.5 rounded-full ${
                                    selectedClient.calculatedStatus === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                    selectedClient.calculatedStatus === 'Expired' ? 'bg-rose-50 text-rose-600' :
                                    'bg-orange-50 text-orange-600'}`}>
                                    {selectedClient.calculatedStatus}
                                </span>
                            </div>

                            {(selectedClient.calculatedStatus === 'Renewal Due' || selectedClient.calculatedStatus === 'Expired') && (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Renewal Duration</p>
                                    <div className="flex gap-2 mb-4">
                                        {[6, 12, 24].map(m => (
                                            <button key={m} onClick={() => setRenewMonths(m)}
                                                className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${renewMonths === m ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                                {m} Mo
                                            </button>
                                        ))}
                                    </div>

                                    {renewalSuccess ? (
                                        <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-2 text-emerald-600 font-black text-sm">
                                            <CheckCircle2 size={18}/> Renewal Processed Successfully!
                                        </div>
                                    ) : (
                                        <button onClick={handleRenewal} disabled={renewalLoading}
                                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
                                                selectedClient.calculatedStatus === 'Expired'
                                                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg'
                                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'}`}>
                                            {renewalLoading ? (
                                                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                                            ) : (
                                                <><RefreshCw size={16}/> Renew for {renewMonths} Months</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}

                            {!selectedClient.isDummy && (
                                <button onClick={() => handleDelete(selectedClient._id, selectedClient.isDummy)}
                                    className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-rose-400 hover:bg-rose-50 transition-colors border border-rose-100 mt-2">
                                    Delete Contract
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="bg-slate-50 p-3 rounded-xl text-slate-900">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-slate-900 font-bold text-sm">{value || 'N/A'}</p>
        </div>
    </div>
);

export default AMCContracts;