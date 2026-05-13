import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, UserPlus, Filter } from 'lucide-react';
import axios from 'axios';

const ServiceRequest = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);

    const fetchData = async () => {
        try {
            // Frontend 3000 par chalta hai, Backend 5000 par. Isliye 5000 use kiya hai.
            const resReq = await axios.get('http://localhost:5000/api/requests/all');
            const resTech = await axios.get('http://localhost:5000/api/technicians');
            setRequests(resReq.data);
            setTechnicians(resTech.data);
        } catch (err) {
            console.error("Data load error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/requests/update-status/${id}`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert("Status update failed!");
        }
    };

    const assignEngineer = async (requestId, techId) => {
        if (!techId) return;
        const selectedTech = technicians.find(t => t._id === techId);
        try {
            await axios.patch(`http://localhost:5000/api/requests/assign/${requestId}`, {
                technicianId: techId,
                technicianName: selectedTech.name
            });
            alert(`Assigned to ${selectedTech.name} successfully!`);
            fetchData();
        } catch (err) {
            alert("Assignment failed!");
        }
    };

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen ml-72">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">SERVICE WORKFLOW</h1>
                    <p className="text-slate-500 font-medium">Manage and Assign client service requests.</p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <Filter size={18} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Requests: {requests.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Info</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Details</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Engineer</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Status</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="p-6">
                                        <p className="text-[10px] font-black text-indigo-600 mb-1">{req._id.substring(0,8)}</p>
                                        {/* Data fallback: Agar customerName nahi hai toh name dikhaye */}
                                        <p className="font-bold text-slate-900">{req.customerName || req.name || "Unknown Client"}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-6 italic font-bold text-slate-600 uppercase text-xs">
                                        {req.appliance || req.serviceType || "N/A"}
                                        <p className="text-[10px] font-medium text-slate-400 normal-case italic mt-1">{req.issue || req.description || "No description"}</p>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                                                {(req.technicianName || req.engineerName || "N").charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{req.technicianName || req.engineerName || "Not Assigned"}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            req.status === 'Pending' ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                            req.status === 'Approved' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                            'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => updateStatus(req._id, 'Approved')} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                                <CheckCircle size={18} />
                                            </button>
                                            <div className="relative group/btn">
                                                <select className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full" onChange={(e) => assignEngineer(req._id, e.target.value)} value="">
                                                    <option value="" disabled>Assign Tech</option>
                                                    {technicians.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                </select>
                                                <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                                                    <UserPlus size={18} />
                                                </button>
                                            </div>
                                            <button onClick={() => updateStatus(req._id, 'Rejected')} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest">No Requests Found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceRequest;