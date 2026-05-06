import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Settings,
  FileText, CheckCircle2, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const res = await fetch("https://agrismart-ai-powered-crop-recommendation.onrender.com/api/users/");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Sora', sans-serif; }
:root {
  --forest: #0f5132; --forest-mid: #166534; --leaf: #4ade80;
  --cream: #f7f9f4; --white: #ffffff; --border: #e4ede8;
  --text: #0d1f14; --muted: #6b7a72; --red: #dc2626; --red-bg: #fef2f2;
  --blue: #0ea5e9; --blue-bg: #f0f9ff;
  --shadow-sm: 0 1px 3px rgba(15,81,50,.08);
  --radius: 14px; --radius-sm: 8px;
}
.layout { display:flex; min-height:100vh; background:var(--cream); }
.sidebar { width:260px; flex-shrink:0; background:var(--forest); display:flex; flex-direction:column; padding:28px 20px; position:sticky; top:0; height:100vh; }
.sidebar-brand { display:flex; align-items:center; gap:12px; padding:0 8px 36px; }
.sidebar-brand .logo { font-size:28px; }
.sidebar-brand h2 { font-size:18px; font-weight:800; color:#fff; }
.sidebar-brand span { font-size:11px; color:#86efac; font-family:'DM Mono',monospace; display:block; margin-top:1px; }
.nav-group { flex:1; display:flex; flex-direction:column; gap:4px; }
.nav-item { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:10px; cursor:pointer; color:#a7f3d0; font-size:14px; font-weight:500; transition:all .18s; border-left:3px solid transparent; }
.nav-item:hover { background:rgba(255,255,255,.08); color:#fff; }
.nav-item.active { background:rgba(255,255,255,.13); color:#fff; font-weight:700; border-left-color:var(--leaf); }
.sidebar-footer { border-top:1px solid rgba(255,255,255,.1); padding-top:20px; display:flex; flex-direction:column; gap:6px; }
.user-chip { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; margin-top:6px; background:rgba(255,255,255,.07); }
.avatar { width:34px; height:34px; border-radius:50%; background:var(--leaf); color:var(--forest); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; flex-shrink:0; }
.user-chip .info h4 { font-size:13px; color:#fff; font-weight:600; }
.user-chip .info p { font-size:11px; color:#86efac; margin-top:1px; font-family:'DM Mono',monospace; }

.logout-btn { display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:10px; cursor:pointer; color:#fca5a5; font-size:14px; font-weight:600; font-family:'Sora',sans-serif; background:rgba(220,38,38,.15); border:1px solid rgba(220,38,38,.25); transition:all .2s; width:100%; text-align:left; }
.logout-btn:hover { background:rgba(220,38,38,.3); color:#fff; }

.main { flex:1; padding:36px 40px; overflow-y:auto; max-width:1200px; }
.page-header { margin-bottom:36px; }
.page-header h1 { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-.6px; }
.page-header p { font-size:14px; color:var(--muted); margin-top:4px; }
.stats-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
.stat-card { background:var(--white); border-radius:var(--radius); padding:24px 26px; border:1px solid var(--border); box-shadow:var(--shadow-sm); display:flex; justify-content:space-between; align-items:center; }
.stat-card .label { font-size:12px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:8px; }
.stat-card .val { font-size:38px; font-weight:800; color:var(--text); letter-spacing:-1.5px; line-height:1; }
.stat-card .sub { font-size:13px; margin-top:8px; font-weight:600; }
.sub.green { color:var(--forest-mid); } .sub.blue { color:var(--blue); }
.icon-box { width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.icon-box.green { background:#dcfce7; color:var(--forest-mid); }
.icon-box.blue { background:var(--blue-bg); color:var(--blue); }
.loading { display:flex; align-items:center; gap:8px; font-size:14px; color:var(--muted); padding:20px 0; }
@keyframes spin { to { transform:rotate(360deg); } }
.spin { animation:spin 1s linear infinite; }
.section-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.section-head h3 { font-size:17px; font-weight:700; color:var(--text); }
.card { background:var(--white); border-radius:var(--radius); padding:26px; border:1px solid var(--border); box-shadow:var(--shadow-sm); margin-bottom:24px; }
.badge { display:inline-flex; align-items:center; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; }
.badge.green { background:#dcfce7; color:var(--forest-mid); }
.badge.sky { background:#e0f2fe; color:#0369a1; }
.badge.orange { background:#fef9c3; color:#854d0e; }
table { width:100%; border-collapse:collapse; font-size:14px; }
thead tr { border-bottom:2px solid #f1f5f9; }
th { padding:10px 12px; text-align:left; font-size:12px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; }
tbody tr { border-bottom:1px solid #f8fafc; transition:background .15s; }
tbody tr:hover { background:#fafdf8; }
td { padding:12px 12px; color:#374151; }
td.dim { color:var(--muted); font-family:'DM Mono',monospace; font-size:13px; }
td.bold { font-weight:600; color:var(--text); }
.link-btn { color:var(--forest-mid); font-weight:600; font-size:13px; text-decoration:none; }
.link-btn:hover { text-decoration:underline; }
.settings-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:24px; }
.form-field { margin-bottom:14px; }
.form-field label { display:block; font-size:12px; font-weight:700; color:var(--text); margin-bottom:5px; text-transform:uppercase; letter-spacing:.4px; }
.form-field input, .form-field select { width:100%; padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:14px; font-family:'Sora',sans-serif; outline:none; background:var(--white); color:var(--text); }
.toggle-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f3f4f6; }
.toggle-row:last-child { border:none; }
.toggle-row .lbl h4 { font-size:14px; font-weight:500; color:var(--text); }
.toggle-row .lbl p { font-size:12px; color:var(--muted); margin-top:2px; }
.btn-green { background:var(--forest-mid); color:#fff; border:none; padding:11px 22px; border-radius:10px; font-weight:700; cursor:pointer; font-size:14px; font-family:'Sora',sans-serif; display:inline-flex; align-items:center; gap:7px; }
.danger-zone { border:1px solid #fecaca !important; background:var(--red-bg) !important; }
.delete-btn {
  background: var(--red-bg);
  color: var(--red);
  border: 1px solid #fecaca;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: all .15s;
}
.delete-btn:hover {
  background: var(--red);
  color: #fff;
}
`;

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState({ name: "Admin User", email: "tayalveer20@gmail.com", phone: "" });
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true });
  const [researchers, setResearchers] = useState(null);
  const [verified, setVerified] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const fetched = useRef(false);
  const navigate = useNavigate();
const [isAuthChecked, setIsAuthChecked] = useState(false);
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
const deleteResearcher = (id) => {
    if (!window.confirm("Do you really want to Delete this Dataset Link?")) return;

    const token = localStorage.getItem("token");

    fetch(`https://agrismart-ai-powered-crop-recommendation.onrender.com/api/users/researchers/${id}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then(r => {
        if (r.ok || r.status === 204) {
          setResearchers(prev => prev.filter(x => x.id !== id));
        } else {
          alert("Not Deleted! Status: " + r.status);
        }
      })
      .catch(() => alert("Server error"));
  };

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("https://agrismart-ai-powered-crop-recommendation.onrender.com/api/users/profile/", {
    headers: {
      Authorization: `Token ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    })
    .then(data => {
      setUser({
        name: data.full_name,
        email: data.email,
        role: data.role
      });

      setSettings({
        name: data.full_name,
        email: data.email
      });
    })
    .catch(err => {
      console.error("Profile fetch error:", err);
    });
}, []);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  setIsAuthChecked(true);

  if (fetched.current) return;
  fetched.current = true;

  fetch("https://agrismart-ai-powered-crop-recommendation.onrender.com/api/users/")
    .then(r => r.json())
    .then(data => setVerified(data))
    .catch(() => setVerified([]));

  fetch("https://agrismart-ai-powered-crop-recommendation.onrender.com/api/users/researchers/")
    .then(r => r.json())
    .then(data => setResearchers(data))
    .catch(() => setResearchers([]));

}, []);
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
};
  if (!isAuthChecked) return null;
  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="logo">🍃</span>
            <div><h2>AgriSmart</h2><span>Admin Dashboard</span></div>
          </div>
          <nav className="nav-group">
            <div className={`nav-item ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>
              <LayoutDashboard size={18} /> <span>Dashboard</span>
            </div>
          </nav>
          <div className="sidebar-footer">
            <div className={`nav-item ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
              <Settings size={18} /> <span>Settings</span>
            </div>
           <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <div className="user-chip">
              <div className="avatar">{getInitials(user.name)}</div>
              <div className="info"><h4>{user.name}</h4><p>{user.email} </p></div>
            </div>
          </div>
        </aside>

        <main className="main">
          {tab === "dashboard" && (
            <>
              <div className="page-header">
                <h1>Overview</h1><p>Welcome, {user.name}</p>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div>
                    <div className="label">Total Users</div>
                    <div className="val">{verified ? verified.length : "—"}</div>
                    <div className="sub green">Registered accounts</div>
                  </div>
                  <div className="icon-box green"><Users size={24} /></div>
                </div>
                <div className="stat-card">
                  <div>
                    <div className="label">Dataset Links</div>
                    <div className="val">{researchers ? researchers.length : "—"}</div>
                    <div className="sub blue">Submitted by researchers</div>
                  </div>
                  <div className="icon-box blue"><FileText size={24} /></div>
                </div>
              </div>

              <div className="card">
                <div className="section-head">
                  <h3>Researcher Dataset Links</h3>
                  <span className="badge sky">{researchers ? researchers.length : "…"} Total</span>
                </div>
                {researchers === null
                  ? <div className="loading"><Loader2 size={18} className="spin" /> Loading…</div>
                  : researchers.length === 0
                    ? <p style={{ color:"var(--muted)", fontSize:14 }}>No datasets yet.</p>
                    : <table>
                        <thead><tr><th>ID</th><th>Name</th><th>Link</th><th>User ID</th><th>Action</th></tr></thead>
                        <tbody>
                          {researchers.map(r => (
                           <tr key={r.id}>
                              <td className="dim">#{r.id}</td>
                              <td className="bold">{r.name}</td>
                              <td>
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                                  View link
                                </a>
                              </td>
                              <td className="dim">{r.user_id}</td>
                              <td>
                                <button className="delete-btn" onClick={() => deleteResearcher(r.id)}>
                                  Delete
                                </button>
                              </td>
                            </tr> 
                          ))}
                        </tbody>
                      </table>
                }
              </div>

              <div className="card">
                <div className="section-head">
                  <h3>Verified Users</h3>
                  <span className="badge green">{verified ? verified.length : "…"} Total</span>
                </div>
                {verified === null
                  ? <div className="loading"><Loader2 size={18} className="spin" /> Loading…</div>
                  : <table>
                      <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Status</th></tr></thead>
                      <tbody>
                        {verified.map(u => (
                          <tr key={u.id}>
                            <td className="dim">#{u.id}</td>
                            <td className="bold">{u.name}</td>
                            <td><span className={`badge ${u.role === "admin" ? "orange" : "sky"}`}>{u.role}</span></td>
                            <td className="dim">{u.email}</td>
                            <td><span className={`badge ${u.status === "Active" ? "green" : "sky"}`}>{u.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </>
          )}

          {tab === "settings" && (
            <>
              <div className="page-header">
                <h1>Settings</h1><p>Manage your profile and preferences</p>
              </div>
              <div className="settings-grid">
                <div>
                  <div className="card">
                    <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Profile</h3>
                    {[["Full Name","text","name"],["Email","email","email"],["Phone","text","phone"]].map(([label,type,key]) => (
                      <div className="form-field" key={key}>
                        <label>{label}</label>
                        <input type={type} value={profile[key]} onChange={e => setProfile({...profile,[key]:e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Security</h3>
                    <div className="form-field"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
                    <div className="form-field"><label>New Password</label><input type="password" placeholder="New password" /></div>
                  </div>
                </div>
                <div>
                  <div className="card">
                    <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Notifications</h3>
                    {[{key:"email",label:"Email Alerts",sub:"Get updates via email"},{key:"push",label:"Push Notifications",sub:"Browser popups"},{key:"weekly",label:"Weekly Reports",sub:"Summary every Monday"}].map(({key,label,sub}) => (
                      <div className="toggle-row" key={key}>
                        <div className="lbl"><h4>{label}</h4><p>{sub}</p></div>
                        <input type="checkbox" checked={notifs[key]} onChange={() => setNotifs({...notifs,[key]:!notifs[key]})} style={{width:18,height:18,cursor:"pointer",accentColor:"var(--forest-mid)"}} />
                      </div>
                    ))}
                  </div>
                  <div className="card danger-zone">
                    <h3 style={{color:"var(--red)",fontSize:15,fontWeight:700,marginBottom:8}}>Danger Zone</h3>
                    <p style={{fontSize:12,color:"#7f1d1d",marginBottom:14}}>Actions here cannot be undone.</p>
                    <button style={{width:"100%",padding:"11px",background:"var(--red)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"}}>Delete My Account</button>
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
