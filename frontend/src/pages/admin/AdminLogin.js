import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, X } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Forgot Password States
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(res.data.admin));
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setResetLoading(true);
        try {
            // Backend API for Reset Password
            const res = await axios.post('http://localhost:5000/api/admin/reset-password', { 
                email: forgotEmail, 
                newPassword 
            });
            if (res.data.success) {
                alert("Password updated successfully!");
                setIsForgotOpen(false);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden relative">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex w-[55%] bg-[#0F172A] p-16 flex-col justify-between relative text-white">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#6366F1] rounded-full blur-[150px] opacity-10"></div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-[#6366F1] p-2 rounded-xl">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-[0.2em] uppercase italic">AMC PRO</span>
                </div>
                <div className="relative z-10 space-y-8">
                    <h1 className="text-7xl font-black leading-[1.05] tracking-tighter">
                        Smart. <br /> Precise. <br /> <span className="text-[#6366F1]">Simplified.</span>
                    </h1>
                </div>
                <div className="relative z-10 text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase">
                    ©️ 2026 Enterprise Asset Systems
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-[#F8FAFC]">
                <div className="w-full max-w-sm space-y-10">
                    <div className="text-left space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Portal</h2>
                        <p className="text-slate-500 font-medium tracking-wide">Secure authorization required.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Business Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6366F1]" size={20} />
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-[#6366F1] transition-all font-semibold"
                                    placeholder="admin@amcpro.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Security Key</label>
                                <button 
                                    type="button" 
                                    onClick={() => setIsForgotOpen(true)}
                                    className="text-[10px] font-black text-[#6366F1] uppercase tracking-widest hover:underline"
                                >
                                    Forgot Key?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6366F1]" size={20} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-[#6366F1] transition-all font-semibold"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#6366F1] text-white font-black py-5 rounded-2xl hover:bg-[#4F46E5] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Secure Login"} <ArrowRight size={18} />
                        </button>
                    </form>
                    
                    <div className="text-center pt-8 border-t border-slate-100">
                        <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase italic">Authorized Personnel Only</p>
                    </div>
                </div>
            </div>

            {/* FORGOT PASSWORD MODAL (POPUP) */}
            {isForgotOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button 
                            onClick={() => setIsForgotOpen(false)} 
                            className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            <div className="text-left space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">Reset Security Key</h3>
                                <p className="text-slate-500 text-sm font-medium">Update your administrative credentials.</p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Admin Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#6366F1] transition-all font-semibold"
                                        placeholder="Enter registered email"
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Security Key</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#6366F1] transition-all font-semibold"
                                        placeholder="••••••••"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm New Key</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#6366F1] transition-all font-semibold"
                                        placeholder="••••••••"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={resetLoading}
                                    className="w-full mt-4 bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-lg uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
                                >
                                    {resetLoading ? "Updating..." : "Update Credentials"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogin;