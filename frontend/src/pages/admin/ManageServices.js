import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Settings, PenLine, Save, X, Layers, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    // 1. imageUrl field add kiya gaya
    const [serviceForm, setServiceForm] = useState({ title: '', price: '', description: '', imageUrl: '' });

    const fetchServices = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/services/all');
            setServices(res.data);
        } catch (err) {
            console.error("Error fetching services:", err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serviceForm.title || !serviceForm.price) return;

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/services/${editingId}`, serviceForm);
            } else {
                await axios.post('http://localhost:5000/api/services/add', serviceForm);
            }
            fetchServices();
            resetForm();
        } catch (err) {
            console.error("Error saving service:", err);
            alert("Database Error: Could not save.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanent Delete? This will reflect on Customer Site too.")) {
            try {
                await axios.delete(`http://localhost:5000/api/services/${id}`);
                fetchServices();
            } catch (err) {
                console.error("Error deleting service:", err);
            }
        }
    };

    const startEdit = (service) => {
        setEditingId(service._id);
        setServiceForm({ 
            title: service.title, 
            price: service.price, 
            description: service.description,
            imageUrl: service.imageUrl || '' // Edit ke waqt purani image load ho
        });
        setIsAdding(true);
    };

    const resetForm = () => {
        setServiceForm({ title: '', price: '', description: '', imageUrl: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    return (
        <div className="p-10 bg-[#F8FAFC] min-h-screen ml-72 font-sans text-slate-900">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Layers className="text-indigo-600" size={28} />
                        <h1 className="text-4xl font-black tracking-tight italic uppercase">Service Suite</h1>
                    </div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-10">Live Portal Management</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setIsAdding(true); }}
                    className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-600 shadow-2xl shadow-indigo-200 transition-all uppercase text-xs tracking-tighter"
                >
                    <Plus size={20} /> Create New Offer
                </button>
            </div>

            {/* FORM SECTION (Updated with Image Input) */}
            {isAdding && (
                <div className="mb-12 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl animate-in slide-in-from-top duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-slate-800 uppercase italic">
                            {editingId ? "Edit Service Configuration" : "Deploy New Service"}
                        </h2>
                        <button onClick={resetForm} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Service Label</label>
                            <input 
                                type="text" placeholder="e.g. Deep Cleaning" 
                                className="w-full p-5 bg-slate-50 border-none rounded-3xl outline-none focus:ring-2 ring-indigo-500 font-bold text-slate-700"
                                value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Price Model</label>
                            <input 
                                type="text" placeholder="e.g. ₹1,200" 
                                className="w-full p-5 bg-slate-50 border-none rounded-3xl outline-none focus:ring-2 ring-indigo-500 font-bold text-slate-700"
                                value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                            />
                        </div>
                        {/* Naya Image URL Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Image URL (Online Link)</label>
                            <input 
                                type="text" placeholder="https://image-link.com/photo.jpg" 
                                className="w-full p-5 bg-slate-50 border-none rounded-3xl outline-none focus:ring-2 ring-indigo-500 font-bold text-slate-700"
                                value={serviceForm.imageUrl} onChange={(e) => setServiceForm({...serviceForm, imageUrl: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                            <input 
                                type="text" placeholder="Short summary" 
                                className="w-full p-5 bg-slate-50 border-none rounded-3xl outline-none focus:ring-2 ring-indigo-500 font-bold text-slate-700"
                                value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="md:col-span-2 lg:col-span-4 bg-indigo-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-100">
                            <Save size={20} /> {editingId ? "Update Database" : "Sync to Live Portal"}
                        </button>
                    </form>
                </div>
            )}

            {/* SERVICES DISPLAY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.length > 0 ? services.map(service => (
                    <div key={service._id} className="bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all group relative border-b-4 border-b-transparent hover:border-b-indigo-500 flex flex-col">
                        
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                            <button onClick={() => startEdit(service)} className="text-indigo-600 hover:bg-indigo-600 hover:text-white p-3 bg-indigo-50 rounded-2xl transition-all">
                                <PenLine size={18} />
                            </button>
                            <button onClick={() => handleDelete(service._id)} className="text-rose-500 hover:bg-rose-500 hover:text-white p-3 bg-rose-50 rounded-2xl transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Title Section */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-indigo-400 shadow-lg">
                                <Settings size={20} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{service.title}</h3>
                        </div>

                        {/* IMAGE SECTION (Add ho gaya) */}
                        {service.imageUrl && (
                            <div className="w-full mb-6 overflow-hidden rounded-[2rem] border border-slate-100 shadow-inner">
                                <img 
                                    src={service.imageUrl} 
                                    alt={service.title} 
                                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Service+Image'; }}
                                />
                            </div>
                        )}

                        {/* Description Section */}
                        <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed italic flex-grow">{service.description}</p>
                        
                        {/* Cost Section */}
                        <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-50">
                            <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Costing</p>
                                <span className="text-3xl font-black text-indigo-600 tracking-tighter">{service.price}</span>
                            </div>
                            <div className="px-4 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">
                                Live
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-3 text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 italic text-slate-300 font-black uppercase tracking-widest">
                        Database Empty: No Live Services
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageServices;