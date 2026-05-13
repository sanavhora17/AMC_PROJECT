import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-react';

const AssignTask = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resReq, resTech] = await Promise.all([
                axios.get('http://localhost:5000/api/requests/all'),
                axios.get('http://localhost:5000/api/technicians'),
            ]);
            setRequests(Array.isArray(resReq.data) ? resReq.data : []);
            setTechnicians(Array.isArray(resTech.data) ? resTech.data : []);
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (requestId) => {
        const techId = selectedTechs[requestId];
        if (!techId) return alert('Pehle technician chunein!');
        const selectedTech = technicians.find(t => t._id === techId);
        setAssigning(requestId);
        try {
            await axios.patch(`http://localhost:5000/api/requests/assign/${requestId}`, {
                technicianId: techId,
                technicianName: selectedTech.name,
            });
            fetchData();
        } catch (err) {
            alert('Assign karne mein error aaya!');
        } finally {
            setAssigning(null);
        }
    };

    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const assigned = requests.filter(r => r.status === 'Assigned').length;
    const completed = requests.filter(r => r.status === 'Completed').length;

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen ml-64">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.25em] mb-1">Operations</p>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Service Workflow</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage and assign client service requests</p>
                </div>
                <button onClick={fetchData} className="p-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                    <RefreshCw size={16} className="text-slate-500" />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Requests', value: total, color: 'text-slate-700', bg: 'bg-slate-50' },
                    { label: 'Pending', value: pending, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Assigned', value: assigned, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Completed', value: completed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`${bg} rounded-[1.5rem] p-5 border border-slate-100`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                        <p className={`text-3xl font-black ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {['Client Info', 'Service Details', 'Assigned Engineer', 'Status', 'Assign Action'].map(h => (
                                <th key={h} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">No requests found in database</td></tr>
                        ) : (
                            requests.map((req) => {
                                const isCompleted = req.status === 'Completed';
                                const isAssigned = req.status === 'Assigned';

                                return (
                                    <tr key={req._id} className={`hover:bg-slate-50/50 transition-colors ${isCompleted ? 'bg-emerald-50/30' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-sm">{req.customerName}</div>
                                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{req.customerEmail}</div>
                                            <div className="text-[10px] text-slate-300 font-medium">{req.requestId}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-black text-slate-700 uppercase">{req.appliance}</div>
                                            <div className="text-[10px] text-slate-400 italic mt-0.5">{req.issue}</div>
                                            <div className="text-[10px] text-slate-300 mt-0.5">{req.address}</div>
                                        </td>
                                        <td className="p-4">
                                            {req.engineerName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                    <span className="text-xs font-bold text-indigo-600">{req.engineerName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 font-medium italic">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {isCompleted ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    <CheckCircle2 size={11} /> COMPLETED
                                                </span>
                                            ) : isAssigned ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                    <Clock size={11} /> IN PROGRESS
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-500 border border-orange-100">
                                                    <AlertCircle size={11} /> PENDING
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {isCompleted ? (
                                                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                                                    <CheckCircle2 size={14} /> Work Done
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="text-[11px] border border-slate-200 rounded-xl p-2 outline-none bg-white text-slate-600"
                                                        value={selectedTechs[req._id] || ''}
                                                        onChange={(e) => setSelectedTechs(prev => ({ ...prev, [req._id]: e.target.value }))}
                                                    >
                                                        <option value="">Select Technician</option>
                                                        {technicians.map(t => (
                                                            <option key={t._id} value={t._id}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleAssign(req._id)}
                                                        disabled={assigning === req._id}
                                                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60"
                                                    >
                                                        <UserPlus size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignTask;