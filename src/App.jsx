import { useState } from "react";
import ClientesScreen from "./Clientes.jsx";
import ClienteDetalle from "./ClienteDetalle.jsx";

const I = ({ n, s=20, c="currentColor" }) => {
  const icons = {
    home:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    dumbbell: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M2 8h4M18 8h4M2 16h4M18 16h4M6 8h12M6 16h12"/></svg>,
    chart:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    chat:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    calendar: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    edit:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    back:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    check:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    plus:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bell:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    send:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    lock:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    trophy:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17v5a5 5 0 0 1-10 0V4z"/><path d="M5 9H3a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h3"/><path d="M19 9h2a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1h-3"/></svg>,
    star:     <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    heart:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    fire:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    credit:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    arrow:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    x:        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };
  return icons[n] || null;
};

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", blue:"#4A9EFF", green:"#2ECC8E",
  red:"#FF4757", yellow:"#FFD32A", purple:"#8B5CF6",
  text:"#FFFFFF", muted:"#8891A4", dim:"#5A6275",
};

const ProgressBar = ({ value, color=C.orange, h=6 }) => (
  <div style={{width:"100%",background:C.border,borderRadius:10,height:h,overflow:"hidden"}}>
    <div style={{width:`${Math.min(value,100)}%`,height:"100%",background:color,borderRadius:10}}/>
  </div>
);

const Badge = ({ text, color=C.orange }) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{text}</span>
);

const Header = ({ title, onHome, sub, right }) => (
  <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
    <button onClick={onHome} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
      <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
    </button>
    <div style={{flex:1}}>
      <div style={{color:C.text,fontWeight:800,fontSize:15}}>{title}</div>
      {sub&&<div style={{color:C.muted,fontSize:11}}>{sub}</div>}
    </div>
    {right}
  </div>
);

const CLIENTS = [
  {id:1,name:"Carlos Mendoza",goal:"Hipertrofia",level:"Intermedio",plan:"Premium",avatar:"CM",color:"#FF6B35",weight:78,streak:21,progress:72,paid:true,lastActive:"Hace 2h",nextSession:"Mañana 10:00"},
  {id:2,name:"María González",goal:"Pérdida de peso",level:"Principiante",plan:"Básico",avatar:"MG",color:"#4A9EFF",weight:65,streak:14,progress:58,paid:true,lastActive:"Hace 1h",nextSession:"Miérc 09:00"},
  {id:3,name:"Diego Ramírez",goal:"Fuerza máxima",level:"Avanzado",plan:"Elite",avatar:"DR",color:"#2ECC8E",weight:88,streak:45,progress:89,paid:true,lastActive:"Hace 30m",nextSession:"Hoy 18:00"},
  {id:4,name:"Sofía Herrera",goal:"Rendimiento",level:"Intermedio",plan:"Premium",avatar:"SH",color:"#8B5CF6",weight:58,streak:7,progress:64,paid:false,lastActive:"Hace 3h",nextSession:"Juev 07:00"},
  {id:5,name:"Andrés Castillo",goal:"Recondicionar",level:"Principiante",plan:"Básico",avatar:"AC",color:"#FFD32A",weight:95,streak:3,progress:22,paid:true,lastActive:"Ayer",nextSession:"Vier 11:00"},
];

// LOGIN
const Login = ({ onLogin }) => {
  const [role,setRole] = useState("trainer");
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [loading,setLoading] = useState(false);
  const submit = () => {
    if(!email||!pass) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onLogin({role,name:email.split("@")[0],email}); },1000);
  };
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <div style={{width:4,height:52,borderRadius:4,background:C.orange}}/>
        <div>
          <div style={{color:C.text,fontSize:36,fontWeight:900,letterSpacing:-1,lineHeight:1}}>JUD</div>
          <div style={{color:C.orange,fontSize:11,letterSpacing:7,marginTop:2}}>PERFORMANCE</div>
        </div>
        <div style={{width:8,height:8,borderRadius:"50%",background:C.orange,alignSelf:"flex-start",marginTop:6}}/>
      </div>
      <p style={{color:C.muted,fontSize:13,marginBottom:32,textAlign:"center"}}>Tu plataforma de entrenamiento personalizado</p>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{display:"flex",background:C.card,borderRadius:14,padding:4,marginBottom:20,border:`1px solid ${C.border}`}}>
          {["trainer","client"].map(r=>(
            <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:"10px",background:role===r?`linear-gradient(135deg,${C.orange},${C.orangeL})`:"transparent",color:role===r?"#fff":C.muted,border:"none",borderRadius:11,cursor:"pointer",fontWeight:700,fontSize:13}}>
              {r==="trainer"?"🏋️ Entrenador":"💪 Atleta"}
            </button>
          ))}
        </div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo electrónico" style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:10}}/>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña" onKeyDown={e=>e.key==="Enter"&&submit()} style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:16}}/>
        <button onClick={submit} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>
          {loading?"⏳ Cargando...":"Iniciar Sesión"}
        </button>
        <p style={{color:C.dim,fontSize:11,textAlign:"center",marginTop:16}}>Demo: cualquier email y contraseña funciona</p>
      </div>
    </div>
  );
};

