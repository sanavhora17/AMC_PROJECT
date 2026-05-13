import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    // 👁️ Eye toggle states
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            if (response.data.user) {
                localStorage.setItem('userId', response.data.user._id);
                alert(`Welcome back, ${response.data.user.name}! 👋`);
                navigate('/customer/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Email or Password!");
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
            const res = await axios.post('http://localhost:5000/api/users/reset-password', {
                email: forgotEmail,
                newPassword
            });
            if (res.data.success) {
                alert("Password updated successfully! Now you can login.");
                setIsForgotOpen(false);
                setForgotEmail('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reset password");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative">
            <div className="bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex bg-indigo-50 p-4 rounded-2xl text-indigo-600 mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
                    <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Login to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border-2 border-transparent focus:border-indigo-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border-2 border-transparent focus:border-indigo-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex justify-end px-1">
                        <button
                            type="button"
                            onClick={() => setIsForgotOpen(true)}
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-[#6366F1] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        Log In <ArrowRight size={20}/>
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Don't have an account? <Link to="/register" className="text-[#6366F1] hover:underline">Register Now</Link>
                </p>
            </div>

            {isForgotOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
                        <button
                            onClick={() => setIsForgotOpen(false)}
                            className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full"
                        >
                            <X size={20} />
                        </button>
                        <div className="space-y-6">
                            <div className="text-left space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase">Reset Password</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Set a new security key for your account</p>
                            </div>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#6366F1] transition-all font-bold text-sm"
                                        placeholder="email@example.com"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            className="w-full px-6 py-4 pr-12 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#6366F1] transition-all font-bold text-sm"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            className="w-full px-6 py-4 pr-12 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#6366F1] transition-all font-bold text-sm"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="w-full mt-4 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-lg uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
                                >
                                    {resetLoading ? "Updating..." : "Reset Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerLogin;