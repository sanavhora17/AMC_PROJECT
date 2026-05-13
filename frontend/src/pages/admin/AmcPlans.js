import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, ShieldCheck, Crown, Zap } from 'lucide-react';
import axios from 'axios'; 

const ManagePlans = () => {
    const [plans, setPlans] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    
    const [formData, setFormData] = useState({ 
        name: '', 
        price: '', 
        validity: '', 
        type: 'Basic', // Added requirement
        features: '' 
    });

    const fetchPlans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/plans/all');
            setPlans(res.data);
        } catch (err) {
            console.error("Error fetching plans:", err);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const openModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                price: plan.price,
                validity: plan.validity,
                type: plan.type || 'Basic',
                features: Array.isArray(plan.features) ? plan.features.join(', ') : plan.features
            });
        } else {
            setEditingPlan(null);
            setFormData({ name: '', price: '', validity: '', type: 'Basic', features: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const planData = {
                ...formData,
                features: typeof formData.features === 'string' ? formData.features.split(',').map(f => f.trim()) : formData.features
            };

            if (editingPlan) {
                await axios.put(`http://localhost:5000/api/plans/${editingPlan._id}`, planData);
                alert("Plan updated!");
            } else {
                await axios.post('http://localhost:5000/api/plans/add', planData);
                alert("Plan created!");
            }
            
            fetchPlans(); 
            setIsModalOpen(false);
        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving to database");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this plan permanently?")) {
            try {
                await axios.delete(`http://localhost:5000/api/plans/${id}`);
                fetchPlans(); 
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    return (
        <div className="p-10 bg-[#F1F5F9] min-h-screen font-sans ml-64">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">AMC Plan Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Create plans that will sync with Customer View.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-[#6366F1] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[#4F46E5] transition-all shadow-xl shadow-indigo-200 uppercase text-[11px] tracking-widest"
                >
                    <Plus size={18} strokeWidth={3} /> Create New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {plans.map((plan) => (
                    <div key={plan._id} className="bg-white rounded-[3rem] p-1 shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="bg-white rounded-[2.8rem] p-8 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    {/* Requirement: Dynamic Icon based on selection */}
                                    <div className={`p-4 rounded-3xl ${
                                        plan.type === 'Premium' ? 'bg-orange-50 text-orange-500' : 
                                        plan.type === 'Standard' ? 'bg-yellow-50 text-yellow-600' : 
                                        'bg-indigo-50 text-indigo-500'
                                    }`}>
                                        {plan.type === 'Premium' ? <Crown size={28} /> : 
                                         plan.type === 'Standard' ? <ShieldCheck size={28} /> : 
                                         <Zap size={28} />}
                                    </div>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full uppercase tracking-widest">
                                        {plan.type || 'Basic'}
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                                    <span className="text-slate-400 font-bold text-sm">/ {plan.validity}</span>
                                </div>
                                
                                <p className="mt-6 text-slate-500 font-medium text-sm leading-relaxed min-h-[50px]">
                                    {Array.isArray(plan.features) ? plan.features.join(', ') : plan.features}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 flex gap-3">
                                <button onClick={() => openModal(plan)} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                    <Pencil size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(plan._id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-10 top-10 text-slate-300 hover:text-slate-900 transition-colors"><X size={30} /></button>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-8">{editingPlan ? 'Edit Plan' : 'New Plan'}</h2>
                        
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Plan Name</label>
                                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold" />
                            </div>

                            {/* Requirement: Dropdown to choose Category */}
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Category (Select for Logo)</label>
                                <select 
                                    value={formData.type} 
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold cursor-pointer"
                                >
                                    <option value="Basic">Basic (Zap Icon)</option>
                                    <option value="Standard">Standard (Shield Icon)</option>
                                    <option value="Premium">Premium (Crown Icon)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Price</label>
                                    <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Validity</label>
                                    <input required type="text" value={formData.validity} onChange={(e) => setFormData({...formData, validity: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Features (Comma separated)</label>
                                <textarea rows="3" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-semibold" />
                            </div>

                            <button type="submit" className="w-full bg-[#6366F1] text-white font-black py-6 rounded-[1.5rem] mt-4 hover:bg-[#4F46E5] transition-all uppercase tracking-widest text-xs shadow-xl">
                                {editingPlan ? 'Update Plan' : 'Save Plan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlans;