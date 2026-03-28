import React, { useState } from "react";
// 1. ICONS IMPORT
import { 
  LayoutDashboard, Database, BrainCircuit, Map as MapIcon, 
  Users, BarChart3, Settings, Bell, ChevronLeft, 
  FileText, AlertTriangle, CheckCircle2, ArrowUpRight, ChevronDown, 
  Clock, RefreshCw, ThumbsUp, TrendingUp
} from "lucide-react";

// 2. GRAPHS IMPORT
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

import "./AdminDashboard.css";

// --- DATA FOR ANALYTICS ---
const cropTrendsData = [
  { name: 'Jan', wheat: 300, rice: 400 }, { name: 'Feb', wheat: 400, rice: 500 },
  { name: 'Mar', wheat: 350, rice: 550 }, { name: 'Apr', wheat: 500, rice: 450 },
  { name: 'May', wheat: 450, rice: 500 }, { name: 'Jun', wheat: 600, rice: 650 },
];
const pendingResearchers = [
  { id: 1, name: "Dr. Kavita Iyer", topic: "Soil Alkalinity Analysis", date: "17 Jan 2026", status: "Pending" },
  { id: 2, name: "Rajesh Kumar", topic: "Pest Control Mechanisms", date: "16 Jan 2026", status: "Pending" },
  { id: 3, name: "Dr. Alan Grant", topic: "Hybrid Wheat Yield Study", date: "15 Jan 2026", status: "Review" },
];

