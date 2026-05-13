import React, { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, Download, AlertCircle,
    CheckCircle2, Clock, IndianRupee, Users,
    ArrowUpRight, ArrowDownRight, Calendar, Zap
} from 'lucide-react';
import axios from 'axios';

// ── Dummy contracts — Dashboard ke saath same ──
const DUMMY_CONTRACTS = [
    { _id: 'dx1', userId: { name: 'Ramesh Gupta', _id: 'du1' }, price: 4999, expiryDate: new Date(Date.now() - 45 * 86400000).toISOString(), planName: 'Gold Plan' },
    { _id: 'dx2', userId: { name: 'Sunita Desai', _id: 'du2' }, price: 2999, expiryDate: new Date(Date.now() - 20 * 86400000).toISOString(), planName: 'Silver Plan' },
    { _id: 'dr1', userId: { name: 'Manoj Shah', _id: 'du3' }, price: 7999, expiryDate: new Date(Date.now() + 10 * 86400000).toISOString(), planName: 'Platinum Plan' },
    { _id: 'dr2', userId: { name: 'Priya Mehta', _id: 'du4' }, price: 4999, expiryDate: new Date(Date.now() + 25 * 86400000).toISOString(), planName: 'Gold Plan' },
];

const ReportAnalysis = () => {
    const [stats, setStats] = useState({
        total: 0, active: 0, renewal: 0, expired: 0,
        efficiency: 0, totalRevenue: 0, avgContractValue: 0,
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [topClients, setTopClients] = useState([]);
    const [planData, setPlanData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/contracts');
                const liveData = Array.isArray(res.data) ? res.data : [];

                // ✅ Real + Dummy merge
                const data = [...liveData, ...DUMMY_CONTRACTS];

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let active = 0, renewal = 0, expired = 0, totalRevenue = 0;
                const monthMap = {};
                const clientMap = {};
                const planMap = {};

                data.forEach(c => {
                    const expiryRaw = c.expiryDate;
                    // ✅ FIX — price field use karo
                    const amount = parseFloat(c.price || c.amount || c.totalAmount || 0);
                    // ✅ FIX — userId.name se client name
                    const clientName = c.userId?.name || c.clientName || c.userName || 'Unknown';
                    // ✅ FIX — planName use karo
                    const planName = c.planName || c.equipmentType || c.serviceTitle || 'General';

                    totalRevenue += amount;

                    if (expiryRaw) {
                        const expiry = new Date(expiryRaw);
                        expiry.setHours(0, 0, 0, 0);
                        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                        if (diff < 0) expired++;
                        else if (diff <= 30) { renewal++; active++; }
                        else active++;

                        // Monthly grouping
                        const key = `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, '0')}`;
                        monthMap[key] = (monthMap[key] || 0) + 1;
                    } else { active++; }

                    // Client revenue map
                    if (!clientMap[clientName]) clientMap[clientName] = { name: clientName, revenue: 0, count: 0 };
                    clientMap[clientName].revenue += amount;
                    clientMap[clientName].count += 1;

                    // Plan map
                    planMap[planName] = (planMap[planName] || 0) + 1;
                });

                const total = data.length;
                const efficiency = total > 0 ? Math.round((active / total) * 100) : 0;

                // Last 6 months
                const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                const last6 = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    last6.push({ month: monthNames[d.getMonth()], count: monthMap[key] || 0 });
                }

                // Top 5 clients
                const top5 = Object.values(clientMap)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5);

                // Plan breakdown
                const planList = Object.entries(planMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setStats({
                    total, active, renewal, expired, efficiency,
                    totalRevenue: Math.round(totalRevenue),
                    avgContractValue: total > 0 ? Math.round(totalRevenue / total) : 0
                });
                setMonthlyData(last6);
                setTopClients(top5);
                setPlanData(planList);

            } catch (err) {
                console.error('ReportAnalysis fetch error:', err);
                // Backend offline ho toh sirf dummy se kaam chalo
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let active = 0, renewal = 0, expired = 0, totalRevenue = 0;
                const clientMap = {};
                const planMap = {};

                DUMMY_CONTRACTS.forEach(c => {
                    const amount = parseFloat(c.price || 0);
                    totalRevenue += amount;
                    const expiry = new Date(c.expiryDate);
                    expiry.setHours(0, 0, 0, 0);
                    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                    if (diff < 0) expired++;
                    else if (diff <= 30) { renewal++; active++; }
                    else active++;

                    const name = c.userId?.name || 'Unknown';
                    if (!clientMap[name]) clientMap[name] = { name, revenue: 0, count: 0 };
                    clientMap[name].revenue += amount;
                    clientMap[name].count += 1;

                    const plan = c.planName || 'General';
                    planMap[plan] = (planMap[plan] || 0) + 1;
                });

                const total = DUMMY_CONTRACTS.length;
                setStats({ total, active, renewal, expired, efficiency: Math.round((active / total) * 100), totalRevenue: Math.round(totalRevenue), avgContractValue: Math.round(totalRevenue / total) });
                setTopClients(Object.values(clientMap).sort((a, b) => b.revenue - a.revenue));
                setPlanData(Object.entries(planMap).map(([name, count]) => ({ name, count })));
                setMonthlyData([{ month: 'Jan', count: 0 }, { month: 'Feb', count: 0 }, { month: 'Mar', count: 0 }, { month: 'Apr', count: 0 }, { month: 'May', count: 0 }, { month: 'Jun', count: 0 }]);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const fmt = (n) => {
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
        if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
        return `₹${n}`;
    };

    const maxBar = Math.max(...monthlyData.map(m => m.count), 1);

    const handleExport = () => {
        const rows = [
            ['Metric', 'Value'],
            ['Total Contracts', stats.total],
            ['Active', stats.active],
            ['Renewal Due', stats.renewal],
            ['Expired', stats.expired],
            ['Efficiency %', stats.efficiency],
            ['Total Revenue', stats.totalRevenue],
            ['Avg Contract Value', stats.avgContractValue],
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'amc-report.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="flex-1 ml-64 flex items-center justify-center min-h-screen bg-[#F8FAFC]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
    );

    return (
        <div className="flex-1 ml-64 p-10 bg-[#F8FAFC] min-h-screen">

            {/* HEADER */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.25em] mb-1">Business Intelligence</p>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Report Analysis</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Live contract performance & revenue breakdown</p>
                </div>
                <button onClick={handleExport} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors text-sm">
                    <Download size={16} /> Export CSV
                </button>
            </header>

            {/* KPI ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total Revenue', value: fmt(stats.totalRevenue), icon: <IndianRupee size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'From all contracts', up: true },
                    { label: 'Avg Contract Value', value: fmt(stats.avgContractValue), icon: <BarChart3 size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Per contract', up: true },
                    { label: 'System Efficiency', value: `${stats.efficiency}%`, icon: <TrendingUp size={18}/>, color: 'text-sky-600', bg: 'bg-sky-50', trend: stats.efficiency > 70 ? 'Good' : 'Needs attention', up: stats.efficiency > 70 },
                    { label: 'Renewal Alerts', value: stats.renewal, icon: <AlertCircle size={18}/>, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Action needed', up: false },
                ].map((k, i) => (
                    <div key={i} className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 ${k.bg} ${k.color} rounded-xl flex items-center justify-center mb-4`}>{k.icon}</div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                        <p className="text-2xl font-black text-slate-900">{k.value}</p>
                        <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${k.up ? 'text-emerald-500' : 'text-orange-500'}`}>
                            {k.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                            {k.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly Trend</p>
                            <p className="text-lg font-black text-slate-800 mt-0.5">Contract Expiry Distribution</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                            <Calendar size={11}/> Last 6 Months
                        </div>
                    </div>
                    <div className="flex items-end gap-3 h-44">
                        {monthlyData.map((m, i) => {
                            const heightPct = maxBar > 0 ? (m.count / maxBar) * 100 : 0;
                            const isMax = m.count > 0 && m.count === Math.max(...monthlyData.map(x => x.count));
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-500">{m.count > 0 ? m.count : ''}</span>
                                    <div className="w-full flex items-end" style={{ height: '120px' }}>
                                        <div
                                            className={`w-full rounded-xl transition-all duration-700 ${isMax ? 'bg-indigo-600' : 'bg-indigo-100'}`}
                                            style={{ height: `${Math.max(heightPct, m.count > 0 ? 8 : 2)}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{m.month}</span>
                                </div>
                            );
                        })}
                    </div>
                    {monthlyData.every(m => m.count === 0) && (
                        <p className="text-center text-slate-400 text-sm mt-4">No expiry data for last 6 months</p>
                    )}
                </div>

                {/* Status Breakdown */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <Zap size={20} fill="white" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Contract Health</p>
                        <p className="text-4xl font-black italic text-white">{stats.efficiency}%</p>
                        <p className="text-slate-500 text-xs mt-1 font-medium">Active rate across all contracts</p>
                    </div>
                    <div className="space-y-4 mt-8">
                        {[
                            { label: 'Active', count: stats.active, color: 'bg-emerald-500', icon: <CheckCircle2 size={12}/> },
                            { label: 'Renewal Due', count: stats.renewal, color: 'bg-orange-500', icon: <Clock size={12}/> },
                            { label: 'Expired', count: stats.expired, color: 'bg-red-500', icon: <AlertCircle size={12}/> },
                        ].map(({ label, count, color, icon }) => {
                            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                            return (
                                <div key={label}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{icon}{label}</div>
                                        <span className="text-xs font-black text-white">{count} <span className="text-slate-500 font-medium">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Contracts</p>
                        <p className="text-3xl font-black">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Clients */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Clients</p>
                            <p className="text-lg font-black text-slate-800 mt-0.5">By Revenue</p>
                        </div>
                        <Users size={18} className="text-slate-300" />
                    </div>
                    {topClients.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No client data available</p>
                    ) : (
                        <div className="space-y-4">
                            {topClients.map((client, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-300 w-5">#{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{client.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{client.count} contract{client.count > 1 ? 's' : ''}</p>
                                    </div>
                                    <span className="text-sm font-black text-indigo-600">{fmt(client.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Plan Breakdown */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan Types</p>
                            <p className="text-lg font-black text-slate-800 mt-0.5">Contract Distribution</p>
                        </div>
                        <BarChart3 size={18} className="text-slate-300" />
                    </div>
                    {planData.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No plan data available</p>
                    ) : (
                        <div className="space-y-5">
                            {planData.map((plan, i) => {
                                const pct = stats.total > 0 ? Math.round((plan.count / stats.total) * 100) : 0;
                                const colors = ['bg-indigo-500', 'bg-sky-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500'];
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs font-bold text-slate-600 truncate max-w-[60%]">{plan.name}</span>
                                            <span className="text-[10px] font-black text-slate-400">{plan.count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className={`${colors[i % colors.length]} h-full rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportAnalysis;