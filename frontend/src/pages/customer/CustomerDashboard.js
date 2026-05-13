import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CreditCard, User, LogOut,
    PlusCircle, Clock, CheckCircle, ShieldCheck,
    Wallet, AlertCircle, Activity, CheckCircle2, Wrench
} from 'lucide-react';
import axios from 'axios';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myRequests, setMyRequests] = useState([]);

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
            fetchMyRequests(res.data.email);
        } catch (err) {
            console.error('User fetch error', err);
            navigate('/login');
        }
    };

    // ✅ Backend se requests fetch
    const fetchMyRequests = async (email) => {
        try {
            const res = await axios.get('http://localhost:5000/api/requests/all');
            const filtered = res.data.filter(req => req.customerEmail === email);
            setMyRequests(filtered);
        } catch (err) {
            console.error('Error fetching requests', err);
        }
    };

    const handleLogout = () => {
        // ✅ Sirf userId hatao
        localStorage.removeItem('userId');
        navigate('/login');
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
            <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Loading...</p>
        </div>
    );

    const pendingCount = myRequests.filter(r => r.status === 'Pending').length;
    const completedCount = myRequests.filter(r => r.status === 'Completed').length;
    const assignedCount = myRequests.filter(r => r.status === 'Assigned').length;

    const getStatusStyle = (status) => {
        if (status === 'Completed') return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
        if (status === 'Assigned') return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' };
        return { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100' };
    };

    const getStatusIcon = (status) => {
        if (status === 'Completed') return <CheckCircle2 size={11} />;
        if (status === 'Assigned') return <Wrench size={11} />;
        return <Clock size={11} />;
    };

    return (
        <div className="h-screen w-full bg-[#F0F7FF] flex overflow-hidden font-sans text-slate-900">

            <aside className="w-72 bg-[#0F172A] p-8 flex flex-col relative z-20">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="bg-sky-500 p-2 rounded-xl text-white shadow-lg shadow-sky-500/20">
                        <ShieldCheck size={22} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter italic uppercase text-white">
                        AMC<span className="text-sky-400">PRO</span>
                    </span>
                </div>
                <nav className="space-y-1 flex-1">
                    <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
                    <NavItem icon={<CreditCard size={18}/>} label="Plans" onClick={() => navigate('/customer/plans')} />
                    <NavItem icon={<Wallet size={18}/>} label="Payments" onClick={() => navigate('/customer/payment')} />
                    <NavItem icon={<PlusCircle size={18}/>} label="Book Service" onClick={() => navigate('/customer/book-service')} />
                    <NavItem icon={<User size={18}/>} label="Profile" onClick={() => navigate('/customer/profile')} />
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-red-400 transition-all border-t border-slate-800 pt-6"
                >
                    <LogOut size={18}/> Sign Out System
                </button>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="px-10 py-8 bg-[#E0F2FE] border-b border-sky-100 flex justify-between items-center shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1 w-6 bg-sky-500 rounded-full"></span>
                            <p className="text-sky-600 font-black text-[10px] uppercase tracking-widest">Active Session</p>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
                            WELCOME, <span className="text-sky-900">{user.name}!</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-sm">Your service ecosystem is under control.</p>
                    </div>
                    <div className="flex items-center gap-5 bg-[#0F172A] p-2 pr-6 rounded-[2rem] shadow-xl border border-slate-800">
                        <div className="w-14 h-14 bg-sky-500 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-sky-500/30">
                            {user.name.charAt(0)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-black text-white text-sm tracking-tight leading-none mb-1">{user.email}</p>
                            <p className="text-[10px] text-sky-400 font-black uppercase tracking-[0.2em]">
                                {user.activePlan || 'Standard'} Member
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-grow flex flex-col gap-6 overflow-hidden">

                    {completedCount > 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-[1.5rem] p-5 flex items-center gap-4 shrink-0">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-black text-emerald-700 text-sm">
                                    {completedCount} Service{completedCount > 1 ? 's' : ''} Completed ✓
                                </p>
                                <p className="text-emerald-500 text-xs font-medium">
                                    Your technician has finished the work. Please verify and confirm.
                                </p>
                            </div>
                        </div>
                    )}

                    {assignedCount > 0 && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-[1.5rem] p-5 flex items-center gap-4 shrink-0">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Wrench size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-black text-indigo-700 text-sm">
                                    {assignedCount} Service{assignedCount > 1 ? 's' : ''} In Progress
                                </p>
                                <p className="text-indigo-400 text-xs font-medium">
                                    Technician has been assigned and is working on your request.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                        <StatCard label="Total Requests" value={myRequests.length} icon={<Activity size={20}/>} color="text-sky-600" bg="bg-sky-100" />
                        <StatCard label="Pending Approval" value={pendingCount} icon={<Clock size={20}/>} color="text-orange-500" bg="bg-orange-50" />
                        <StatCard label="Under Process" value={assignedCount} icon={<AlertCircle size={20}/>} color="text-indigo-600" bg="bg-indigo-50" />
                        <StatCard label="Job Completed" value={completedCount} icon={<CheckCircle size={20}/>} color="text-emerald-600" bg="bg-emerald-50" />
                    </div>

                    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

                        <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-sky-500/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                            <div>
                                <span className="bg-sky-500/20 text-sky-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-500/30">Active Plan</span>
                                <p className="text-5xl font-black italic uppercase tracking-tighter mt-6 leading-tight group-hover:text-sky-400 transition-colors">
                                    {user.activePlan || 'No Active Plan'}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => navigate('/customer/plans')}
                                    className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-white transition-all shadow-2xl shadow-black/20"
                                >
                                    Upgrade Coverage
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                            <div className="px-10 py-6 border-b border-slate-50 flex justify-between items-center shrink-0">
                                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900">Recent Service Activity</h3>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{myRequests.length} Records</span>
                            </div>
                            <div className="flex-grow overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <tbody className="divide-y divide-slate-50">
                                        {myRequests.slice(0, 6).map((req) => {
                                            const s = getStatusStyle(req.status);
                                            return (
                                                <tr key={req._id} className={`hover:bg-sky-50/50 transition-all ${req.status === 'Completed' ? 'bg-emerald-50/30' : ''}`}>
                                                    <td className="px-8 py-5">
                                                        <div className="font-black text-slate-900 text-sm uppercase">{req.requestId}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{req.appliance}</div>
                                                        {req.engineerName && (
                                                            <div className="text-[10px] text-indigo-400 font-bold mt-0.5">
                                                                Technician: {req.engineerName}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.bg} ${s.text} ${s.border}`}>
                                                            {getStatusIcon(req.status)}
                                                            {req.status === 'Completed' ? 'Completed ✓' : req.status === 'Assigned' ? 'In Progress' : req.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button className="text-slate-200 hover:text-sky-600 transition-colors">
                                                            <PlusCircle size={20} className="rotate-45" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {myRequests.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="py-24 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-xs">
                                                    No service requests yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 p-4 rounded-xl cursor-pointer font-black text-[10px] uppercase tracking-[0.2em] transition-all group ${
            active ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40 scale-[1.02]' : 'text-slate-500 hover:text-white hover:bg-white/5'
        }`}>
        <span className={`${active ? 'text-white' : 'text-sky-400 group-hover:text-white'}`}>{icon}</span>
        {label}
    </button>
);

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-5 hover:border-sky-200 transition-all shadow-sm">
        <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center shrink-0`}>{icon}</div>
        <div>
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-0.5">{label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</p>
        </div>
    </div>
);

export default CustomerDashboard;