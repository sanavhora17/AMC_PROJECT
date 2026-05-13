import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Users, TrendingUp, Clock, CheckCircle2,
    BarChart3, Shield, Mail, RefreshCw, AlertTriangle,
    IndianRupee, FileText, Bell, Wrench
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const DUMMY_CONTRACTS = [
    { _id: 'dx1', userId: { name: 'Ramesh Gupta', _id: 'du1' }, price: 4999, expiryDate: new Date(Date.now() - 45 * 86400000).toISOString(), planName: 'Gold Plan', calculatedStatus: 'Expired' },
    { _id: 'dx2', userId: { name: 'Sunita Desai', _id: 'du2' }, price: 2999, expiryDate: new Date(Date.now() - 20 * 86400000).toISOString(), planName: 'Silver Plan', calculatedStatus: 'Expired' },
    { _id: 'dr1', userId: { name: 'Manoj Shah', _id: 'du3' }, price: 7999, expiryDate: new Date(Date.now() + 10 * 86400000).toISOString(), planName: 'Platinum Plan', calculatedStatus: 'Renewal Due' },
    { _id: 'dr2', userId: { name: 'Priya Mehta', _id: 'du4' }, price: 4999, expiryDate: new Date(Date.now() + 25 * 86400000).toISOString(), planName: 'Gold Plan', calculatedStatus: 'Renewal Due' },
];

const AdminDashboard = () => {
    const adminData = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'Admin',
        email: 'admin@amcpro.com'
    };

    const [stats, setStats] = useState({
        totalContracts: 0,
        activeContracts: 0,
        expiringIn30Days: 0,
        expiredContracts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalClients: 0,
        totalRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
        assignedRequests: 0,
    });

    const [recentContracts, setRecentContracts] = useState([]);
    const [completedServices, setCompletedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const contractsRes = await axios.get(`${API_BASE}/admin/contracts`, { timeout: 10000 });
            const liveContracts = Array.isArray(contractsRes.data) ? contractsRes.data : [];
            const allContracts = [...liveContracts, ...DUMMY_CONTRACTS];

            let allUsers = [];
            try {
                const usersRes = await axios.get(`${API_BASE}/admin/users`, { timeout: 5000 });
                allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
            } catch {
                console.warn('Users endpoint unavailable');
            }

            let allRequests = [];
            try {
                const reqRes = await axios.get(`${API_BASE}/requests/all`, { timeout: 5000 });
                allRequests = Array.isArray(reqRes.data) ? reqRes.data : [];
            } catch {
                console.warn('Requests endpoint unavailable');
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let active = 0, expiring30 = 0, expired = 0, totalRevenue = 0;
            const recent = [];

            allContracts.forEach(c => {
                const amount = parseFloat(c.price || c.amount || c.totalAmount || 0);
                totalRevenue += amount;
                const expiryDateRaw = c.expiryDate;
                if (expiryDateRaw) {
                    const expiry = new Date(expiryDateRaw);
                    expiry.setHours(0, 0, 0, 0);
                    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                    if (diffDays < 0) expired++;
                    else if (diffDays <= 30) { expiring30++; active++; }
                    else active++;
                } else {
                    active++;
                }
                recent.push({
                    id: c._id,
                    client: c.userId?.name || c.clientName || c.userName || 'Unknown Client',
                    expiry: expiryDateRaw
                        ? new Date(expiryDateRaw).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })
                        : 'N/A',
                    amount,
                    status: !expiryDateRaw ? 'active'
                        : new Date(expiryDateRaw) < today ? 'expired'
                        : Math.ceil((new Date(expiryDateRaw) - today) / (1000 * 60 * 60 * 24)) <= 30
                        ? 'expiring' : 'active',
                    equipment: c.planName || c.equipmentType || c.serviceTitle || 'General',
                });
            });

            const completedRequests = allRequests.filter(r => r.status === 'Completed').length;
            const pendingRequests = allRequests.filter(r => r.status === 'Pending').length;
            const assignedRequests = allRequests.filter(r => r.status === 'Assigned').length;

            setCompletedServices(allRequests.filter(r => r.status === 'Completed'));

            setStats({
                totalContracts: allContracts.length,
                activeContracts: active,
                expiringIn30Days: expiring30,
                expiredContracts: expired,
                totalUsers: allUsers.length,
                totalRevenue: Math.round(totalRevenue),
                totalClients: new Set(
                    allContracts.map(c => c.userId?._id?.toString() || c.userId?.toString())
                ).size,
                totalRequests: allRequests.length,
                completedRequests,
                pendingRequests,
                assignedRequests,
            });

            setRecentContracts(
                recent.sort((a, b) => new Date(a.expiry) - new Date(b.expiry)).slice(0, 5)
            );
            setLastUpdated(
                new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            );

        } catch (err) {
            console.error('Dashboard fetch error:', err);
            if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to backend server. Please check port 5000.');
            } else if (err.response?.status === 404) {
                setError('API route /api/admin/contracts not found.');
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Authentication required. Please login again.');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const efficiency = stats.totalContracts > 0
        ? Math.round((stats.activeContracts / stats.totalContracts) * 100) : 0;

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount}`;
    };

    if (loading) return (
        <div className="ml-72 p-10 flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="text-slate-500 text-sm font-medium">Loading dashboard data...</p>
        </div>
    );

    return (
        <div className="flex-1 ml-72 p-8 bg-[#F8FAFC] min-h-screen">

            {/* Header */}
            <header className="flex justify-between items-center mb-8 bg-gradient-to-r from-[#E0F2FE] to-white p-6 rounded-[2rem] border border-sky-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">System Overview</h1>
                    <p className="text-sky-600 font-bold text-xs uppercase tracking-[0.2em] mt-1">
                        Annual Maintenance Contract — Live Dashboard
                    </p>
                    {lastUpdated && (
                        <p className="text-slate-400 text-[10px] mt-0.5 font-medium">Last updated: {lastUpdated}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchDashboardData} className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                        <RefreshCw size={16} className="text-slate-500" />
                    </button>
                    <div className="flex items-center gap-4 bg-[#0F172A] p-2 pr-6 rounded-full shadow-xl border border-slate-800">
                        <div className="w-12 h-12 bg-[#6366F1] rounded-full flex items-center justify-center text-white shadow-lg">
                            <Shield size={22} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black text-white uppercase tracking-wider">{adminData.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Mail size={10} className="text-indigo-400" />
                                <p className="text-[10px] font-bold text-slate-400 lowercase">{adminData.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-red-700 text-sm font-bold">Connection Error</p>
                        <p className="text-red-600 text-xs mt-0.5">{error}</p>
                    </div>
                    <button onClick={fetchDashboardData} className="ml-auto text-xs text-red-600 font-bold hover:text-red-800 shrink-0">
                        Retry
                    </button>
                </div>
            )}

            {/* Contract Stats Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard label="Total Contracts" value={stats.totalContracts} icon={<FileText size={20} />} color="indigo" sub="All contracts in system" />
                <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<IndianRupee size={20} />} color="emerald" sub="Contract price total" />
                <StatCard label="Expiring Soon" value={stats.expiringIn30Days} icon={<Bell size={20} />} color="orange" sub="Within 30 days" alert={stats.expiringIn30Days > 0} />
                <StatCard label="Total Clients" value={stats.totalClients} icon={<Users size={20} />} color="purple" sub="Unique clients" />
            </div>

            {/* Contract Stats Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard label="Active Contracts" value={stats.activeContracts} icon={<CheckCircle2 size={20} />} color="teal" sub="Currently active" />
                <StatCard label="Active Rate" value={`${efficiency}%`} icon={<TrendingUp size={20} />} color="sky" sub="System efficiency" />
                <StatCard label="Expired" value={stats.expiredContracts} icon={<Clock size={20} />} color="rose" sub="Need renewal" />
                <StatCard label="System Users" value={stats.totalUsers} icon={<BarChart3 size={20} />} color="violet" sub="Admin & staff" />
            </div>

            {/* Service Requests Stats */}
            <div className="mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">
                    Service Requests Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Requests" value={stats.totalRequests} icon={<Wrench size={20} />} color="indigo" sub="All service requests" />
                    <StatCard label="Completed Services" value={stats.completedRequests} icon={<CheckCircle2 size={20} />} color="emerald" sub="Work finished by technician" />
                    <StatCard label="In Progress" value={stats.assignedRequests} icon={<Wrench size={20} />} color="sky" sub="Technician assigned" />
                    <StatCard label="Pending" value={stats.pendingRequests} icon={<Clock size={20} />} color="orange" sub="Awaiting assignment" alert={stats.pendingRequests > 0} />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Live Contract Distribution</h3>
                    <div className="space-y-6">
                        <ReportProgress label="Active Contracts" count={stats.activeContracts - stats.expiringIn30Days} total={stats.totalContracts} color="bg-indigo-500" />
                        <ReportProgress label="Expiring in 30 Days" count={stats.expiringIn30Days} total={stats.totalContracts} color="bg-orange-400" />
                        <ReportProgress label="Expired / Lapsed" count={stats.expiredContracts} total={stats.totalContracts} color="bg-rose-500" />
                    </div>

                    {stats.totalRequests > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Service Request Distribution</h3>
                            <div className="space-y-6">
                                <ReportProgress label="Completed" count={stats.completedRequests} total={stats.totalRequests} color="bg-emerald-500" />
                                <ReportProgress label="In Progress" count={stats.assignedRequests} total={stats.totalRequests} color="bg-sky-500" />
                                <ReportProgress label="Pending" count={stats.pendingRequests} total={stats.totalRequests} color="bg-orange-400" />
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-3 gap-4">
                        <MiniStat label="Active" value={stats.activeContracts} dot="bg-indigo-500" />
                        <MiniStat label="Expiring" value={stats.expiringIn30Days} dot="bg-orange-400" />
                        <MiniStat label="Expired" value={stats.expiredContracts} dot="bg-rose-500" />
                    </div>
                </div>

                <div className="bg-[#0F172A] p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl border border-slate-800">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">System Status</h3>
                        <div className={`text-4xl font-black mb-2 tracking-tighter italic ${error ? 'text-rose-400' : 'text-indigo-400'}`}>
                            {error ? 'OFFLINE' : 'SYNCED'}
                        </div>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-4">
                            {error ? 'Backend connection failed. Check server.' : 'Live data from MongoDB Atlas database.'}
                        </p>
                        <div className="space-y-3 mt-6">
                            <QuickStat label="Contract Efficiency" value={`${efficiency}%`} />
                            <QuickStat label="Alerts Today" value={stats.expiringIn30Days} highlight={stats.expiringIn30Days > 0} />
                            <QuickStat label="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
                            <QuickStat label="Services Completed" value={stats.completedRequests} />
                            <QuickStat label="Services Pending" value={stats.pendingRequests} highlight={stats.pendingRequests > 0} />
                        </div>
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 mt-6">
                        <div className="flex justify-between items-center mb-2 font-black text-[9px] uppercase tracking-widest text-slate-500">
                            <span>Data Refresh</span>
                            <span className={error ? 'text-rose-400' : 'text-emerald-400'}>{error ? 'Failed' : 'Success'}</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${error ? 'bg-rose-500 w-1/3' : 'w-full bg-indigo-500'}`}
                                style={{ boxShadow: error ? undefined : '0 0 10px #6366F1' }} />
                        </div>
                        {lastUpdated && (
                            <p className="text-[9px] text-slate-600 mt-2">Last sync: {lastUpdated} • Auto-refresh: 5min</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Expiring Contracts Table */}
            {recentContracts.length > 0 && (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="p-8 pb-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Upcoming Renewals / Expiring Contracts</h3>
                        <p className="text-xs text-slate-400 mt-1">Sorted by expiry date (earliest first)</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-slate-50">
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">Client</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-4 py-4">Plan</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-4 py-4">Expiry Date</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-4 py-4">Amount</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentContracts.map((contract, i) => (
                                    <tr key={contract.id || i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 text-sm font-bold text-slate-800">{contract.client}</td>
                                        <td className="px-4 py-4 text-xs text-slate-500 font-medium">{contract.equipment}</td>
                                        <td className="px-4 py-4 text-xs text-slate-600 font-medium">{contract.expiry}</td>
                                        <td className="px-4 py-4 text-xs text-slate-600 font-bold">
                                            {contract.amount > 0 ? `₹${contract.amount.toLocaleString('en-IN')}` : '—'}
                                        </td>
                                        <td className="px-8 py-4"><StatusBadge status={contract.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Completed Services Table */}
            {completedServices.length > 0 && (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 pb-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                Recently Completed Services
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Tasks completed by technicians — {completedServices.length} total
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 size={12} /> {completedServices.length} Completed
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-slate-50">
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">Customer</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-4 py-4">Appliance</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate.400 px-4 py-4">Technician</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-4 py-4">Address</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-4 py-4">Issue</th>
                                    <th className="text-left text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedServices.map((req, i) => (
                                    <tr key={req._id || i} className="border-t border-slate-50 hover:bg-emerald-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="text-sm font-bold text-slate-800">{req.customerName || '—'}</div>
                                            <div className="text-[10px] text-slate-400">{req.customerEmail || ''}</div>
                                            <div className="text-[10px] text-slate-300">{req.customerPhone || ''}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-xs font-black text-slate-700 uppercase">{req.appliance || '—'}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold text-emerald-600">
                                                    {req.engineerName || req.assignedTechnician?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-500 max-w-[150px] truncate">
                                            {req.address || '—'}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-500 italic max-w-[150px] truncate">
                                            {req.issue || '—'}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <CheckCircle2 size={10} /> COMPLETED
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
};

const StatCard = ({ label, value, icon, color, sub, alert }) => {
    const c = colorMap[color] || colorMap.indigo;
    return (
        <div className={`bg-white p-6 rounded-[2rem] border shadow-sm transition-all hover:shadow-md relative ${alert ? 'border-orange-200' : 'border-slate-100'}`}>
            {alert && <span className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />}
            <div className={`p-3 ${c.bg} ${c.text} rounded-2xl w-fit mb-4`}>{icon}</div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            {sub && <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>}
        </div>
    );
};

const ReportProgress = ({ label, count, total, color }) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em]">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-900">{percent}% — {count} Units</span>
            </div>
            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100">
                <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
};

const MiniStat = ({ label, value, dot }) => (
    <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{label}</p>
            <p className="text-lg font-black text-slate-800">{value}</p>
        </div>
    </div>
);

const QuickStat = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] text-slate-500 font-medium">{label}</span>
        <span className={`text-[11px] font-black ${highlight ? 'text-orange-400' : 'text-slate-300'}`}>{value}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        expiring: 'bg-orange-50 text-orange-700 border-orange-100',
        expired: 'bg-rose-50 text-rose-700 border-rose-100',
    };
    const labels = { active: 'Active', expiring: 'Expiring Soon', expired: 'Expired' };
    return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles[status] || styles.active}`}>
            {labels[status] || status}
        </span>
    );
};

export default AdminDashboard;