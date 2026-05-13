import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ph: '',
        password: '',
        address: ''
    });

    // 👁️ Eye toggle state
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', formData);
            if (response.status === 201) {
                alert("Registration Successful! Now you can Login.");
                navigate('/login');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed. Email might already exist.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[1000px] flex rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px]">
                {/* LEFT SIDE */}
                <div className="hidden lg:flex w-1/2 bg-[#6366F1] p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <ShieldCheck size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase">AMC PRO</span>
                        </div>
                        <h2 className="text-5xl font-black leading-tight mb-4">Start Your <br/> Journey With Us.</h2>
                        <p className="text-indigo-100 font-medium text-lg opacity-80">Professional maintenance services at your fingertips. Register once, enjoy forever.</p>
                    </div>
                    <div className="text-sm font-bold opacity-50 uppercase tracking-widest">©️ 2026 AMC PRO SERVICES</div>
                </div>

                {/* RIGHT SIDE: FORM */}
                <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-slate-900">Create Account</h3>
                        <p className="text-slate-400 font-bold text-sm mt-2">Fill in your details to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputBox icon={<User size={18}/>} type="text" placeholder="Full Name"
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />

                            <InputBox icon={<Mail size={18}/>} type="email" placeholder="Email"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputBox icon={<Phone size={18}/>} type="tel" placeholder="Phone Number"
                                value={formData.ph} onChange={(e) => setFormData({...formData, ph: e.target.value})} />

                            {/* 👁️ Password field with Eye toggle */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-500 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                            <textarea
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-500 transition-all min-h-[100px]"
                                placeholder="Complete Delivery Address"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#6366F1] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                            Register Now <ArrowRight size={20}/>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Already have an account? <Link to="/login" className="text-[#6366F1] hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const InputBox = ({ icon, ...props }) => (
    <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input
            {...props}
            required
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-indigo-500 transition-all"
        />
    </div>
);

export default CustomerRegister;