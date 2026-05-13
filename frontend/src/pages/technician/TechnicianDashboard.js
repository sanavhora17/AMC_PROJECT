import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    MapPin, Phone, CheckCircle2, LogOut,
    Wrench, Clock, AlertCircle, User,
    RefreshCw, Bell, X, Calendar, ChevronRight
} from 'lucide-react';

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const tech = JSON.parse(localStorage.getItem('techInfo'));

    useEffect(() => {
        if (tech) fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/technicians/tasks/${tech._id}`);
            const data = Array.isArray(res.data) ? res.data : [];
            setTasks(data);
            generateNotifications(data);
        } catch (err) {
            console.error('Tasks fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateNotifications = (taskList) => {
        const notifs = [];
        taskList.forEach(t => {
            if (t.status !== 'Completed') {
                notifs.push({
                    id: t._id,
                    title: 'New Task Assigned',
                    message: `${t.appliance || 'Service task'} at ${t.address || 'location'}`,
                    time: 'Just now',
                    type: 'task',
                    read: false,
                });
            }
        });
        notifs.push({
            id: 'sys1',
            title: 'Reminder',
            message: 'Complete all pending tasks before end of day',
            time: '9:00 AM',
            type: 'reminder',
            read: false,
        });
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const removeNotif = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // ✅ FIXED — proper error handling + correct status value
    const markComplete = async (id) => {
        setCompleting(id);
        try {
            await axios.patch(
                `http://localhost:5000/api/technicians/tasks/update-status/${id}`,
                { status: 'Completed' } // ✅ Enum match: 'Completed'
            );
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
            await fetchTasks();
        } catch (err) {
            console.error('Update error:', err.response?.data || err.message);
            alert('Status update failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setCompleting(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/technician/login';
    };

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (loading) return (
        <div style={S.loadWrap}>
            <style>{anim}</style>
            <div style={S.loadRing} />
            <p style={S.loadTxt}>Loading your tasks...</p>
        </div>
    );

    return (
        <div style={S.page}>
            <style>{anim}</style>

            {/* ── HEADER ── */}
            <header style={S.header}>
                <div style={S.headerLeft}>
                    <div style={S.avatarBox}>
                        <Wrench size={20} color="#2563EB" />
                    </div>
                    <div>
                        <p style={S.eyebrow}>AMC PRO · FIELD PORTAL</p>
                        <h1 style={S.headerTitle}>{tech?.name || 'Technician'}</h1>
                        <p style={S.headerSub}>{tech?.specialization || tech?.email || ''}</p>
                    </div>
                </div>

                <div style={S.headerRight}>
                    {/* Notification Bell */}
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowNotif(!showNotif)} style={S.bellBtn}>
                            <Bell size={18} color="#374151" />
                            {unreadCount > 0 && (
                                <span style={S.badge}>{unreadCount}</span>
                            )}
                        </button>

                        {showNotif && (
                            <div style={S.notifPanel}>
                                <div style={S.notifHeader}>
                                    <span style={S.notifTitle}>Notifications</span>
                                    <button onClick={markAllRead} style={S.markReadBtn}>Mark all read</button>
                                </div>
                                <div style={S.notifList}>
                                    {notifications.length === 0 ? (
                                        <div style={S.notifEmpty}>
                                            <Bell size={24} color="#CBD5E1" />
                                            <p style={{ color: '#94A3B8', fontSize: '13px', margin: '8px 0 0' }}>No notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} style={{
                                                ...S.notifItem,
                                                background: n.read ? '#FFFFFF' : '#F0F7FF',
                                                borderLeft: n.read ? '3px solid transparent' : '3px solid #2563EB',
                                            }}>
                                                <div style={S.notifIcon}>
                                                    {n.type === 'task'
                                                        ? <Wrench size={14} color="#2563EB" />
                                                        : <Clock size={14} color="#F59E0B" />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={S.notifItemTitle}>{n.title}</p>
                                                    <p style={S.notifItemMsg}>{n.message}</p>
                                                    <p style={S.notifTime}>{n.time}</p>
                                                </div>
                                                <button onClick={() => removeNotif(n.id)} style={S.notifClose}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div style={S.notifFooter}>
                                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={fetchTasks} style={S.refreshBtn}>
                        <RefreshCw size={15} color="#374151" />
                    </button>
                    <button onClick={handleLogout} style={S.logoutBtn}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </header>

            {/* ── STATS ── */}
            <div style={S.statsRow}>
                {[
                    { label: 'Total Tasks', value: total, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                    { label: 'Completed', value: completed, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
                    { label: 'Pending', value: pending, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                    { label: 'Completion Rate', value: `${rate}%`, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
                ].map(({ label, value, color, bg, border }) => (
                    <div key={label} style={{ ...S.statBox, background: bg, borderColor: border }}>
                        <p style={S.statLbl}>{label}</p>
                        <p style={{ ...S.statVal, color }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* ── SECTION HEADER ── */}
            <div style={S.sectionHd}>
                <div>
                    <h2 style={S.sectionTitle}>Assigned Tasks</h2>
                    <p style={S.sectionSub}>Your current service requests and jobs</p>
                </div>
                {pending > 0 && (
                    <div style={S.pendingPill}>
                        <Clock size={12} />
                        {pending} task{pending !== 1 ? 's' : ''} pending
                    </div>
                )}
            </div>

            {/* ── TASK CARDS ── */}
            {tasks.length === 0 ? (
                <div style={S.emptyBox}>
                    <div style={S.emptyIcon}><AlertCircle size={28} color="#94A3B8" /></div>
                    <p style={S.emptyTxt}>No tasks assigned</p>
                    <p style={S.emptySub}>Check back later or contact your administrator</p>
                </div>
            ) : (
                <div style={S.grid}>
                    {tasks.map(t => {
                        const isDone = t.status === 'Completed';
                        return (
                            <div key={t._id} style={{
                                ...S.card,
                                borderTop: `3px solid ${isDone ? '#22C55E' : '#2563EB'}`,
                            }}>
                                <div style={S.cardTop}>
                                    <div style={{
                                        ...S.statusBadge,
                                        background: isDone ? '#F0FDF4' : '#FFF7ED',
                                        color: isDone ? '#16A34A' : '#D97706',
                                        border: `1px solid ${isDone ? '#BBF7D0' : '#FDE68A'}`,
                                    }}>
                                        {isDone
                                            ? <><CheckCircle2 size={11} /> Completed</>
                                            : <><Clock size={11} /> Pending</>}
                                    </div>
                                </div>

                                <h3 style={S.cardTitle}>{t.appliance || 'Service Task'}</h3>

                                <div style={S.infoBlock}>
                                    {t.customerName && (
                                        <div style={S.infoRow}>
                                            <div style={S.infoIconBox}><User size={13} color="#2563EB" /></div>
                                            <span style={S.infoTxt}>{t.customerName}</span>
                                        </div>
                                    )}
                                    <div style={S.infoRow}>
                                        <div style={S.infoIconBox}><MapPin size={13} color="#2563EB" /></div>
                                        <span style={S.infoTxt}>{t.address || 'No address provided'}</span>
                                    </div>
                                    <div style={S.infoRow}>
                                        <div style={S.infoIconBox}><Phone size={13} color="#2563EB" /></div>
                                        <span style={S.infoTxt}>{t.customerPhone || 'No contact'}</span>
                                    </div>
                                    {t.scheduledDate && (
                                        <div style={S.infoRow}>
                                            <div style={S.infoIconBox}><Calendar size={13} color="#2563EB" /></div>
                                            <span style={S.infoTxt}>
                                                {new Date(t.scheduledDate).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {t.notes && (
                                    <div style={S.notesBox}>
                                        <p style={S.notesLabel}>Notes</p>
                                        <p style={S.notesTxt}>{t.notes}</p>
                                    </div>
                                )}

                                <div style={S.cardDivider} />

                                {!isDone ? (
                                    <button
                                        onClick={() => markComplete(t._id)}
                                        disabled={completing === t._id}
                                        style={{ ...S.doneBtn, opacity: completing === t._id ? 0.7 : 1 }}
                                    >
                                        {completing === t._id ? (
                                            <><div style={S.btnSpinner} /> Updating...</>
                                        ) : (
                                            <><CheckCircle2 size={15} /> Mark as Completed <ChevronRight size={15} /></>
                                        )}
                                    </button>
                                ) : (
                                    <div style={S.doneMsg}>
                                        <CheckCircle2 size={15} color="#16A34A" />
                                        <span>Task Successfully Completed</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const S = {
    page: { minHeight: '100vh', background: '#F8FAFC', padding: '0 0 60px', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#0F172A' },
    loadWrap: { minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'system-ui' },
    loadRing: { width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTop: '3px solid #2563EB', borderRadius: '50%', animation: 'spin 0.75s linear infinite' },
    loadTxt: { fontSize: '12px', color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' },
    header: { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
    avatarBox: { width: '44px', height: '44px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    eyebrow: { fontSize: '9px', fontWeight: 700, color: '#2563EB', letterSpacing: '0.2em', margin: '0 0 3px' },
    headerTitle: { fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' },
    headerSub: { fontSize: '12px', color: '#64748B', margin: '2px 0 0' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '10px' },
    bellBtn: { position: 'relative', width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    badge: { position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' },
    notifPanel: { position: 'absolute', top: '48px', right: 0, width: '340px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden' },
    notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #F1F5F9' },
    notifTitle: { fontSize: '13px', fontWeight: 700, color: '#0F172A' },
    markReadBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#2563EB', fontWeight: 600 },
    notifList: { maxHeight: '320px', overflowY: 'auto' },
    notifEmpty: { padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    notifItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 18px', borderBottom: '1px solid #F8FAFC', transition: 'background 0.15s' },
    notifIcon: { width: '30px', height: '30px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    notifItemTitle: { fontSize: '12px', fontWeight: 700, color: '#0F172A', margin: '0 0 3px' },
    notifItemMsg: { fontSize: '11px', color: '#64748B', margin: '0 0 4px', lineHeight: 1.4 },
    notifTime: { fontSize: '10px', color: '#94A3B8', margin: 0 },
    notifClose: { background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    notifFooter: { padding: '12px 18px', borderTop: '1px solid #F1F5F9', textAlign: 'center' },
    refreshBtn: { width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', padding: '28px 40px 0' },
    statBox: { borderRadius: '16px', padding: '22px 24px', border: '1px solid' },
    statLbl: { fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' },
    statVal: { fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' },
    sectionHd: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '32px 40px 16px' },
    sectionTitle: { fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.01em' },
    sectionSub: { fontSize: '13px', color: '#64748B', margin: 0 },
    pendingPill: { display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '99px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', padding: '0 40px' },
    card: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' },
    cardTop: { display: 'flex', justifyContent: 'flex-end' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '99px' },
    cardTitle: { fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' },
    infoBlock: { display: 'flex', flexDirection: 'column', gap: '8px' },
    infoRow: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
    infoIconBox: { width: '26px', height: '26px', borderRadius: '7px', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    infoTxt: { fontSize: '13px', color: '#374151', lineHeight: 1.5, paddingTop: '4px' },
    notesBox: { background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 14px' },
    notesLabel: { fontSize: '9px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' },
    notesTxt: { fontSize: '12px', color: '#92400E', margin: 0, lineHeight: 1.5 },
    cardDivider: { height: '1px', background: '#F1F5F9' },
    doneBtn: { width: '100%', padding: '13px', background: '#2563EB', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)', boxSizing: 'border-box' },
    btnSpinner: { width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.75s linear infinite' },
    doneMsg: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' },
    emptyBox: { margin: '0 40px', padding: '80px 20px', background: '#FFFFFF', border: '1px dashed #E2E8F0', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    emptyIcon: { width: '56px', height: '56px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' },
    emptyTxt: { fontSize: '16px', fontWeight: 700, color: '#374151', margin: 0 },
    emptySub: { fontSize: '13px', color: '#94A3B8', margin: 0 },
};

const anim = `@keyframes spin { to { transform: rotate(360deg); } }`;

export default TechnicianDashboard;