import React, { useState, useEffect } from 'react';
import { Trash2, Mail, Phone, Calendar, Search, UserCheck, ShieldCheck, Zap, Crown } from 'lucide-react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/all'); 
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if(window.confirm("Delete this user record?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (err) {
                alert("Error deleting user");
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPlanBadge = (plan) => {
        // Handling both string and object types for plan
        const planName = typeof plan === 'object' ? plan?.planName || plan?.name : plan;

        if (!planName || planName === "No Active Plan") {
            return <span className="text-[10px] bg-slate-100 text-slate-400 px-3 py-1 rounded-full font-black uppercase">No Active Plan</span>;
        }
        
        const style = planName.includes("Gold") ? "bg-amber-100 text-amber-600 border-amber-200" : 
                      planName.includes("Diamond") ? "bg-indigo-100 text-indigo-600 border-indigo-200" : 
                      "bg-slate-100 text-slate-600 border-slate-200";

        return (
            <span className={`flex items-center gap-1 text-[10px] px-3 py-1 rounded-full font-black uppercase border ${style}`}>
                <ShieldCheck size={10} /> {planName}
            </span>
        );
    };

    return (
        <div className="p-10 bg-[#F8FAFC] min-h-screen ml-72 font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 font-medium">Monitoring <span className="text-indigo-600 font-bold">{users.length}</span> Total Clients</p>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm shadow-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {loading ? (
                     <div className="col-span-full text-center py-20 italic text-slate-400 font-bold">Syncing...</div>
                ) : filteredUsers.map(user => (
                    <div key={user._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-between group relative overflow-hidden">
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl uppercase">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-black text-slate-900">{user.name}</h3>
                                    {(user.activePlan || user.planName) && <UserCheck size={14} className="text-indigo-500" />}
                                </div>
                                <div className="mb-3">{getPlanBadge(user.activePlan || user.planName)}</div>
                                <div className="space-y-1 mt-1">
                                    <p className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider"><Mail size={12}/> {user.email}</p>
                                    <p className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider"><Phone size={12}/> {user.phone || user.ph || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between h-full gap-8 relative z-10">
                            <span className="flex items-center gap-1 text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                                <Calendar size={10} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "New"}
                            </span>
                            <button onClick={() => deleteUser(user._id)} className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;