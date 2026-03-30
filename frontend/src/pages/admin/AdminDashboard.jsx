import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Settings, Bell, ChevronLeft,
  FileText, AlertTriangle, CheckCircle2, Loader2,
  X, UserCheck
} from "lucide-react";

// ─── MOCK API (replace with real fetch calls) ───────────────────────────────
const fetchStats = () =>
  new Promise(resolve =>
    setTimeout(() => resolve({ totalUsers: 120, activeResearch: 15 }), 900)
  );

const fetchPendingResearchers = () =>
  new Promise(resolve =>
    setTimeout(() => resolve([
      { id: 1, name: "Dr. Kavita Iyer",  topic: "Soil Alkalinity Analysis",  date: "17 Jan 2026" },
      { id: 2, name: "Rajesh Kumar",      topic: "Pest Control Mechanisms",   date: "16 Jan 2026" },
      { id: 3, name: "Dr. Alan Grant",    topic: "Hybrid Wheat Yield Study",  date: "15 Jan 2026" },
    ]), 700)
  );

const fetchVerifiedUsers = async () => {
  const res = await fetch("http://localhost:8000/api/users/");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Sora', sans-serif; }

:root {
  --forest:   #0f5132;
  --forest-mid: #166534;
  --forest-light: #22c55e;
  --leaf:     #4ade80;
  --cream:    #f7f9f4;
  --white:    #ffffff;
  --border:   #e4ede8;
  --text:     #0d1f14;
  --muted:    #6b7a72;
  --orange:   #ea580c;
  --orange-bg:#fff7ed;
  --orange-border:#fed7aa;
  --red:      #dc2626;
  --red-bg:   #fef2f2;
  --blue:     #0ea5e9;
  --blue-bg:  #f0f9ff;
  --shadow-sm: 0 1px 3px rgba(15,81,50,.08);
  --shadow-md: 0 4px 12px rgba(15,81,50,.10);
  --radius:   14px;
  --radius-sm:8px;
}

.layout { display:flex; min-height:100vh; background:var(--cream); }

/* ── Sidebar ── */
.sidebar {
  width:260px; flex-shrink:0;
  background:var(--forest);
  display:flex; flex-direction:column;
  padding:28px 20px; gap:0;
  position:sticky; top:0; height:100vh;
}
.sidebar-brand { display:flex; align-items:center; gap:12px; padding:0 8px 36px; }
.sidebar-brand .logo { font-size:28px; }
.sidebar-brand h2 { font-size:18px; font-weight:800; color:#fff; letter-spacing:-.3px; }
.sidebar-brand span { font-size:11px; color:#86efac; font-family:'DM Mono',monospace; display:block; margin-top:1px; }

.nav-group { flex:1; display:flex; flex-direction:column; gap:4px; }
.nav-item {
  display:flex; align-items:center; gap:12px;
  padding:11px 14px; border-radius:10px; cursor:pointer;
  color:#a7f3d0; font-size:14px; font-weight:500; transition:all .18s;
  border-left:3px solid transparent;
}
.nav-item:hover { background:rgba(255,255,255,.08); color:#fff; }
.nav-item.active { background:rgba(255,255,255,.13); color:#fff; font-weight:700; border-left-color:var(--leaf); }

.sidebar-footer { border-top:1px solid rgba(255,255,255,.1); padding-top:20px; display:flex; flex-direction:column; gap:6px; }
.user-chip {
  display:flex; align-items:center; gap:10px;
  padding:10px 12px; border-radius:10px; margin-top:6px;
  background:rgba(255,255,255,.07);
}
.avatar { width:34px; height:34px; border-radius:50%; background:var(--leaf); color:var(--forest); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; flex-shrink:0; }
.user-chip .info h4 { font-size:13px; color:#fff; font-weight:600; }
.user-chip .info p  { font-size:11px; color:#86efac; margin-top:1px; font-family:'DM Mono',monospace; }

/* ── Main ── */
.main { flex:1; padding:36px 40px; overflow-y:auto; max-width:1200px; }
.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:36px; }
.page-header h1 { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-.6px; }
.page-header p  { font-size:14px; color:var(--muted); margin-top:4px; }
.date-badge { background:#fff; border:1px solid var(--border); padding:8px 16px; border-radius:30px; font-size:13px; color:var(--muted); font-family:'DM Mono',monospace; box-shadow:var(--shadow-sm); white-space:nowrap; }

/* ── Stat Cards ── */
.stats-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
.stat-card {
  background:var(--white); border-radius:var(--radius); padding:24px 26px;
  border:1px solid var(--border); box-shadow:var(--shadow-sm);
  display:flex; justify-content:space-between; align-items:center;
}
.stat-card .label { font-size:12px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:8px; }
.stat-card .val   { font-size:38px; font-weight:800; color:var(--text); letter-spacing:-1.5px; line-height:1; }
.stat-card .sub   { font-size:13px; margin-top:8px; font-weight:600; }
.sub.green  { color:var(--forest-mid); }
.sub.blue   { color:var(--blue); }
.icon-box   { width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.icon-box.green  { background:#dcfce7; color:var(--forest-mid); }
.icon-box.blue   { background:var(--blue-bg); color:var(--blue); }

/* ── Loading spinner ── */
.loading { display:flex; align-items:center; gap:8px; font-size:14px; color:var(--muted); }
@keyframes spin { to { transform:rotate(360deg); } }
.spin { animation:spin 1s linear infinite; }

/* ── Section header ── */
.section-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.section-head h3 { font-size:17px; font-weight:700; color:var(--text); }

/* ── Card ── */
.card { background:var(--white); border-radius:var(--radius); padding:26px; border:1px solid var(--border); box-shadow:var(--shadow-sm); margin-bottom:24px; }
.card.orange-left { border-left:4px solid #ca8a04; }

/* ── Badge ── */
.badge { display:inline-flex; align-items:center; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; }
.badge.orange  { background:#fef9c3; color:#854d0e; }
.badge.green   { background:#dcfce7; color:var(--forest-mid); }
.badge.sky     { background:#e0f2fe; color:#0369a1; }

/* ── Tables ── */
table { width:100%; border-collapse:collapse; font-size:14px; }
thead tr { border-bottom:2px solid #f1f5f9; }
th { padding:10px 12px; text-align:left; font-size:12px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; }
tbody tr { border-bottom:1px solid #f8fafc; transition:background .15s; }
tbody tr:hover { background:#fafdf8; }
td { padding:12px 12px; color:#374151; }
td.dim { color:var(--muted); font-family:'DM Mono',monospace; font-size:13px; }
td.bold { font-weight:600; color:var(--text); }

/* ── Action buttons ── */
.act-btn { border:1px solid var(--border); background:var(--white); padding:6px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all .15s; }
.act-btn:hover { background:#f1f5f9; }
.act-btn.danger { border-color:#fca5a5; background:var(--red-bg); }
.act-btn.danger:hover { background:#fee2e2; }
.btn-validate { border:none; background:var(--forest-mid); color:#fff; padding:6px 14px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:5px; transition:background .15s; }
.btn-validate:hover { background:var(--forest); }
.btn-green { background:var(--forest-mid); color:#fff; border:none; padding:11px 22px; border-radius:10px; font-weight:700; cursor:pointer; font-size:14px; font-family:'Sora',sans-serif; transition:background .15s; display:inline-flex; align-items:center; gap:7px; }
.btn-green:hover { background:var(--forest); }

/* ── Settings ── */
.settings-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:24px; }
.form-field { margin-bottom:14px; }
.form-field label { display:block; font-size:12px; font-weight:700; color:var(--text); margin-bottom:5px; text-transform:uppercase; letter-spacing:.4px; }
.form-field input, .form-field select { width:100%; padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:14px; font-family:'Sora',sans-serif; outline:none; transition:border .15s; background:var(--white); color:var(--text); }
.form-field input:focus, .form-field select:focus { border-color:var(--forest-light); }
.toggle-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f3f4f6; }
.toggle-row:last-child { border:none; }
.toggle-row .lbl h4 { font-size:14px; font-weight:500; color:var(--text); }
.toggle-row .lbl p  { font-size:12px; color:var(--muted); margin-top:2px; }
.danger-zone { border:1px solid #fecaca !important; background:var(--red-bg) !important; }
`;

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");

  // Settings state
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@agrismart.com", phone: "+91 98765 43210" });
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true });

  // Dashboard data
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState(null);
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
    fetchPendingResearchers().then(setPending);
    fetchVerifiedUsers()
      .then(data => {
        setVerified(data);
        setStats(prev => ({ ...prev, totalUsers: data.length }));
      })
      .catch(() => setVerified([]));
  }, []);

  const handleValidate = (id) => {
    if (!pending) return;
    const item = pending.find(r => r.id === id);
    setPending(pending.filter(r => r.id !== id));
    if (item) setVerified(prev => [...prev, { id: item.id * 100, name: item.name, role: "Researcher", email: "—", status: "Verified" }]);
  };

  const handleReject = (id) => setPending(pending.filter(r => r.id !== id));

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="logo">🍃</span>
            <div>
              <h2>AgriSmart</h2>
              <span>Admin Dashboard</span>
            </div>
          </div>

          <nav className="nav-group">
            {navItems.map(({ key, label, icon: Icon }) => (
              <div key={key} className={`nav-item ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                <Icon size={18} /> <span>{label}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="nav-item"><Bell size={18} /> <span>Notifications</span></div>
            <div className={`nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}><Settings size={18} /> <span>Settings</span></div>
            <div className="user-chip">
              <div className="avatar">AS</div>
              <div className="info"><h4>Admin User</h4><p>admin@agrismart.com</p></div>
              <ChevronLeft size={14} style={{ color: '#86efac', marginLeft: 'auto' }} />
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">

          {/* ══════════════ DASHBOARD TAB ══════════════ */}
          {tab === 'dashboard' && (
            <>
              <div className="page-header">
                <div>
                  <h1>Overview</h1>
                  <p>Welcome back, Admin</p>
                </div>
                <div className="date-badge">📅 Today: 23 Mar 2026</div>
              </div>

              {/* Stats */}
              <div className="stats-row">
                <div className="stat-card">
                  <div>
                    <div className="label">Total Users</div>
                    {stats
                      ? <div className="val">{stats.totalUsers}</div>
                      : <div className="loading"><Loader2 size={20} className="spin" /> Loading…</div>}
                    <div className="sub green">+12 New this month</div>
                  </div>
                  <div className="icon-box green"><Users size={24} /></div>
                </div>
                <div className="stat-card">
                  <div>
                    <div className="label">Active Research</div>
                    {stats
                      ? <div className="val">{stats.activeResearch}</div>
                      : <div className="loading"><Loader2 size={20} className="spin" /> Loading…</div>}
                    <div className="sub blue">Ongoing projects</div>
                  </div>
                  <div className="icon-box blue"><FileText size={24} /></div>
                </div>
              </div>

              {/* ── Pending Approvals ── */}
              <div className="card orange-left">
                <div className="section-head">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#854d0e' }}>
                    <AlertTriangle size={18} /> Pending Researcher Approvals
                  </h3>
                  <span className="badge orange">
                    {pending === null ? '…' : pending.length} Requests
                  </span>
                </div>
                {pending === null
                  ? <div className="loading" style={{ padding: '20px 0' }}><Loader2 size={18} className="spin" /> Loading requests…</div>
                  : pending.length === 0
                    ? <p style={{ color: 'var(--muted)', fontSize: 14, padding: '16px 0' }}>✅ All requests have been processed.</p>
                    : <table>
                        <thead>
                          <tr>
                            <th>Researcher Name</th>
                            <th>Research Topic</th>
                            <th>Submission Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pending.map(r => (
                            <tr key={r.id}>
                              <td className="bold">{r.name}</td>
                              <td>{r.topic}</td>
                              <td className="dim">{r.date}</td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                  <button className="act-btn"><FileText size={15} color="#4b5563" /></button>
                                  <button className="act-btn danger" onClick={() => handleReject(r.id)}><X size={15} color="#dc2626" /></button>
                                  <button className="btn-validate" onClick={() => handleValidate(r.id)}><UserCheck size={15} /> Validate</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                }
              </div>

              {/* ── Verified Users ── */}
              <div className="card">
                <div className="section-head">
                  <h3>Verified Researchers &amp; Users</h3>
                  <span className="badge green">{verified ? verified.length : '…'} Total</span>
                </div>
                {verified === null
                  ? <div className="loading"><Loader2 size={18} className="spin" /> Loading users…</div>
                  : <table>
                      <thead>
                        <tr>
                          <th>ID</th><th>Name</th><th>Role</th><th>Email / Contact</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verified.map(u => (
                          <tr key={u.id}>
                            <td className="dim">#{u.id}</td>
                            <td className="bold">{u.name}</td>
                            <td>
                              <span className={`badge ${u.role === 'admin' ? 'orange' : 'sky'}`}>
                                {u.role === 'admin' ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="dim">{u.email}</td>
                            <td>
                              <span className={`badge ${u.status === 'Active' ? 'green' : 'sky'}`}>{u.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </>
          )}

          {/* ══════════════ SETTINGS TAB ══════════════ */}
          {tab === 'settings' && (
            <>
              <div className="page-header">
                <div>
                  <h1>System Settings</h1>
                  <p>Manage your profile, security, and preferences</p>
                </div>
                <button className="btn-green" onClick={() => alert('Settings saved ✅')}>
                  <CheckCircle2 size={16} /> Save Changes
                </button>
              </div>

              <div className="settings-grid">
                {/* Left */}
                <div>
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' }}>
                      <div className="avatar" style={{ width: 46, height: 46, fontSize: 18 }}>{profile.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>Profile Information</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Update your personal details</div>
                      </div>
                    </div>
                    {[['Full Name', 'text', 'name'], ['Email Address', 'email', 'email'], ['Phone Number', 'text', 'phone']].map(([label, type, key]) => (
                      <div className="form-field" key={key}>
                        <label>{label}</label>
                        <input type={type} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} />
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Security</h3>
                    {[['Current Password', '••••••••'], ['New Password', 'New password']].map(([label, ph]) => (
                      <div className="form-field" key={label}>
                        <label>{label}</label>
                        <input type="password" placeholder={ph} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div>
                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Notifications</h3>
                    {[
                      { key: 'email', label: 'Email Alerts', sub: 'Get updates via email' },
                      { key: 'push',  label: 'Push Notifications', sub: 'Browser popups' },
                      { key: 'weekly',label: 'Weekly Reports', sub: 'Summary every Monday' },
                    ].map(({ key, label, sub }) => (
                      <div className="toggle-row" key={key}>
                        <div className="lbl"><h4>{label}</h4><p>{sub}</p></div>
                        <input type="checkbox" checked={notifs[key]} onChange={() => setNotifs({ ...notifs, [key]: !notifs[key] })} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--forest-mid)' }} />
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>System Preferences</h3>
                    <div className="form-field">
                      <label>Language</label>
                      <select>
                        <option>English (US)</option>
                        <option>Hindi (हिंदी)</option>
                        <option>Punjabi (ਪੰਜਾਬੀ)</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Time Zone</label>
                      <select>
                        <option>(GMT+05:30) Kolkata, Mumbai, New Delhi</option>
                        <option>(GMT+00:00) UTC</option>
                      </select>
                    </div>
                  </div>

                  <div className="card danger-zone">
                    <h3 style={{ color: 'var(--red)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Danger Zone</h3>
                    <p style={{ fontSize: 12, color: '#7f1d1d', marginBottom: 14 }}>Actions here cannot be undone.</p>
                    <button style={{ width: '100%', padding: '11px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}