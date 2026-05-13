import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Shield, ArrowRight, Wrench, CheckCircle2, X, KeyRound, Eye, EyeOff } from 'lucide-react';

const TechnicianLogin = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    // 👁️ Eye toggle states
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/technicians/login', { email });
            if (res.data) {
                localStorage.setItem('techInfo', JSON.stringify(res.data));
                navigate('/technician/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed! Email not found.");
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
            const res = await axios.post('http://localhost:5000/api/technicians/reset-password', {
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
        <div style={S.page}>

            {/* ✅ Forgot Password Modal */}
            {isForgotOpen && (
                <div style={S.modalOverlay}>
                    <div style={S.modalCard}>
                        <button onClick={() => setIsForgotOpen(false)} style={S.modalClose}>
                            <X size={20} />
                        </button>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={S.iconBox}><KeyRound size={20} color="#2563EB" /></div>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                                Reset Password
                            </h3>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                Enter your registered email to reset your security key
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} style={S.form}>
                            <div style={S.fieldWrap}>
                                <label style={S.label}>Registered Email</label>
                                <div style={S.inputBox}>
                                    <Mail size={16} color="#94A3B8" />
                                    <input
                                        type="email"
                                        placeholder="yourname@gmail.com"
                                        style={S.input}
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={S.fieldWrap}>
                                <label style={S.label}>New Password</label>
                                <div style={S.inputBox}>
                                    <Shield size={16} color="#94A3B8" />
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="New security key"
                                        style={S.input}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={S.eyeBtn}>
                                        {showNewPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                                    </button>
                                </div>
                            </div>

                            <div style={S.fieldWrap}>
                                <label style={S.label}>Confirm Password</label>
                                <div style={S.inputBox}>
                                    <Shield size={16} color="#94A3B8" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm security key"
                                        style={S.input}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={S.eyeBtn}>
                                        {showConfirmPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={resetLoading}
                                style={{
                                    ...S.btn,
                                    marginTop: '8px',
                                    opacity: resetLoading ? 0.8 : 1,
                                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {resetLoading ? (
                                    <><div style={S.btnSpinner} /> Updating...</>
                                ) : (
                                    <>Reset Password <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Left Panel */}
            <div style={S.leftPanel}>
                <div style={S.brandBox}>
                    <div style={S.brandIcon}><Wrench size={28} color="#2563EB" /></div>
                    <h1 style={S.brandTitle}>AMC Pro</h1>
                    <p style={S.brandSub}>Field Technician Management System</p>
                </div>
                <div style={S.featureList}>
                    {[
                        'View assigned service tasks',
                        'Mark jobs as completed',
                        'Real-time task updates',
                        'Customer contact details',
                    ].map((f, i) => (
                        <div key={i} style={S.featureItem}>
                            <CheckCircle2 size={16} color="#2563EB" />
                            <span style={S.featureTxt}>{f}</span>
                        </div>
                    ))}
                </div>
                <p style={S.leftFooter}>©️ 2026 AMC Pro. All rights reserved.</p>
            </div>

            {/* Right Panel */}
            <div style={S.rightPanel}>
                <div style={S.card}>
                    <div style={S.cardTop}>
                        <div style={S.iconBox}><Wrench size={20} color="#2563EB" /></div>
                        <p style={S.eyebrow}>TECHNICIAN PORTAL</p>
                        <h2 style={S.title}>Welcome Back</h2>
                        <p style={S.sub}>Sign in to access your assigned tasks and service requests</p>
                    </div>

                    <form onSubmit={handleLogin} style={S.form}>
                        <div style={S.fieldWrap}>
                            <label style={S.label}>Email Address</label>
                            <div style={S.inputBox}>
                                <Mail size={16} color="#94A3B8" />
                                <input
                                    type="email"
                                    placeholder="yourname@gmail.com"
                                    style={S.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div style={S.fieldWrap}>
                            <label style={S.label}>Password</label>
                            <div style={S.inputBox}>
                                <Shield size={16} color="#94A3B8" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Your Security Key"
                                    style={S.input}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={S.eyeBtn}>
                                    {showPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                                </button>
                            </div>
                        </div>

                        {/* ✅ Forgot Password Link */}
                        <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                            <button
                                type="button"
                                onClick={() => setIsForgotOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2563EB',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    padding: 0,
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            ...S.btn,
                            opacity: loading ? 0.8 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}>
                            {loading ? (
                                <><div style={S.btnSpinner} /> Signing in...</>
                            ) : (
                                <>Sign In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <div style={S.divider} />
                    <p style={S.helpTxt}>Having trouble? Contact your administrator</p>
                </div>
            </div>
        </div>
    );
};

const S = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: '#F8FAFC',
    },
    leftPanel: {
        width: '420px',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
        padding: '60px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
    },
    brandBox: { marginBottom: '48px' },
    brandIcon: {
        width: '56px', height: '56px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
    },
    brandTitle: {
        fontSize: '32px', fontWeight: 900, color: '#FFFFFF',
        margin: '0 0 8px', letterSpacing: '-0.02em',
    },
    brandSub: { fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 },
    featureList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
    featureTxt: { fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 },
    leftFooter: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '48px' },
    rightPanel: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
    },
    card: {
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1px solid #E2E8F0',
    },
    cardTop: { marginBottom: '32px' },
    iconBox: {
        width: '44px', height: '44px',
        background: '#EFF6FF',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
        border: '1px solid #BFDBFE',
    },
    eyebrow: {
        fontSize: '10px', fontWeight: 700, color: '#2563EB',
        letterSpacing: '0.2em', margin: '0 0 8px',
    },
    title: {
        fontSize: '26px', fontWeight: 800, color: '#0F172A',
        margin: '0 0 8px', letterSpacing: '-0.02em',
    },
    sub: { fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.6 },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    fieldWrap: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: {
        fontSize: '11px', fontWeight: 700, color: '#374151',
        textTransform: 'uppercase', letterSpacing: '0.1em',
    },
    inputBox: {
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px', padding: '13px 16px',
    },
    input: {
        background: 'none', border: 'none', color: '#0F172A',
        outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit',
    },
    eyeBtn: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    btn: {
        marginTop: '8px',
        background: '#2563EB', color: 'white',
        border: 'none', borderRadius: '12px', padding: '14px',
        fontSize: '14px', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        letterSpacing: '0.01em',
        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
    },
    btnSpinner: {
        width: '16px', height: '16px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
    },
    divider: { height: '1px', background: '#F1F5F9', margin: '28px 0 20px' },
    helpTxt: { fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: 0 },
    modalOverlay: {
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
    },
    modalCard: {
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid #E2E8F0',
        position: 'relative',
    },
    modalClose: {
        position: 'absolute', top: '20px', right: '20px',
        background: '#F8FAFC', border: '1px solid #E2E8F0',
        borderRadius: '10px', padding: '6px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#64748B',
    },
};

export default TechnicianLogin;