// TRAINER HOME
const TrainerHome = ({ user, nav, logout }) => (
  <div style={{paddingBottom:20}}>
    <div style={{background:`linear-gradient(135deg,${C.orange}22,${C.card})`,padding:"20px 16px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{width:3,height:22,borderRadius:3,background:C.orange}}/>
            <span style={{color:C.text,fontSize:15,fontWeight:900}}>JUD</span>
            <span style={{color:C.orange,fontSize:8,letterSpacing:4}}>PERFORMANCE</span>
          </div>
          <div style={{color:C.muted,fontSize:12}}>Buenos días,</div>
          <div style={{color:C.text,fontSize:20,fontWeight:800}}>{user?.name||"Juan"} 👋</div>
        </div>
        <button onClick={logout} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
          <I n="lock" s={13} c={C.muted}/><span style={{color:C.muted,fontSize:12,fontWeight:600}}>Salir</span>
        </button>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto"}}>
        {[[CLIENTS.length,"Clientes","users",C.orange],["$175K","Ingresos","credit",C.green],["47","Sesiones","calendar",C.blue],["86%","Adherencia","chart",C.purple]].map(([v,l,ic,col])=>(
          <div key={l} style={{background:C.card,borderRadius:14,padding:"12px 14px",flexShrink:0,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><I n={ic} s={13} c={col}/><span style={{color:C.muted,fontSize:11}}>{l}</span></div>
            <div style={{color:C.text,fontWeight:800,fontSize:18}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:"16px"}}>
      <div style={{color:C.text,fontWeight:700,marginBottom:12}}>Acciones rápidas</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[["Clientes","users",C.orange,"clientes"],["Agenda","calendar",C.blue,"agenda"],["Rutinas","edit",C.green,"rutinas"],["Stats","chart",C.purple,"stats"]].map(([l,ic,col,sc])=>(
          <button key={l} onClick={()=>nav(sc)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px",cursor:"pointer",textAlign:"left"}}>
            <div style={{background:col+"22",borderRadius:10,padding:8,display:"inline-flex",marginBottom:8}}><I n={ic} s={18} c={col}/></div>
            <div style={{color:C.text,fontWeight:700,fontSize:13}}>{l}</div>
          </button>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{color:C.text,fontWeight:700}}>Clientes recientes</div>
        <button onClick={()=>nav("clientes")} style={{background:"none",border:"none",color:C.orange,fontSize:13,cursor:"pointer"}}>Ver todos →</button>
      </div>
      {CLIENTS.slice(0,3).map(c=>(
        <div key={c.id} onClick={()=>nav("cliente",c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"13px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:c.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14,flexShrink:0}}>{c.avatar}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{color:C.text,fontWeight:700}}>{c.name}</span>
              <Badge text={c.plan} color={c.plan==="Elite"?C.purple:c.plan==="Premium"?C.orange:C.blue}/>
            </div>
            <div style={{color:C.muted,fontSize:12,marginBottom:5}}>{c.goal} · {c.lastActive}</div>
            <ProgressBar value={c.progress} color={c.color}/>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TrainerClientes = ({ nav }) => {
  const [search,setSearch]=useState("");
  const filtered=CLIENTS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Clientes" sub={`${CLIENTS.length} activos`} onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",display:"flex",gap:8,marginBottom:12}}>
          <I n="search" s={16} c={C.muted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{background:"none",border:"none",color:C.text,fontSize:14,outline:"none",flex:1}}/>
        </div>
        {filtered.map(c=>(
          <div key={c.id} onClick={()=>nav("cliente",c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"13px",marginBottom:8,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:c.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14,flexShrink:0}}>{c.avatar}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:C.text,fontWeight:800}}>{c.name}</span>
                  <div style={{display:"flex",gap:4}}><Badge text={c.plan} color={c.plan==="Elite"?C.purple:c.plan==="Premium"?C.orange:C.blue}/>{!c.paid&&<Badge text="Vencido" color={C.red}/>}</div>
                </div>
                <div style={{color:C.muted,fontSize:12}}>{c.goal} · {c.level}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1}}><ProgressBar value={c.progress} color={c.color}/></div><span style={{color:C.muted,fontSize:11}}>{c.progress}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainerAgenda = ({ nav }) => {
  const dias=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const eventos=[{day:0,name:"Carlos M.",time:"10:00",tipo:"Presencial"},{day:2,name:"María G.",time:"09:00",tipo:"Online"},{day:3,name:"Diego R.",time:"18:00",tipo:"Presencial"}];
  const [sel,setSel]=useState(0);
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Agenda" sub="Semana actual" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px 0",display:"flex",gap:6,overflowX:"auto"}}>
        {dias.map((d,i)=>(
          <button key={i} onClick={()=>setSel(i)} style={{flexShrink:0,background:sel===i?C.blue:C.card,border:"none",borderRadius:12,padding:"10px 12px",cursor:"pointer",textAlign:"center",minWidth:46}}>
            <div style={{color:sel===i?"#fff":C.muted,fontSize:11,fontWeight:600}}>{d}</div>
            {eventos.some(e=>e.day===i)&&<div style={{width:5,height:5,borderRadius:"50%",background:sel===i?"rgba(255,255,255,0.8)":C.orange,margin:"5px auto 0"}}/>}
          </button>
        ))}
      </div>
      <div style={{padding:"12px 16px"}}>
        {eventos.filter(e=>e.day===sel).length===0?(
          <div style={{background:C.card,borderRadius:16,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:40,marginBottom:10}}>📭</div><div style={{color:C.muted}}>Sin sesiones este día</div></div>
        ):eventos.filter(e=>e.day===sel).map((ev,i)=>(
          <div key={i} style={{background:C.card,borderRadius:14,padding:"14px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}>
            <div style={{background:C.blue+"22",borderRadius:10,padding:"8px 12px",color:C.blue,fontWeight:800}}>{ev.time}</div>
            <div><div style={{color:C.text,fontWeight:700}}>{ev.name}</div><Badge text={ev.tipo} color={ev.tipo==="Online"?C.green:C.orange}/></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainerRutinas = ({ nav }) => {
  const tpls=[{name:"Fullbody 3x/sem",days:3,exs:9,clients:3},{name:"PPL 6 días",days:6,exs:18,clients:2},{name:"Pierna & Glúteo",days:2,exs:8,clients:4}];
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Plantillas de Rutinas" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        {tpls.map((t,i)=>(
          <div key={i} style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div><div style={{color:C.text,fontWeight:800}}>{t.name}</div></div>
              <button style={{background:C.orange+"22",border:"none",borderRadius:8,padding:"5px 10px",color:C.orange,fontWeight:700,fontSize:12,cursor:"pointer"}}>Usar</button>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[[t.days+"d","Días"],[t.exs,"Ejercicios"],[t.clients,"Clientes"]].map(([v,l])=>(
                <div key={l}><span style={{color:C.text,fontWeight:700}}>{v} </span><span style={{color:C.muted,fontSize:12}}>{l}</span></div>
              ))}
            </div>
          </div>
        ))}
        <button style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <I n="plus" s={16} c="#fff"/> Nueva plantilla
        </button>
      </div>
    </div>
  );
};

const TrainerStats = ({ nav }) => (
  <div style={{paddingBottom:20}}>
    <Header title="Estadísticas" sub="Panel de negocio" onHome={()=>nav("home")}/>
    <div style={{padding:"12px 16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[["$174.940","Ingreso mes",C.green],["6","Clientes",C.orange],["89%","Retención",C.blue],["1","Vencidos",C.red]].map(([v,l,col])=>(
          <div key={l} style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`}}>
            <div style={{color:col,fontWeight:900,fontSize:20}}>{v}</div>
            <div style={{color:C.muted,fontSize:12,marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`}}>
        <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Distribución de planes</div>
        {[["Básico",C.blue,2],["Premium",C.orange,3],["Elite",C.purple,1]].map(([n,col,count])=>(
          <div key={n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:col}}/>
            <span style={{color:C.text,fontSize:13,width:55}}>{n}</span>
            <div style={{flex:1,background:C.bg,borderRadius:5,height:7,overflow:"hidden"}}>
              <div style={{width:(count/6*100)+"%",height:"100%",background:col,borderRadius:5}}/>
            </div>
            <span style={{color:C.muted,fontSize:12}}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ATLETA SCREENS
const AtletaHome = ({ user, nav, logout }) => (
  <div style={{paddingBottom:20}}>
    <div style={{background:`linear-gradient(135deg,${C.orange}22,${C.card})`,padding:"20px 16px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{width:3,height:22,borderRadius:3,background:C.orange}}/>
            <span style={{color:C.text,fontSize:15,fontWeight:900}}>JUD</span>
            <span style={{color:C.orange,fontSize:8,letterSpacing:4}}>PERFORMANCE</span>
          </div>
          <div style={{color:C.muted,fontSize:12}}>Bienvenido/a,</div>
          <div style={{color:C.text,fontSize:20,fontWeight:800}}>{user?.name||"Atleta"} 👋</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{background:C.orange+"22",borderRadius:10,padding:"6px 10px"}}><span style={{color:C.orange,fontSize:12,fontWeight:700}}>🔥 12d</span></div>
          <button onClick={logout} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"7px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <I n="lock" s={13} c={C.muted}/><span style={{color:C.muted,fontSize:12,fontWeight:600}}>Salir</span>
          </button>
        </div>
      </div>
    </div>
    <div style={{padding:"16px"}}>
      <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,borderRadius:18,padding:"18px",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-15,right:-15,width:80,height:80,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,letterSpacing:1,fontWeight:600}}>PRÓXIMA SESIÓN</div>
        <div style={{color:"#fff",fontSize:18,fontWeight:900,margin:"6px 0 2px"}}>Pecho + Tríceps</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>Miércoles · 3 ejercicios</div>
        <button onClick={()=>nav("rutina")} style={{marginTop:12,background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:10,padding:"8px 16px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>▶ Ver rutina</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[["Sesiones","5","fire",C.orange],["Logros","1🏅","trophy",C.yellow],["Plan","Premium","star",C.purple],["Progreso","82%","chart",C.green]].map(([l,v,ic,col])=>(
          <div key={l} style={{background:C.card,borderRadius:14,padding:"13px",border:`1px solid ${C.border}`}}>
            <I n={ic} s={16} c={col}/><div style={{color:C.muted,fontSize:11,margin:"5px 0 2px"}}>{l}</div>
            <div style={{color:C.text,fontSize:16,fontWeight:800}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[["Mi Rutina","dumbbell","rutina",C.orange],["Progresión","chart","progresion",C.blue],["Nutrición","heart","nutricion",C.green],["Mis Logros","trophy","logros",C.yellow]].map(([l,ic,sc,col])=>(
          <button key={l} onClick={()=>nav(sc)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:34,height:34,borderRadius:10,background:col+"22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}><I n={ic} s={16} c={col}/></div>
            <div style={{color:C.text,fontWeight:700,fontSize:13}}>{l}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const AtletaRutina = ({ nav }) => {
  const [day,setDay]=useState(0);
  const rutina=[
    {day:"Lunes",focus:"Pecho + Tríceps",exs:[{name:"Press Banca",sets:4,reps:"8-10",rest:"90s"},{name:"Aperturas Cable",sets:3,reps:"12-15",rest:"60s"},{name:"Fondos",sets:3,reps:"Al fallo",rest:"60s"}]},
    {day:"Miércoles",focus:"Espalda + Bíceps",exs:[{name:"Dominadas",sets:4,reps:"6-8",rest:"90s"},{name:"Remo Barra",sets:4,reps:"8-10",rest:"90s"},{name:"Curl Mancuerna",sets:3,reps:"12",rest:"60s"}]},
    {day:"Viernes",focus:"Pierna + Core",exs:[{name:"Sentadilla",sets:4,reps:"8-10",rest:"120s"},{name:"Prensa",sets:3,reps:"12-15",rest:"90s"},{name:"Plancha",sets:3,reps:"60s",rest:"45s"}]},
  ];
  const d=rutina[day];
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Mi Rutina" sub="Semana actual" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px 0",display:"flex",gap:8,overflowX:"auto"}}>
        {rutina.map((r,i)=><button key={i} onClick={()=>setDay(i)} style={{flexShrink:0,background:day===i?C.orange:C.card,border:"none",borderRadius:10,padding:"8px 14px",color:day===i?"#fff":C.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}>{r.day}</button>)}
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{background:C.card,borderRadius:14,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:C.orange,fontWeight:700}}>{d.focus}</div><div style={{color:C.muted,fontSize:12}}>{d.exs.length} ejercicios</div></div>
        </div>
        {d.exs.map((ex,i)=>(
          <div key={i} style={{background:C.card,borderRadius:14,padding:"13px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{color:C.text,fontWeight:700}}>{ex.name}</div><div style={{color:C.muted,fontSize:12}}>{ex.sets} series · {ex.reps} · {ex.rest}</div></div>
            <div style={{width:34,height:34,borderRadius:10,background:C.orange+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="dumbbell" s={15} c={C.orange}/></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AtletaProgresion = ({ nav }) => (
  <div style={{paddingBottom:20}}>
    <Header title="Progresión de cargas" sub="Evolución por ejercicio" onHome={()=>nav("home")}/>
    <div style={{padding:"12px 16px"}}>
      {["Press Banca","Sentadilla","Dominadas"].map((ex,i)=>(
        <div key={i} style={{background:C.card,borderRadius:14,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{color:C.text,fontWeight:700,marginBottom:8}}>{ex}</div>
          <div style={{display:"flex",gap:12}}>
            {[["Inicial","60kg"],["Actual","80kg"],["Ganado","+20kg"]].map(([l,v])=>(
              <div key={l}><div style={{color:C.orange,fontWeight:800,fontSize:16}}>{v}</div><div style={{color:C.muted,fontSize:11}}>{l}</div></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AtletaNutricion = ({ nav }) => (
  <div style={{paddingBottom:20}}>
    <Header title="Mi Nutrición" sub="Plan asignado" onHome={()=>nav("home")}/>
    <div style={{padding:"12px 16px"}}>
      <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,borderRadius:14,padding:"14px",marginBottom:12}}>
        <div style={{color:"#fff",fontWeight:700,marginBottom:8}}>Plan Definición</div>
        <div style={{display:"flex",gap:16}}>
          {[["2350","Kcal"],["195g","Prot"],["240g","Carbs"],["65g","Grasas"]].map(([v,l])=>(
            <div key={l}><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{l}</div><div style={{color:"#fff",fontWeight:800,fontSize:16}}>{v}</div></div>
          ))}
        </div>
      </div>
      {[{t:"08:00",n:"Desayuno",d:"Avena 80g + 3 huevos",c:520},{t:"14:00",n:"Almuerzo",d:"Pechuga 200g + arroz 150g",c:680},{t:"20:30",n:"Cena",d:"Salmón 180g + camote 150g",c:550}].map((m,i)=>(
        <div key={i} style={{background:C.card,borderRadius:14,padding:"12px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}>
          <div style={{background:C.orange+"22",borderRadius:8,padding:"5px 9px",color:C.orange,fontSize:12,fontWeight:700,flexShrink:0}}>{m.t}</div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:700}}>{m.n}</div><div style={{color:C.muted,fontSize:12}}>{m.d}</div></div>
          <div style={{color:C.muted,fontSize:12,fontWeight:600}}>{m.c}cal</div>
        </div>
      ))}
    </div>
  </div>
);

const AtletaLogros = ({ nav }) => (
  <div style={{paddingBottom:20}}>
    <Header title="Mis Logros" sub="1/4 desbloqueados" onHome={()=>nav("home")}/>
    <div style={{padding:"12px 16px"}}>
      <div style={{background:`linear-gradient(135deg,${C.orange}22,${C.card})`,borderRadius:16,padding:"14px",marginBottom:14,border:`1px solid ${C.orange}44`}}>
        <div style={{color:C.orange,fontWeight:700,fontSize:11,letterSpacing:1,marginBottom:8}}>PRÓXIMO LOGRO</div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:32,filter:"grayscale(1)",opacity:0.4}}>💪</div>
          <div style={{flex:1}}>
            <div style={{color:C.text,fontWeight:800}}>10 sesiones</div>
            <div style={{background:C.bg,borderRadius:5,height:6,marginTop:8,overflow:"hidden"}}>
              <div style={{width:"50%",height:"100%",background:C.orange,borderRadius:5}}/>
            </div>
            <div style={{color:C.muted,fontSize:11,marginTop:4}}>5/10 sesiones</div>
          </div>
        </div>
      </div>
      <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Desbloqueados ✅</div>
      <div style={{background:C.card,borderRadius:14,padding:"14px",border:`2px solid ${C.yellow}44`,textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:32,marginBottom:6}}>🏅</div>
        <div style={{color:C.text,fontWeight:800}}>Primera sesión</div>
        <div style={{color:C.muted,fontSize:12}}>Completaste tu primer entrenamiento</div>
      </div>
      <div style={{color:C.muted,fontWeight:700,marginBottom:10}}>Por desbloquear</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[["💪","10 sesiones"],["📅","30 sesiones"],["⚡","50 sesiones"]].map(([ic,n])=>(
          <div key={n} style={{background:C.card,borderRadius:14,padding:"12px",border:`1px solid ${C.border}`,textAlign:"center",opacity:0.5}}>
            <div style={{fontSize:28,marginBottom:5,filter:"grayscale(1)"}}>{ic}</div>
            <div style={{color:C.muted,fontSize:12,fontWeight:700}}>{n}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AtletaProgreso = ({ nav }) => (
  <div style={{paddingBottom:20}}>
    <Header title="Mi Progreso" sub="Evolución corporal" onHome={()=>nav("home")}/>
    <div style={{padding:"12px 16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[["Peso","78.5 kg","-1.2kg",C.orange],["Grasa","18.4%","-0.8%",C.blue],["Músculo","38.2 kg","+0.6kg",C.green],["IMC","24.1","-0.4",C.purple]].map(([l,v,ch,col])=>(
          <div key={l} style={{background:C.card,borderRadius:14,padding:"12px",border:`1px solid ${C.border}`}}>
            <div style={{color:C.muted,fontSize:11}}>{l}</div>
            <div style={{color:C.text,fontSize:19,fontWeight:800}}>{v}</div>
            <div style={{color:col,fontSize:12,fontWeight:600}}>{ch}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <button onClick={()=>nav("progresion")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"left"}}>
          <div style={{width:32,height:32,borderRadius:9,background:C.blue+"22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7}}><I n="chart" s={15} c={C.blue}/></div>
          <div style={{color:C.text,fontWeight:700,fontSize:13}}>Ver progresión</div>
        </button>
        <button onClick={()=>nav("logros")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"left"}}>
          <div style={{width:32,height:32,borderRadius:9,background:C.yellow+"22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7}}><span style={{fontSize:16}}>🏅</span></div>
          <div style={{color:C.text,fontWeight:700,fontSize:13}}>Mis logros</div>
        </button>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
        <div><div style={{color:C.text,fontWeight:700}}>🔥 Racha</div><div style={{color:C.orange,fontSize:26,fontWeight:900}}>12 días</div></div>
        <div style={{textAlign:"right"}}><div style={{color:C.text,fontWeight:700}}>Sesiones</div><div style={{color:C.green,fontSize:26,fontWeight:900}}>5</div></div>
      </div>
    </div>
  </div>
);

const AtletaChat = ({ nav }) => {
  const [msg,setMsg]=useState("");
  const [msgs,setMsgs]=useState([
    {id:1,from:"trainer",text:"Hola! ¿Cómo te fue con la sesión de ayer? 💪",time:"09:30"},
    {id:2,from:"me",text:"Muy bien profe, pude subir 5kg en sentadilla!",time:"09:45"},
    {id:3,from:"trainer",text:"Excelente! Esta semana aumentamos el volumen en pierna.",time:"09:47"},
  ]);
  const send=()=>{
    if(!msg.trim())return;
    setMsgs(p=>[...p,{id:Date.now(),from:"me",text:msg,time:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}]);
    setMsg("");
  };
  return (
    <div style={{paddingBottom:130}}>
      {/* Header con botón home */}
      <div style={{background:C.card,padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>nav("home")} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
          <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
        </button>
        <div style={{width:36,height:36,borderRadius:11,background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:13,flexShrink:0}}>JP</div>
        <div><div style={{color:C.text,fontWeight:700}}>Juan (Tu Entrenador)</div><div style={{color:C.green,fontSize:12}}>● En línea</div></div>
      </div>
      {/* Mensajes */}
      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",background:m.from==="me"?`linear-gradient(135deg,${C.orange},${C.orangeL})`:C.card,border:m.from==="me"?"none":`1px solid ${C.border}`,borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px"}}>
              <div style={{color:"#fff",fontSize:14}}>{m.text}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginTop:4,textAlign:"right"}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Input fijo SOBRE la barra de navegación */}
      <div style={{position:"fixed",bottom:70,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.card,display:"flex",gap:8,alignItems:"center",zIndex:40}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..." style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",color:C.text,fontSize:14,outline:"none"}}/>
        <button onClick={send} style={{background:C.orange,border:"none",borderRadius:12,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><I n="send" s={17} c="#fff"/></button>
      </div>
    </div>
  );
};

// MAIN APP
export default function App({ user, onSignOut }) {
  const [screen,setScreen]=useState("home");
  const [data,setData]=useState(null);

  const nav=(sc,d=null)=>{setScreen(sc);setData(d);};
  const logout=onSignOut;

  const isTrainer=user?.role==="trainer";

  const TRAINER_TABS=[
    {id:"home",icon:"home",label:"Inicio"},
    {id:"clientes",icon:"users",label:"Clientes"},
    {id:"agenda",icon:"calendar",label:"Agenda"},
    {id:"rutinas",icon:"edit",label:"Rutinas"},
    {id:"stats",icon:"chart",label:"Stats"},
  ];
  const CLIENT_TABS=[
    {id:"home",icon:"home",label:"Inicio"},
    {id:"rutina",icon:"dumbbell",label:"Rutina"},
    {id:"progreso",icon:"chart",label:"Progreso"},
    {id:"historial",icon:"calendar",label:"Historial"},
    {id:"chat",icon:"chat",label:"Mi Profe"},
  ];
  const TABS=isTrainer?TRAINER_TABS:CLIENT_TABS;

  const renderScreen=()=>{
    if(isTrainer){
      switch(screen){
        case "home":    return <TrainerHome user={user} nav={nav} logout={logout}/>;
        case "clientes":return <ClientesScreen user={user} nav={nav}/>;
        case "cliente-detalle":return <ClienteDetalle clientId={data?.id} user={user} nav={nav}/>;
        case "cliente": return <div style={{paddingBottom:20}}><Header title={data?.name||"Cliente"} onHome={()=>nav("home")}/><div style={{padding:16}}><div style={{color:C.muted}}>Detalle de cliente</div></div></div>;
        case "agenda":  return <TrainerAgenda nav={nav}/>;
        case "rutinas": return <TrainerRutinas nav={nav}/>;
        case "stats":   return <TrainerStats nav={nav}/>;
        default:        return <TrainerHome user={user} nav={nav} logout={logout}/>;
      }
    } else {
      switch(screen){
        case "home":       return <AtletaHome user={user} nav={nav} logout={logout}/>;
        case "rutina":     return <AtletaRutina nav={nav}/>;
        case "progreso":   return <AtletaProgreso nav={nav}/>;
        case "progresion": return <AtletaProgresion nav={nav}/>;
        case "nutricion":  return <AtletaNutricion nav={nav}/>;
        case "logros":     return <AtletaLogros nav={nav}/>;
        case "historial":  return <div style={{paddingBottom:20}}><Header title="Historial" sub="Mis entrenamientos" onHome={()=>nav("home")}/><div style={{padding:16,color:C.muted}}>Pronto: historial de sesiones</div></div>;
        case "chat":       return <AtletaChat nav={nav}/>;
        default:           return <AtletaHome user={user} nav={nav} logout={logout}/>;
      }
    }
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"system-ui,-apple-system,sans-serif",position:"relative"}}>
      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}input::placeholder{color:#5A6275;}::-webkit-scrollbar{width:0;height:0;}button{font-family:inherit;}`}</style>
      <div key={screen} style={{paddingBottom:70,minHeight:"100vh"}}>
        {renderScreen()}
      </div>
      {/* Barra de navegación SIEMPRE visible */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"8px 0",zIndex:100}}>
        {TABS.map(tab=>{
          const active=screen===tab.id;
          return (
            <button key={tab.id} onClick={()=>{setScreen(tab.id);setData(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"5px 0"}}>
              <div style={{background:active?C.orange+"22":"transparent",borderRadius:9,padding:"5px 10px"}}>
                <I n={tab.icon} s={20} c={active?C.orange:C.dim}/>
              </div>
              <span style={{color:active?C.orange:C.dim,fontSize:10,fontWeight:active?700:500}}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