const allUsers = [
  { id: 101, name: "Dr. A. Sharma", role: "Senior Researcher", email: "sharma@agri.com", status: "Verified" },
  { id: 102, name: "Priya Singh", role: "Data Analyst", email: "priya@data.com", status: "Verified" },
  { id: 103, name: "Kisan Sewa Kendra", role: "Field Officer", email: "help@kisan.org", status: "Active" },
];
const regionPerformanceData = [
  { name: 'Punjab', Datasets: 120 }, { name: 'Karnataka', Datasets: 90 },
  { name: 'Gujarat', Datasets: 70 }, { name: 'Haryana', Datasets: 60 },
  { name: 'UP', Datasets: 50 },
];
const topContributorsData = [
  { name: 'Dr. Priya', value: 35 }, { name: 'Prof. Rajesh', value: 25 },
  { name: 'Dr. Ananya', value: 25 }, { name: 'Dr. Vikram', value: 15 },
];
const PIE_COLORS = ['#eab308', '#22c55e', '#0ea5e9', '#f97316'];
const dailyPredictionsData = [
  { name: 'Mon', predictions: 220 }, { name: 'Tue', predictions: 320 },
  { name: 'Wed', predictions: 280 }, { name: 'Thu', predictions: 390 },
  { name: 'Fri', predictions: 450 }, { name: 'Sat', predictions: 250 }, { name: 'Sun', predictions: 180 },
];
const datasetUsageData = [
  { name: 'Soil', value: 45 }, { name: 'Crop', value: 32 }, { name: 'Weather', value: 23 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  // --- SETTINGS STATE ---
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@agrismart.com", phone: "+91 98765 43210" });
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });
  
  // Save Handler (Mock)
  const handleSaveSettings = async () => {
  setIsSaving(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/users/update_user/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({
        full_name: settings.name,
        email: settings.email,
        phone: settings.phone,
        region: settings.region
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Saved to backend!");
    } else {
      alert(data.error || "Something went wrong");
    }

  } catch (err) {
    console.error(err);
    alert("Error saving settings ❌");
  }

  setIsSaving(false);
};
// --- YE STYLE OBJECT MISSING THA ---
 const s = {
    container: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#f1f5f9' },
    sidebar: { width: '280px', background: '#0f5132', color: 'white', display: 'flex', flexDirection: 'column', padding: '30px', flexShrink: 0 }, // Thoda chouda sidebar
    brand: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '8px', color: '#d1fae5', fontSize: '15px', transition: 'all 0.2s' },
    navActive: { background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: '600', borderLeft: '5px solid #4ade80' },
    
    // Main Content Spacious
    main: { flex: 1, padding: '40px', overflowY: 'auto' }, // Padding 32px se 40px kar di
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.5px' },
    subtitle: { color: '#6b7280', fontSize: '15px', marginTop: '6px' },

    // Grids with more GAP
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '40px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' },
    card: { background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    
    // Typography & Buttons
    statLabel: { color: '#64748b', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statVal: { fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' },
    btnGreen: { background: '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize:'14px', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)' },
  };
  const ComingSoonPage = ({ title, icon: Icon }) => (
    <div className="card" style={{height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Icon size={48} color="#9ca3af" style={{marginBottom: '20px'}} />
      <h2 style={{color: '#374151'}}>{title}</h2>
      <p style={{color: '#6b7280'}}>Coming Soon</p>
    </div>
  );

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">🍃</div>
          <div className="brand"><h2>AgriSmart</h2><span>Admin Dashboard</span></div>
        </div>


<nav className="sidebar-nav">
  <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
    <LayoutDashboard size={20} /> <span>Dashboard</span>
  </div>
  <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
    <Users size={20} /> <span>Datasets and User</span>
  </div>
  <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
    <BarChart3 size={20} /> <span>Analytics</span>
  </div>
  <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
    <Settings size={20} /> <span>Settings</span>
  </div>
</nav>
        <div className="sidebar-footer">
          <div className="nav-item"><Bell size={20} /> <span>Notifications</span></div>
          <div className="user-profile">
            <div className="avatar">AS</div>
            <div className="user-info"><h4>Admin User</h4><p>admin@agrismart.com</p></div>
            <ChevronLeft size={16} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <div className="dashboard-container">
          
          {/* ======================================================= */}
          {/* VIEW 1: DASHBOARD (TERA ORIGINAL CODE YAHAN AAYEGA)     */}
          {/* ======================================================= */}
       
        
        {/* ==================== 1. DASHBOARD VIEW (Screenshot 1) ==================== */}
     {/* ==================== 1. CLEAN DASHBOARD VIEW ==================== */}
{activeTab === 'dashboard' && (
  <>
    <div style={s.header}>
      <div><h1 style={s.title}>Overview</h1><p style={s.subtitle}>Welcome back, Admin</p></div>
      <div style={{fontSize:'14px', color:'#64748b', background:'white', padding:'10px 20px', borderRadius:'30px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
         📅 Today: 18 Jan 2026
      </div>
    </div>

    {/* 1. Main Stats - Spacious Grid */}
    <div style={s.grid4}>
      <StatCard label="Total Users" value="120" sub="+12 New" subColor="green" icon={<Users size={24}/>} />
      <StatCard label="Active Research" value="15" sub="Ongoing" subColor="blue" icon={<FileText size={24}/>} color="blue-icon" />
      <StatCard label="Pending Requests" value="08" sub="Action Needed" subColor="orange" icon={<AlertTriangle size={24}/>} color="orange-icon" />
      <StatCard label="Total Datasets" value="486" sub="Verified" subColor="green" icon={<Database size={24}/>} />
    </div>

    {/* 2. Only One Main Chart & Quick Actions (Clean Layout) */}
    <div style={{display:'grid', gridTemplateColumns:'2.5fr 1fr', gap:'30px'}}>
       
       {/* Main Chart */}
       <div style={{...s.card, minHeight:'400px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
             <h3 style={{fontSize:'18px', fontWeight:'700', margin:0}}>Crop Recommendation Trends</h3>
             <select style={{border:'1px solid #e2e8f0', padding:'5px 10px', borderRadius:'8px', outline:'none', color:'#64748b'}}>
                <option>Last 6 Months</option>
             </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cropTrendsData}>
              <defs>
                <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#94a3b8'}} dy={10}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8'}}/>
              <Tooltip contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}/>
              <Area type="monotone" dataKey="wheat" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorWheat)" />
            </AreaChart>
          </ResponsiveContainer>
       </div>

       {/* Quick Action Side Panel */}
       <div style={s.card}>
          <h3 style={{fontSize:'18px', fontWeight:'700', marginBottom:'20px'}}>Quick Actions</h3>
          <p style={{color:'#64748b', fontSize:'14px', marginBottom:'30px'}}>Common tasks for daily management.</p>
          
          <button style={{width:'100%', background:'#f0fdf4', color:'#166534', padding:'15px', borderRadius:'12px', border:'1px solid #bbf7d0', marginBottom:'15px', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', fontWeight:'600'}}>
             <CheckCircle2 size={18}/> Verify Researchers
          </button>
          
          <button style={{width:'100%', background:'#fff7ed', color:'#9a3412', padding:'15px', borderRadius:'12px', border:'1px solid #fed7aa', marginBottom:'15px', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', fontWeight:'600'}}>
             <Database size={18}/> Upload Dataset
          </button>

          <button style={{width:'100%', background:'#f8fafc', color:'#475569', padding:'15px', borderRadius:'12px', border:'1px solid #e2e8f0', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', fontWeight:'600'}}>
             <Settings size={18}/> System Settings
          </button>
       </div>
    </div>
  </>
)}
          {/* ======================================================= */}
          {/* VIEW 2: ANALYTICS (FULL COMPLETED)                      */}
          {/* ======================================================= */}
          {/* ==================== 2. MINIMAL ANALYTICS VIEW ==================== */}
{activeTab === 'analytics' && (
  <div>
    <div style={s.header}>
      <div><h1 style={s.title}>Analytics</h1><p style={s.subtitle}>Performance metrics & AI insights</p></div>
    </div>

    {/* 1. KPIs (Big & Clear) */}
    <div style={{...s.card, marginBottom:'40px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'20px'}}>
         <KpiItem label="Success Rate" value="94.2%" sub="High Accuracy" subColor="green" icon={<CheckCircle2 size={20}/>} />
         <KpiItem label="Avg Response" value="142ms" sub="Optimal" subColor="green" icon={<Clock size={20}/>} />
         <KpiItem label="Daily Predictions" value="1,240" sub="+5% vs yest" subColor="green" icon={<TrendingUp size={20}/>} />
         <KpiItem label="Server Uptime" value="99.9%" sub="Stable" subColor="green" icon={<RefreshCw size={20}/>} />
      </div>
    </div>

    {/* 2. Single Important Graph (Activity) */}
    <div style={s.card}>
      <h3 style={{fontSize:'18px', fontWeight:'700', marginBottom:'30px'}}>Daily Prediction Volume</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={dailyPredictionsData} barSize={60}>
           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#94a3b8'}} dy={10}/>
           <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}/>
           <Bar dataKey="predictions" fill="#166534" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

          {/* OTHER PAGES */}
        
          {/* ==================== 3. RESEARCHERS & VALIDATION VIEW (NO REGION) ==================== */}
{activeTab === 'users' && (
  <div>
    <div style={s.header}>
      <div>
        <h1 style={s.title}>Researcher Management</h1>
        <p style={s.subtitle}>Validate research requests and manage users</p>
      </div>
      <button style={s.btnGreen}>+ Invite Researcher</button>
    </div>

    {/* SECTION 1: PENDING VALIDATIONS */}
    <div style={{...s.card, marginBottom:'30px', borderLeft:'5px solid #ca8a04'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <h3 style={{color:'#854d0e', display:'flex', alignItems:'center', gap:'10px'}}>
          <AlertTriangle size={20}/> Pending Approvals
        </h3>
        <span style={{background:'#fef9c3', color:'#854d0e', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>
          {pendingResearchers.length} Requests
        </span>
      </div>

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #fce7f3', textAlign:'left', color:'#6b7280'}}>
            <th style={{padding:'12px'}}>Researcher Name</th>
            <th style={{padding:'12px'}}>Research Topic</th>
            {/* Region Column Removed */}
            <th style={{padding:'12px'}}>Submission Date</th>
            <th style={{padding:'12px', textAlign:'right'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingResearchers.map(req => (
            <tr key={req.id} style={{borderBottom:'1px solid #f3f4f6'}}>
              <td style={{padding:'12px', fontWeight:'600', color:'#374151'}}>{req.name}</td>
              <td style={{padding:'12px', color:'#4b5563'}}>{req.topic}</td>
              {/* Region Data Removed */}
              <td style={{padding:'12px', color:'#6b7280'}}>{req.date}</td>
              <td style={{padding:'12px', textAlign:'right'}}>
                <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                  <button title="View Details" style={{border:'1px solid #d1d5db', background:'white', padding:'6px', borderRadius:'6px', cursor:'pointer'}}>
                    <FileText size={16} color="#4b5563"/>
                  </button>
                  <button title="Reject" style={{border:'1px solid #fca5a5', background:'#fef2f2', padding:'6px', borderRadius:'6px', cursor:'pointer'}}>
                    <Users size={16} style={{transform:'rotate(45deg)'}} color="#dc2626"/>
                  </button>
                  <button title="Approve" style={{border:'none', background:'#16a34a', padding:'6px 12px', borderRadius:'6px', cursor:'pointer', color:'white', display:'flex', alignItems:'center', gap:'5px'}}>
                    <CheckCircle2 size={16}/> Validate
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* SECTION 2: VERIFIED USERS LIST */}
    <div style={s.card}>
      <h3 style={{marginBottom:'20px'}}>Verified Researchers & Users</h3>
      
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #f3f4f6', textAlign:'left', color:'#6b7280'}}>
            <th style={{padding:'12px'}}>ID</th>
            <th style={{padding:'12px'}}>Name</th>
            <th style={{padding:'12px'}}>Role</th>
            <th style={{padding:'12px'}}>Email / Contact</th>
            <th style={{padding:'12px'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => (
            <tr key={user.id} style={{borderBottom:'1px solid #f3f4f6'}}>
              <td style={{padding:'12px', color:'#9ca3af'}}>#{user.id}</td>
              <td style={{padding:'12px', fontWeight:'500'}}>{user.name}</td>
              <td style={{padding:'12px'}}>{user.role}</td>
              <td style={{padding:'12px', color:'#6b7280'}}>{user.email}</td>
              <td style={{padding:'12px'}}>
                <span style={{background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'600'}}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
         {/* ==================== 5. SETTINGS VIEW (Complete) ==================== */}
{activeTab === 'settings' && (
  <div style={{maxWidth:'1000px', margin:'0 auto'}}>
    <div style={s.header}>
      <div>
        <h1 style={s.title}>System Settings</h1>
        <p style={s.subtitle}>Manage your profile, security, and preferences</p>
      </div>
      <button onClick={handleSaveSettings} style={s.btnGreen}>
        <CheckCircle2 size={16} style={{marginRight:'5px'}}/> Save Changes
      </button>
    </div>

    <div style={s.grid21}>
      {/* LEFT COLUMN */}
      <div>
        {/* 1. Profile Settings */}
        <div style={{...s.card, marginBottom:'24px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px', borderBottom:'1px solid #f3f4f6', paddingBottom:'15px'}}>
             <div style={{height:'50px', width:'50px', background:'#166534', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'bold'}}>
                {profile.name.charAt(0)}
             </div>
             <div>
               <h3 style={{fontSize:'16px', fontWeight:'700', margin:0}}>Profile Information</h3>
               <p style={{fontSize:'12px', color:'#6b7280', margin:0}}>Update your personal details</p>
             </div>
          </div>

          <div style={{display:'grid', gap:'15px'}}>
            <div>
              <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'5px', display:'block'}}>Full Name</label>
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', outline:'none', fontSize:'14px'}} 
              />
            </div>
            <div>
              <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'5px', display:'block'}}>Email Address</label>
              <input 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', outline:'none', fontSize:'14px', background:'#f9fafb'}} 
              />
            </div>
            <div>
              <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'5px', display:'block'}}>Phone Number</label>
              <input 
                type="text" 
                value={profile.phone} 
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', outline:'none', fontSize:'14px'}} 
              />
            </div>
          </div>
        </div>

        {/* 2. Security (Password) */}
        <div style={{...s.card, marginBottom:'24px'}}>
          <h3 style={{fontSize:'16px', fontWeight:'700', marginBottom:'15px'}}>Security</h3>
          <div style={{display:'grid', gap:'15px'}}>
             <div>
              <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'5px', display:'block'}}>Current Password</label>
              <input type="password" placeholder="••••••••" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
             </div>
             <div>
              <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'5px', display:'block'}}>New Password</label>
              <input type="password" placeholder="••••••••" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div>
         {/* 3. Notifications */}
         <div style={{...s.card, marginBottom:'24px'}}>
            <h3 style={{fontSize:'16px', fontWeight:'700', marginBottom:'20px'}}>Notifications</h3>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
               <div>
                 <div style={{fontWeight:'500', fontSize:'14px'}}>Email Alerts</div>
                 <div style={{fontSize:'12px', color:'#6b7280'}}>Get updates via email</div>
               </div>
               <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} style={{width:'16px', height:'16px', cursor:'pointer'}} />
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
               <div>
                 <div style={{fontWeight:'500', fontSize:'14px'}}>Push Notifications</div>
                 <div style={{fontSize:'12px', color:'#6b7280'}}>Browser popups</div>
               </div>
               <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} style={{width:'16px', height:'16px', cursor:'pointer'}} />
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <div>
                 <div style={{fontWeight:'500', fontSize:'14px'}}>Weekly Reports</div>
                 <div style={{fontSize:'12px', color:'#6b7280'}}>Summary every Monday</div>
               </div>
               <input type="checkbox" checked={notifications.weekly} onChange={() => setNotifications({...notifications, weekly: !notifications.weekly})} style={{width:'16px', height:'16px', cursor:'pointer'}} />
            </div>
         </div>

         {/* 4. Preferences */}
         <div style={{...s.card, marginBottom:'24px'}}>
            <h3 style={{fontSize:'16px', fontWeight:'700', marginBottom:'15px'}}>System Preferences</h3>
            <div style={{marginBottom:'15px'}}>
               <label style={{fontSize:'12px', fontWeight:'600', marginBottom:'5px', display:'block'}}>Language</label>
               <select style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db', background:'white'}}>
                  <option>English (US)</option>
                  <option>Hindi (हिंदी)</option>
                  <option>Punjabi (ਪੰਜਾਬੀ)</option>
               </select>
            </div>
            <div>
               <label style={{fontSize:'12px', fontWeight:'600', marginBottom:'5px', display:'block'}}>Time Zone</label>
               <select style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db', background:'white'}}>
                  <option>(GMT+05:30) Kolkata, Mumbai, New Delhi</option>
                  <option>(GMT+00:00) UTC</option>
               </select>
            </div>
         </div>

         {/* 5. Danger Zone */}
         <div style={{...s.card, border:'1px solid #fecaca', background:'#fef2f2'}}>
            <h3 style={{fontSize:'16px', fontWeight:'700', color:'#dc2626', marginBottom:'10px'}}>Danger Zone</h3>
            <p style={{fontSize:'12px', color:'#7f1d1d', marginBottom:'15px'}}>
               Actions here cannot be undone. Please be careful.
            </p>
            <button style={{width:'100%', padding:'10px', background:'#dc2626', color:'white', border:'none', borderRadius:'6px', fontWeight:'600', cursor:'pointer'}}>
               Delete My Account
            </button>
         </div>
      </div>
    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ label, value, sub, subColor, icon, color }) => (
  <div className="card stat-card">
    <div className="stat-content"><span className="stat-label">{label}</span><h2>{value}</h2><span className={`stat-sub ${subColor}`}>{sub}</span></div>
    <div className={`stat-icon-box ${color || 'green-icon'}`}>{icon}</div>
  </div>
);

// Ye naya component hai KPI section ke liye
// --- YE COMPONENT MISSING THA ---
const KpiItem = ({ label, value, sub, subColor, icon }) => (
  <div style={{borderRight:'1px solid #eee', paddingRight:'20px'}}>
    <span style={{color:'#6b7280', fontSize:'13px'}}>{label}</span>
    <div style={{marginTop:'5px'}}>
      <h3 style={{fontSize:'24px', fontWeight:'bold', margin:'0'}}>{value}</h3>
      <div style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', marginTop:'4px', color: subColor==='green'?'#16a34a':'#ea580c'}}>
        {icon} <span>{sub}</span>
      </div>
    </div>
  </div>
);
export default AdminDashboard;