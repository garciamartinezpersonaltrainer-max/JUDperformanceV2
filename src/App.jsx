import { useState, useEffect } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
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
    play:     <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    user:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[n] || null;
};

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", blue:"#4A9EFF", green:"#2ECC8E",
  red:"#FF4757", yellow:"#FFD32A", purple:"#8B5CF6",
  text:"#FFFFFF", muted:"#8891A4", dim:"#5A6275",
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ text, color=C.orange }) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{text}</span>
);

const Avatar = ({ initials, color, size=40 }) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color},${color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:size*0.35,flexShrink:0}}>{initials}</div>
);

const ProgressBar = ({ value, color=C.orange, height=6 }) => (
  <div style={{width:"100%",background:C.border,borderRadius:10,height,overflow:"hidden"}}>
    <div style={{width:`${Math.min(value,100)}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}BB)`,borderRadius:10,transition:"width 0.5s"}}/>
  </div>
);

// ─── SCREEN HEADER (con botón home en todas las pantallas internas) ───────────
const Header = ({ title, onHome, right, sub }) => (
  <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
    <button onClick={onHome} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
      <I n="home" s={14} c={C.orange}/>
      <span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
    </button>
    <div style={{flex:1}}>
      <div style={{color:C.text,fontWeight:800,fontSize:15}}>{title}</div>
      {sub && <div style={{color:C.muted,fontSize:11,marginTop:1}}>{sub}</div>}
    </div>
    {right}
  </div>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CLIENTS_DATA = [
  {id:1,name:"Carlos Mendoza",age:28,goal:"Hipertrofia",level:"Intermedio",plan:"Premium",avatar:"CM",color:"#FF6B35",weight:78,height:175,streak:21,progress:72,paid:true,lastActive:"Hace 2h",joinDate:"Ene 2024",nextSession:"Mañana 10:00"},
  {id:2,name:"María González",age:34,goal:"Pérdida de peso",level:"Principiante",plan:"Básico",avatar:"MG",color:"#4A9EFF",weight:65,height:162,streak:14,progress:58,paid:true,lastActive:"Hace 1h",joinDate:"Feb 2024",nextSession:"Miérc 09:00"},
  {id:3,name:"Diego Ramírez",age:22,goal:"Fuerza máxima",level:"Avanzado",plan:"Elite",avatar:"DR",color:"#2ECC8E",weight:88,height:183,streak:45,progress:89,paid:true,lastActive:"Hace 30m",joinDate:"Mar 2023",nextSession:"Hoy 18:00"},
  {id:4,name:"Sofía Herrera",age:31,goal:"Rendimiento deportivo",level:"Intermedio",plan:"Premium",avatar:"SH",color:"#8B5CF6",weight:58,height:168,streak:7,progress:64,paid:false,lastActive:"Hace 3h",joinDate:"Dic 2023",nextSession:"Juev 07:00"},
  {id:5,name:"Andrés Castillo",age:45,goal:"Recondicionar",level:"Principiante",plan:"Básico",avatar:"AC",color:"#FFD32A",weight:95,height:178,streak:3,progress:22,paid:true,lastActive:"Ayer",joinDate:"Abr 2024",nextSession:"Vier 11:00"},
  {id:6,name:"Valentina López",age:26,goal:"Hipertrofia",level:"Intermedio",plan:"Premium",avatar:"VL",color:"#FF4757",weight:55,height:165,streak:18,progress:67,paid:true,lastActive:"Hace 5h",joinDate:"Mar 2024",nextSession:"Lun 08:00"},
];

const DB = {
  clients: [...CLIENTS_DATA],
  sessions: [
    {id:1,date:"2024-05-20",focus:"Pecho + Tríceps",duration:52,exercises:[
      {name:"Press Banca",sets:[{reps:10,kg:60},{reps:9,kg:60},{reps:8,kg:65}]},
      {name:"Aperturas",sets:[{reps:15,kg:20},{reps:14,kg:20},{reps:12,kg:22}]},
    ]},
    {id:2,date:"2024-05-22",focus:"Espalda + Bíceps",duration:58,exercises:[
      {name:"Dominadas",sets:[{reps:8,kg:0},{reps:7,kg:0},{reps:6,kg:0}]},
      {name:"Remo Barra",sets:[{reps:10,kg:70},{reps:10,kg:70},{reps:9,kg:75}]},
    ]},
    {id:3,date:"2024-05-24",focus:"Pierna + Core",duration:65,exercises:[
      {name:"Sentadilla",sets:[{reps:10,kg:80},{reps:9,kg:85},{reps:8,kg:90}]},
      {name:"Prensa",sets:[{reps:15,kg:120},{reps:14,kg:130}]},
    ]},
  ],
  calendar:[
    {day:0,clientName:"Carlos M.",time:"10:00",type:"Presencial"},
    {day:2,clientName:"María G.",time:"09:00",type:"Online"},
    {day:3,clientName:"Diego R.",time:"18:00",type:"Presencial"},
    {day:4,clientName:"Sofía H.",time:"07:00",type:"Online"},
  ],
  templates:[
    {id:1,name:"Fullbody 3x/semana",days:3,focus:"Fuerza general",exercises:9,clients:3},
    {id:2,name:"PPL 6 días",days:6,focus:"Hipertrofia",exercises:18,clients:2},
    {id:3,name:"Pierna & Glúteo",days:2,focus:"Glúteos",exercises:8,clients:4},
  ],
};

const LOGROS = [
  {id:"first",icon:"🏅",name:"Primera sesión",req:1,color:C.yellow},
  {id:"ten",icon:"💪",name:"10 sesiones",req:10,color:C.blue},
  {id:"month",icon:"📅",name:"30 sesiones",req:30,color:C.green},
  {id:"fifty",icon:"⚡",name:"50 sesiones",req:50,color:C.purple},
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ENTRENADOR SCREENS ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const TrainerHome = ({ user, nav, signOut }) => {
  const revenue = DB.clients.filter(c=>c.paid).length * 34990;
  return (
    <div style={{paddingBottom:20}}>
      {/* Top bar */}
      <div style={{background:`linear-gradient(135deg,${C.orange}22,${C.card})`,padding:"20px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:3,height:24,borderRadius:3,background:C.orange}}/>
              <span style={{color:C.text,fontSize:16,fontWeight:900,letterSpacing:-0.5}}>JUD</span>
              <span style={{color:C.orange,fontSize:8,letterSpacing:4}}>PERFORMANCE</span>
            </div>
            <div style={{color:C.muted,fontSize:12}}>Buenos días,</div>
            <div style={{color:C.text,fontSize:20,fontWeight:800}}>{user?.name||"Juan"} 👋</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:10,cursor:"pointer",position:"relative"}}>
              <I n="bell" s={18} c={C.muted}/>
              <span style={{position:"absolute",top:6,right:6,width:7,height:7,background:C.orange,borderRadius:"50%"}}/>
            </button>
            <button onClick={signOut} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <I n="lock" s={13} c={C.muted}/>
              <span style={{color:C.muted,fontSize:12,fontWeight:600}}>Salir</span>
            </button>
          </div>
        </div>
        {/* Stats row */}
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {[
            ["Clientes",DB.clients.length,"users",C.orange],
            ["Ingresos",`$${Math.round(revenue/1000)}K`,"credit",C.green],
            ["Sesiones","47","calendar",C.blue],
            ["Adherencia","86%","chart",C.purple],
          ].map(([l,v,icon,col])=>(
            <div key={l} style={{background:C.card,borderRadius:14,padding:"12px 14px",flexShrink:0,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <I n={icon} s={14} c={col}/>
                <span style={{color:C.muted,fontSize:11}}>{l}</span>
              </div>
              <div style={{color:C.text,fontWeight:800,fontSize:18}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"16px"}}>
        {/* Quick actions */}
        <div style={{color:C.text,fontWeight:700,marginBottom:12,fontSize:15}}>Acciones rápidas</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[
            ["Nuevo Cliente","users",C.orange,"nuevo-cliente"],
            ["Nueva Rutina","dumbbell",C.blue,"plantillas"],
            ["Calendario","calendar",C.green,"calendario"],
            ["Estadísticas","chart",C.purple,"estadisticas"],
          ].map(([l,icon,col,sc])=>(
            <button key={l} onClick={()=>nav(sc)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px",cursor:"pointer",textAlign:"left"}}>
              <div style={{background:col+"22",borderRadius:10,padding:8,display:"inline-flex",marginBottom:8}}><I n={icon} s={18} c={col}/></div>
              <div style={{color:C.text,fontWeight:700,fontSize:13}}>{l}</div>
            </button>
          ))}
        </div>

        {/* Clients preview */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{color:C.text,fontWeight:700,fontSize:15}}>Clientes recientes</div>
          <button onClick={()=>nav("clientes")} style={{background:"none",border:"none",color:C.orange,fontSize:13,fontWeight:600,cursor:"pointer"}}>Ver todos →</button>
        </div>
        {DB.clients.slice(0,4).map(c=>(
          <div key={c.id} onClick={()=>nav("cliente-detalle",c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <Avatar initials={c.avatar} color={c.color} size={44}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:C.text,fontWeight:700}}>{c.name}</span>
                <Badge text={c.plan} color={c.plan==="Elite"?C.purple:c.plan==="Premium"?C.orange:C.blue}/>
              </div>
              <div style={{color:C.muted,fontSize:12,marginBottom:6}}>{c.goal} · {c.lastActive}</div>
              <ProgressBar value={c.progress} color={c.color}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainerClientes = ({ nav }) => {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("Todos");
  const filtered=DB.clients.filter(c=>{
    const ms=c.name.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="Todos"||c.plan===filter||(filter==="Vencido"&&!c.paid);
    return ms&&mf;
  });
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Clientes" sub={`${DB.clients.length} activos`} onHome={()=>nav("home")}
        right={<button onClick={()=>nav("nuevo-cliente")} style={{background:C.orange,border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><I n="plus" s={14} c="#fff"/>Nuevo</button>}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <I n="search" s={16} c={C.muted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..." style={{background:"none",border:"none",color:C.text,fontSize:14,outline:"none",flex:1}}/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto"}}>
          {["Todos","Premium","Elite","Básico","Vencido"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{flexShrink:0,background:filter===f?C.orange:C.card,border:"none",borderRadius:10,padding:"6px 14px",color:filter===f?"#fff":C.muted,fontWeight:600,fontSize:12,cursor:"pointer"}}>{f}</button>
          ))}
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:8}}>{filtered.length} clientes</div>
        {filtered.map(c=>(
          <div key={c.id} onClick={()=>nav("cliente-detalle",c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px",marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <Avatar initials={c.avatar} color={c.color} size={44}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:C.text,fontWeight:800}}>{c.name}</span>
                  <div style={{display:"flex",gap:4}}>
                    <Badge text={c.plan} color={c.plan==="Elite"?C.purple:c.plan==="Premium"?C.orange:C.blue}/>
                    {!c.paid&&<Badge text="Vencido" color={C.red}/>}
                  </div>
                </div>
                <div style={{color:C.muted,fontSize:12}}>{c.goal} · {c.level}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1}}><ProgressBar value={c.progress} color={c.color}/></div>
              <span style={{color:C.muted,fontSize:11}}>{c.progress}%</span>
              <span style={{color:C.muted,fontSize:11}}>{c.lastActive}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainerClienteDetalle = ({ client, nav }) => {
  const [tab,setTab]=useState("resumen");
  if(!client) return null;
  const tabs=["resumen","rutina","progreso","pagos"];
  return (
    <div style={{paddingBottom:20}}>
      <div style={{background:`linear-gradient(160deg,${client.color}33,${C.card})`,padding:"16px 16px 0",borderBottom:`1px solid ${C.border}`}}>
        <button onClick={()=>nav("clientes")} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,display:"flex",alignItems:"center",gap:6,fontSize:13,marginBottom:12}}>
          <I n="back" s={16} c={C.muted}/> Volver
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <Avatar initials={client.avatar} color={client.color} size={56}/>
          <div>
            <div style={{color:C.text,fontWeight:800,fontSize:18}}>{client.name}</div>
            <div style={{color:C.muted,fontSize:13}}>{client.goal} · {client.level}</div>
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <Badge text={client.plan} color={client.plan==="Elite"?C.purple:client.plan==="Premium"?C.orange:C.blue}/>
              <Badge text={client.paid?"Al día":"Pendiente"} color={client.paid?C.green:C.red}/>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto"}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===t?client.color:"transparent"}`,color:tab===t?client.color:C.muted,cursor:"pointer",padding:"10px 14px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px"}}>
        {tab==="resumen"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[["⚡",`${client.streak}d racha`,client.color],["⚖️",`${client.weight}kg`,C.blue],["📏",`${client.height}cm`,C.green],["📅",client.joinDate,C.purple]].map(([icon,val,col],i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px"}}>
                  <div style={{fontSize:20}}>{icon}</div>
                  <div style={{color:col,fontWeight:800,fontSize:17,marginTop:6}}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:C.text,fontWeight:700}}>Progreso</span>
                <span style={{color:client.color,fontWeight:800}}>{client.progress}%</span>
              </div>
              <ProgressBar value={client.progress} color={client.color} height={10}/>
              <div style={{color:C.muted,fontSize:12,marginTop:6}}>Próxima sesión: {client.nextSession}</div>
            </div>
          </div>
        )}
        {tab==="rutina"&&(
          <div>
            {["Lunes - Pecho & Tríceps","Miércoles - Espalda & Bíceps","Viernes - Piernas"].map((d,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",marginBottom:10}}>
                <div style={{color:C.text,fontWeight:700}}>{d}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:4}}>4 ejercicios · ~60 min</div>
              </div>
            ))}
          </div>
        )}
        {tab==="progreso"&&(
          <div>
            {[["Peso corporal","78→75 kg","-3kg",C.green],["Bench Press","60→80 kg","+20kg",C.blue],["Adherencia","86%","5/6 ses.",C.orange]].map(([l,v,sub,col])=>(
              <div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",marginBottom:10,display:"flex",gap:12,alignItems:"center"}}>
                <div style={{background:col+"22",borderRadius:10,padding:10,flexShrink:0}}><I n="chart" s={20} c={col}/></div>
                <div><div style={{color:C.text,fontWeight:700}}>{l}</div><div style={{color:col,fontWeight:800,fontSize:16}}>{v}</div><div style={{color:C.muted,fontSize:12}}>{sub}</div></div>
              </div>
            ))}
          </div>
        )}
        {tab==="pagos"&&(
          <div>
            <div style={{background:client.paid?C.green+"22":C.red+"22",border:`1px solid ${client.paid?C.green:C.red}44`,borderRadius:14,padding:"14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
              <I n={client.paid?"check":"x"} s={20} c={client.paid?C.green:C.red}/>
              <div>
                <div style={{color:client.paid?C.green:C.red,fontWeight:700}}>{client.paid?"Pago al día":"Pago pendiente"}</div>
                <div style={{color:C.muted,fontSize:12}}>Plan {client.plan} · $34.990/mes</div>
              </div>
            </div>
            {["Mayo 2024","Abril 2024","Marzo 2024"].map((m,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between"}}>
                <div style={{color:C.text,fontWeight:600}}>{m}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:C.text,fontWeight:700}}>$34.990</span>
                  <Badge text={i===0&&!client.paid?"Pendiente":"Pagado"} color={i===0&&!client.paid?C.red:C.green}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TrainerCalendario = ({ nav }) => {
  const dias=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const [sel,setSel]=useState(0);
  const events=DB.calendar.filter(e=>e.day===sel);
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Calendario" sub="Semana actual" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px 0",display:"flex",gap:6,overflowX:"auto"}}>
        {dias.map((d,i)=>(
          <button key={i} onClick={()=>setSel(i)} style={{flexShrink:0,background:sel===i?C.blue:C.card,border:"none",borderRadius:12,padding:"10px 12px",cursor:"pointer",textAlign:"center",minWidth:48,position:"relative"}}>
            <div style={{color:sel===i?"#fff":C.muted,fontSize:11,fontWeight:600}}>{d}</div>
            {DB.calendar.some(e=>e.day===i)&&<div style={{width:5,height:5,borderRadius:"50%",background:sel===i?"rgba(255,255,255,0.8)":C.orange,margin:"5px auto 0"}}/>}
          </button>
        ))}
      </div>
      <div style={{padding:"12px 16px"}}>
        {events.length===0?(
          <div style={{background:C.card,borderRadius:18,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:40,marginBottom:10}}>📭</div>
            <div style={{color:C.muted}}>Sin sesiones este día</div>
          </div>
        ):events.map((ev,i)=>(
          <div key={i} style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{background:C.blue+"22",borderRadius:10,padding:"8px 12px",color:C.blue,fontWeight:800}}>{ev.time}</div>
            <div>
              <div style={{color:C.text,fontWeight:700}}>{ev.clientName}</div>
              <Badge text={ev.type} color={ev.type==="Online"?C.green:C.orange}/>
            </div>
          </div>
        ))}
        <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,marginTop:8,display:"flex",gap:20}}>
          {[[DB.calendar.length,"Sesiones",C.blue],[DB.calendar.filter(e=>e.type==="Online").length,"Online",C.green],[DB.calendar.filter(e=>e.type==="Presencial").length,"Presencial",C.orange]].map(([v,l,col])=>(
            <div key={l}><div style={{color:col,fontWeight:900,fontSize:20}}>{v}</div><div style={{color:C.muted,fontSize:11}}>{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TrainerPlantillas = ({ nav }) => {
  const [tpls,setTpls]=useState(DB.templates);
  const [nombre,setNombre]=useState("");
  const [show,setShow]=useState(false);
  const add=()=>{
    if(!nombre.trim())return;
    const t={id:Date.now(),name:nombre,days:3,focus:"Por definir",exercises:0,clients:0};
    DB.templates.push(t);setTpls([...DB.templates]);setNombre("");setShow(false);
  };
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Plantillas" sub="Rutinas guardadas" onHome={()=>nav("home")}
        right={<button onClick={()=>setShow(!show)} style={{background:C.orange,border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><I n="plus" s={14} c="#fff"/>Nueva</button>}/>
      <div style={{padding:"12px 16px"}}>
        {show&&(
          <div style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:12,border:`1px solid ${C.orange}44`}}>
            <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre de la plantilla..." style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={add} style={{flex:1,background:C.orange,border:"none",borderRadius:10,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer"}}>Crear</button>
              <button onClick={()=>setShow(false)} style={{flex:1,background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px",color:C.muted,cursor:"pointer"}}>Cancelar</button>
            </div>
          </div>
        )}
        {tpls.map((t,i)=>(
          <div key={i} style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <div style={{color:C.text,fontWeight:800}}>{t.name}</div>
                <div style={{color:C.muted,fontSize:12}}>{t.focus}</div>
              </div>
              <button style={{background:C.orange+"22",border:"none",borderRadius:8,padding:"5px 10px",color:C.orange,fontWeight:700,fontSize:12,cursor:"pointer"}}>Usar</button>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[[t.days+"d","Días"],[t.exercises,"Ejercicios"],[t.clients,"Clientes"]].map(([v,l])=>(
                <div key={l}><span style={{color:C.text,fontWeight:700}}>{v} </span><span style={{color:C.muted,fontSize:12}}>{l}</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainerStats = ({ nav }) => {
  const meses=["Ene","Feb","Mar","Abr","May","Jun"];
  const ing=[89970,124960,144960,159950,174940,174940];
  const maxI=Math.max(...ing);
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Estadísticas" sub="Panel de negocio" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[["$174.940","Ingreso mensual",C.green],["6","Clientes activos",C.orange],["89%","Retención",C.blue],["1","Pagos vencidos",C.red]].map(([v,l,col])=>(
            <div key={l} style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`}}>
              <div style={{color:col,fontWeight:900,fontSize:20}}>{v}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:18,padding:"14px",marginBottom:12,border:`1px solid ${C.border}`}}>
          <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Ingresos mensuales</div>
          <svg viewBox="0 0 300 100" width="100%">
            <path d={"M 0,100 "+ing.map((v,i)=>`${i*60},${100-(v/maxI)*90}`).join(" L ")+" L 300,100 Z"} fill={C.green+"22"}/>
            <polyline points={ing.map((v,i)=>`${i*60},${100-(v/maxI)*90}`).join(" ")} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {ing.map((v,i)=>(
              <g key={i}>
                <circle cx={i*60} cy={100-(v/maxI)*90} r="4" fill={C.green} stroke={C.card} strokeWidth="2"/>
                <text x={i*60} y="118" fill={C.dim} fontSize="9" textAnchor="middle">{meses[i]}</text>
              </g>
            ))}
          </svg>
        </div>
        <div style={{background:C.card,borderRadius:16,padding:"14px",border:`1px solid ${C.border}`}}>
          <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Distribución de planes</div>
          {[["Básico",C.blue,DB.clients.filter(c=>c.plan==="Básico").length],["Premium",C.orange,DB.clients.filter(c=>c.plan==="Premium").length],["Elite",C.purple,DB.clients.filter(c=>c.plan==="Elite").length]].map(([n,col,count])=>(
            <div key={n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:col}}/>
              <span style={{color:C.text,fontSize:13,width:55}}>{n}</span>
              <div style={{flex:1,background:C.bg,borderRadius:6,height:7,overflow:"hidden"}}>
                <div style={{width:(count/DB.clients.length*100)+"%",height:"100%",background:col,borderRadius:6}}/>
              </div>
              <span style={{color:C.muted,fontSize:12}}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NuevoCliente = ({ nav }) => {
  const [form,setForm]=useState({name:"",age:"",goal:"Hipertrofia",level:"Principiante",plan:"Básico",weight:"",height:"",phone:""});
  const [saved,setSaved]=useState(false);
  const goals=["Hipertrofia","Pérdida de peso","Fuerza máxima","Recondicionar","Mantenimiento"];
  const save=()=>{
    if(!form.name.trim())return;
    const colors=["#FF6B35","#4A9EFF","#2ECC8E","#8B5CF6","#FFD32A"];
    const color=colors[Math.floor(Math.random()*colors.length)];
    const initials=form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    DB.clients.push({id:Date.now(),...form,avatar:initials,color,streak:0,progress:0,paid:false,lastActive:"Ahora",joinDate:new Date().toLocaleDateString("es-CL",{month:"short",year:"numeric"}),nextSession:"Por definir"});
    setSaved(true);setTimeout(()=>nav("clientes"),1000);
  };
  if(saved) return <div style={{padding:"60px 20px",textAlign:"center"}}><div style={{fontSize:60}}>✅</div><h2 style={{color:C.text,marginTop:16}}>Cliente guardado</h2></div>;
  const inp={width:"100%",background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box"};
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Nuevo Cliente" onHome={()=>nav("home")}/>
      <div style={{padding:"16px"}}>
        <div style={{marginBottom:14}}><label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Nombre *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ej: Carlos Mendoza" style={inp}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div><label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Edad</label><input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="28" style={inp}/></div>
          <div><label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Teléfono</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+56 9..." style={inp}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div><label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Peso kg</label><input type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="75" style={inp}/></div>
          <div><label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>Talla cm</label><input type="number" value={form.height} onChange={e=>setForm({...form,height:e.target.value})} placeholder="175" style={inp}/></div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Objetivo</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {goals.map(g=><button key={g} onClick={()=>setForm({...form,goal:g})} style={{background:form.goal===g?C.orange:C.card,border:"none",borderRadius:10,padding:"7px 12px",color:form.goal===g?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{g}</button>)}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Nivel</label>
          <div style={{display:"flex",gap:8}}>
            {["Principiante","Intermedio","Avanzado"].map(l=><button key={l} onClick={()=>setForm({...form,level:l})} style={{flex:1,background:form.level===l?C.blue:C.card,border:"none",borderRadius:10,padding:"10px",color:form.level===l?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{color:C.muted,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>Plan</label>
          <div style={{display:"flex",gap:8}}>
            {["Básico","Premium","Elite"].map(p=><button key={p} onClick={()=>setForm({...form,plan:p})} style={{flex:1,background:form.plan===p?C.purple:C.card,border:"none",borderRadius:10,padding:"10px",color:form.plan===p?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{p}</button>)}
          </div>
        </div>
        <button onClick={save} style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:14,padding:"15px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>Crear Cliente</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ATLETA SCREENS ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const AtletaHome = ({ user, nav, signOut }) => {
  const total=DB.sessions.length;
  const logros=LOGROS.filter(l=>total>=l.req);
  return (
    <div style={{paddingBottom:20}}>
      <div style={{background:`linear-gradient(135deg,${C.orange}22,${C.card})`,padding:"20px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:3,height:24,borderRadius:3,background:C.orange}}/>
              <span style={{color:C.text,fontSize:16,fontWeight:900,letterSpacing:-0.5}}>JUD</span>
              <span style={{color:C.orange,fontSize:8,letterSpacing:4}}>PERFORMANCE</span>
            </div>
            <div style={{color:C.muted,fontSize:12}}>Bienvenido/a,</div>
            <div style={{color:C.text,fontSize:20,fontWeight:800}}>{user?.name||"Atleta"} 👋</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:C.orange+"22",borderRadius:10,padding:"6px 10px"}}><span style={{color:C.orange,fontSize:12,fontWeight:700}}>🔥 12d</span></div>
            <button onClick={signOut} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"7px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <I n="lock" s={13} c={C.muted}/><span style={{color:C.muted,fontSize:12,fontWeight:600}}>Salir</span>
            </button>
          </div>
        </div>
      </div>
      <div style={{padding:"16px"}}>
        {/* Próxima sesión banner */}
        <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,borderRadius:18,padding:"18px",marginBottom:16,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-15,right:-15,width:80,height:80,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,letterSpacing:1,fontWeight:600}}>PRÓXIMA SESIÓN</div>
          <div style={{color:"#fff",fontSize:18,fontWeight:900,margin:"6px 0 2px"}}>Pecho + Tríceps</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>Miércoles · 3 ejercicios · ~55 min</div>
          <button onClick={()=>nav("sesion")} style={{marginTop:12,background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:10,padding:"8px 16px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>
            ▶ Iniciar sesión
          </button>
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[["Sesiones",total,C.orange,"fire"],["Logros",`${logros.length}🏅`,C.yellow,"trophy"],["Mi plan","Premium",C.purple,"star"],["Progreso","82%",C.green,"chart"]].map(([l,v,col,ic])=>(
            <div key={l} style={{background:C.card,borderRadius:14,padding:"13px",border:`1px solid ${C.border}`}}>
              <I n={ic} s={16} c={col}/>
              <div style={{color:C.muted,fontSize:11,margin:"5px 0 2px"}}>{l}</div>
              <div style={{color:C.text,fontSize:16,fontWeight:800}}>{v}</div>
            </div>
          ))}
        </div>
        {/* Quick nav */}
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
};

const AtletaRutina = ({ nav }) => {
  const routine=[
    {day:"Lunes",focus:"Pecho + Tríceps",exs:[{name:"Press Banca",sets:4,reps:"8-10",rest:"90s"},{name:"Aperturas Cable",sets:3,reps:"12-15",rest:"60s"},{name:"Fondos",sets:3,reps:"Al fallo",rest:"60s"}]},
    {day:"Miércoles",focus:"Espalda + Bíceps",exs:[{name:"Dominadas",sets:4,reps:"6-8",rest:"90s"},{name:"Remo Barra",sets:4,reps:"8-10",rest:"90s"},{name:"Curl Mancuerna",sets:3,reps:"12",rest:"60s"}]},
    {day:"Viernes",focus:"Pierna + Core",exs:[{name:"Sentadilla",sets:4,reps:"8-10",rest:"120s"},{name:"Prensa",sets:3,reps:"12-15",rest:"90s"},{name:"Plancha",sets:3,reps:"60s",rest:"45s"}]},
  ];
  const [day,setDay]=useState(0);
  const d=routine[day];
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Mi Rutina" sub="Semana actual" onHome={()=>nav("home")}
        right={<button onClick={()=>nav("sesion")} style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer"}}>▶ Iniciar</button>}/>
      <div style={{padding:"12px 16px 0",display:"flex",gap:8,overflowX:"auto"}}>
        {routine.map((r,i)=>(
          <button key={i} onClick={()=>setDay(i)} style={{flexShrink:0,background:day===i?C.orange:C.card,border:"none",borderRadius:10,padding:"8px 14px",color:day===i?"#fff":C.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}>{r.day}</button>
        ))}
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{background:C.card,borderRadius:14,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{color:C.orange,fontWeight:700}}>{d.focus}</div>
            <div style={{color:C.muted,fontSize:12}}>{d.exs.length} ejercicios</div>
          </div>
          <button onClick={()=>nav("historial")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer"}}>Historial →</button>
        </div>
        {d.exs.map((ex,i)=>(
          <div key={i} style={{background:C.card,borderRadius:14,padding:"13px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:C.text,fontWeight:700}}>{ex.name}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:3}}>{ex.sets} series · {ex.reps} reps · {ex.rest}</div>
            </div>
            <div style={{width:34,height:34,borderRadius:10,background:C.orange+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="dumbbell" s={15} c={C.orange}/></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AtletaSesion = ({ nav }) => {
  const RUTS=[
    {name:"Press Banca",sets:4,repsT:"8-10",kgP:65},
    {name:"Aperturas Cable",sets:3,repsT:"12-15",kgP:22},
    {name:"Fondos",sets:3,repsT:"Al fallo",kgP:0},
  ];
  const [exs,setExs]=useState(RUTS.map(ex=>({...ex,logs:Array.from({length:ex.sets},()=>({reps:"",kg:ex.kgP||"",done:false}))})));
  const [start]=useState(Date.now());
  const [elapsed,setElapsed]=useState(0);
  const [rest,setRest]=useState(0);
  const [done,setDone]=useState(false);
  useEffect(()=>{const t=setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{if(rest>0){const t=setTimeout(()=>setRest(r=>r-1),1000);return()=>clearTimeout(t);}},[rest]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const upd=(ei,si,f,v)=>setExs(prev=>prev.map((ex,i)=>i===ei?{...ex,logs:ex.logs.map((l,j)=>j===si?{...l,[f]:v}:l)}:ex));
  const check=(ei,si)=>{upd(ei,si,"done",!exs[ei].logs[si].done);setRest(90);};
  const total=exs.reduce((a,e)=>a+e.logs.length,0);
  const done2=exs.reduce((a,e)=>a+e.logs.filter(l=>l.done).length,0);
  const pct=Math.round((done2/total)*100);
  const finish=()=>{DB.sessions.unshift({id:Date.now(),date:new Date().toISOString().split("T")[0],focus:"Pecho + Tríceps",duration:Math.floor(elapsed/60),exercises:exs.map(ex=>({name:ex.name,sets:ex.logs.filter(l=>l.done).map(l=>({reps:parseInt(l.reps)||0,kg:parseFloat(l.kg)||0}))}))});setDone(true);};
  if(done) return (
    <div style={{padding:"40px 20px",textAlign:"center",background:C.bg,minHeight:"100vh"}}>
      <div style={{fontSize:64}}>🎉</div>
      <h2 style={{color:C.text,fontSize:26,fontWeight:900,margin:"14px 0 8px"}}>¡Sesión completada!</h2>
      <p style={{color:C.muted}}>Duración: {fmt(elapsed)} · {done2}/{total} series</p>
      <button onClick={()=>nav("home")} style={{marginTop:24,background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:14,padding:"14px 32px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",width:"100%"}}>Volver al inicio 🏠</button>
      <button onClick={()=>nav("logros")} style={{marginTop:10,background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 32px",color:C.text,fontWeight:700,fontSize:15,cursor:"pointer",width:"100%"}}>Ver mis logros 🏅</button>
    </div>
  );
  return (
    <div style={{paddingBottom:100,background:C.bg,minHeight:"100vh"}}>
      <div style={{background:C.card,padding:"14px 16px",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{color:C.text,fontWeight:800}}>Pecho + Tríceps</div>
            <div style={{color:C.orange,fontWeight:700,fontSize:20}}>{fmt(elapsed)}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {rest>0&&<div style={{background:C.orange+"22",borderRadius:10,padding:"6px 10px",textAlign:"center"}}><div style={{color:C.orange,fontWeight:900,fontSize:16}}>{rest}s</div><div style={{color:C.muted,fontSize:10}}>Descanso</div></div>}
            <button onClick={()=>nav("home")} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 10px",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontSize:11,fontWeight:700}}>Inicio</span></button>
          </div>
        </div>
        <div style={{background:C.bg,borderRadius:6,height:6,overflow:"hidden"}}>
          <div style={{width:pct+"%",height:"100%",background:`linear-gradient(90deg,${C.orange},${C.orangeL})`,borderRadius:6,transition:"width 0.4s"}}/>
        </div>
        <div style={{color:C.muted,fontSize:11,marginTop:4}}>{done2}/{total} series · {pct}%</div>
      </div>
      <div style={{padding:"12px"}}>
        {exs.map((ex,ei)=>(
          <div key={ei} style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:12,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{color:C.text,fontWeight:800}}>{ex.name}</div>
              <div style={{color:C.muted,fontSize:12}}>{ex.repsT} reps</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 42px",gap:5,marginBottom:5}}>
              {["Set","Kg","Reps","✓"].map(h=><div key={h} style={{color:C.dim,fontSize:11,textAlign:"center"}}>{h}</div>)}
            </div>
            {ex.logs.map((lg,si)=>(
              <div key={si} style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 42px",gap:5,marginBottom:5,alignItems:"center",opacity:lg.done?0.5:1}}>
                <div style={{color:C.muted,fontSize:13,fontWeight:600,textAlign:"center"}}>{si+1}</div>
                <input type="number" inputMode="decimal" value={lg.kg} onChange={e=>upd(ei,si,"kg",e.target.value)} placeholder={ex.kgP||"0"} style={{background:lg.done?C.bg:C.card2,border:`1px solid ${lg.done?C.border:C.orange+"44"}`,borderRadius:8,padding:"7px",color:C.text,fontSize:14,textAlign:"center",outline:"none",width:"100%"}}/>
                <input type="number" inputMode="numeric" value={lg.reps} onChange={e=>upd(ei,si,"reps",e.target.value)} placeholder="0" style={{background:lg.done?C.bg:C.card2,border:`1px solid ${lg.done?C.border:C.orange+"44"}`,borderRadius:8,padding:"7px",color:C.text,fontSize:14,textAlign:"center",outline:"none",width:"100%"}}/>
                <button onClick={()=>check(ei,si)} style={{width:42,height:42,borderRadius:10,background:lg.done?C.green:C.bg,border:`2px solid ${lg.done?C.green:C.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                  <I n="check" s={15} c={lg.done?"#fff":C.dim}/>
                </button>
              </div>
            ))}
          </div>
        ))}
        {done2>=total*0.8&&<button onClick={finish} style={{width:"100%",background:`linear-gradient(135deg,${C.green},#27ae60)`,border:"none",borderRadius:16,padding:"16px",color:"#fff",fontWeight:900,fontSize:16,cursor:"pointer"}}>🎉 Finalizar sesión</button>}
      </div>
    </div>
  );
};

const AtletaHistorial = ({ nav }) => {
  const [sel,setSel]=useState(null);
  if(sel!==null){
    const s=DB.sessions[sel];
    const vol=s.exercises.reduce((a,ex)=>a+ex.sets.reduce((b,st)=>b+(st.kg*st.reps||0),0),0);
    return (
      <div style={{paddingBottom:20}}>
        <Header title={s.focus} sub={`${s.date} · ${s.duration} min`} onHome={()=>setSel(null)}/>
        <div style={{padding:"12px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[[s.duration+"min","Duración"],[s.exercises.reduce((a,e)=>a+e.sets.length,0),"Series"],[Math.round(vol/100)/10+"t","Volumen"]].map(([v,l])=>(
              <div key={l} style={{background:C.card,borderRadius:12,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                <div style={{color:C.orange,fontWeight:900,fontSize:17}}>{v}</div>
                <div style={{color:C.muted,fontSize:11}}>{l}</div>
              </div>
            ))}
          </div>
          {s.exercises.map((ex,i)=>(
            <div key={i} style={{background:C.card,borderRadius:14,padding:"12px",marginBottom:8,border:`1px solid ${C.border}`}}>
              <div style={{color:C.text,fontWeight:700,marginBottom:6}}>{ex.name}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {ex.sets.map((st,j)=>(
                  <div key={j} style={{background:C.bg,borderRadius:7,padding:"5px 9px",fontSize:12}}>
                    <span style={{color:C.muted}}>S{j+1} </span>
                    <span style={{color:C.text,fontWeight:700}}>{st.kg>0?st.kg+"kg":"PC"}</span>
                    <span style={{color:C.muted}}> × </span>
                    <span style={{color:C.orange,fontWeight:700}}>{st.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Historial" sub={`${DB.sessions.length} sesiones registradas`} onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:16,marginBottom:14}}>
          {[[DB.sessions.length,"Sesiones"],[DB.sessions.reduce((a,s)=>a+s.duration,0),"Min totales"],[DB.sessions.reduce((a,s)=>a+s.exercises.reduce((b,e)=>b+e.sets.length,0),0),"Series"]].map(([v,l])=>(
            <div key={l}><div style={{color:C.text,fontWeight:900,fontSize:18}}>{v}</div><div style={{color:C.muted,fontSize:11}}>{l}</div></div>
          ))}
        </div>
        {DB.sessions.map((s,i)=>(
          <div key={i} onClick={()=>setSel(i)} style={{background:C.card,borderRadius:14,padding:"13px",marginBottom:8,border:`1px solid ${C.border}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:12,background:C.orange+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="dumbbell" s={18} c={C.orange}/></div>
              <div>
                <div style={{color:C.text,fontWeight:700}}>{s.focus}</div>
                <div style={{color:C.muted,fontSize:12}}>{s.date} · {s.duration} min</div>
              </div>
            </div>
            <I n="arrow" s={15} c={C.dim}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const AtletaProgresion = ({ nav }) => {
  const exs=["Press Banca","Sentadilla","Remo Barra","Dominadas"];
  const [ex,setEx]=useState("Press Banca");
  const data=DB.sessions.flatMap(s=>s.exercises.filter(e=>e.name===ex).map(e=>({date:s.date,maxKg:Math.max(...e.sets.map(st=>st.kg||0))}))).sort((a,b)=>a.date.localeCompare(b.date));
  const maxKg=Math.max(...data.map(d=>d.maxKg),1);
  const W=300,H=100;
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Progresión de cargas" sub="Evolución por ejercicio" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:14}}>
          {exs.map(e=><button key={e} onClick={()=>setEx(e)} style={{flexShrink:0,background:ex===e?C.orange:C.card,border:"none",borderRadius:10,padding:"7px 12px",color:ex===e?"#fff":C.muted,fontWeight:700,fontSize:12,cursor:"pointer"}}>{e}</button>)}
        </div>
        {data.length===0?(
          <div style={{background:C.card,borderRadius:16,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:40}}>📊</div>
            <div style={{color:C.muted,marginTop:10}}>Sin datos aún. Registra sesiones para ver tu progresión.</div>
          </div>
        ):(
          <>
            <div style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:12,border:`1px solid ${C.border}`}}>
              <div style={{color:C.text,fontWeight:700,marginBottom:10}}>{ex} — kg máximo</div>
              <svg viewBox={`0 0 ${W} ${H+28}`} width="100%">
                {[0,0.5,1].map(p=><line key={p} x1={20} y1={H*(1-p)} x2={W} y2={H*(1-p)} stroke={C.border} strokeWidth="1"/>)}
                {data.length>1&&<path d={"M "+data.map((d,i)=>`${20+i*(W-20)/(data.length-1)},${H-(d.maxKg/maxKg)*H}`).join(" L ")+" L "+(20+(data.length-1)*(W-20)/(data.length-1))+","+H+" L 20,"+H+" Z"} fill={C.orange+"22"}/>}
                {data.length>1&&<polyline points={data.map((d,i)=>`${20+i*(W-20)/(data.length-1)},${H-(d.maxKg/maxKg)*H}`).join(" ")} fill="none" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
                {data.map((d,i)=>(
                  <g key={i}>
                    <circle cx={20+i*(W-20)/Math.max(data.length-1,1)} cy={H-(d.maxKg/maxKg)*H} r="4" fill={C.orange} stroke={C.card} strokeWidth="2"/>
                    <text x={20+i*(W-20)/Math.max(data.length-1,1)} y={H+20} fill={C.dim} fontSize="9" textAnchor="middle">{d.date.slice(5)}</text>
                  </g>
                ))}
                {[0,0.5,1].map(p=><text key={p} x="14" y={H*(1-p)+4} fill={C.dim} fontSize="9" textAnchor="end">{Math.round(maxKg*p)}</text>)}
              </svg>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[["Máximo",Math.max(...data.map(d=>d.maxKg))+"kg"],["Inicial",data[0]?.maxKg+"kg"],["Ganado",(Math.max(...data.map(d=>d.maxKg))-data[0]?.maxKg)+"kg"]].map(([l,v])=>(
                <div key={l} style={{background:C.card,borderRadius:12,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                  <div style={{color:C.orange,fontWeight:900,fontSize:16}}>{v}</div>
                  <div style={{color:C.muted,fontSize:11}}>{l}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AtletaNutricion = ({ nav }) => {
  const meals=[
    {time:"08:00",name:"Desayuno",desc:"Avena 80g + 3 huevos + fruta",cal:520},
    {time:"11:00",name:"Snack",desc:"Yogur griego + nueces 30g",cal:280},
    {time:"14:00",name:"Almuerzo",desc:"Pechuga 200g + arroz 150g + verduras",cal:680},
    {time:"17:30",name:"Pre-entreno",desc:"Plátano + proteína en polvo",cal:320},
    {time:"20:30",name:"Cena",desc:"Salmón 180g + camote 150g + ensalada",cal:550},
  ];
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Mi Nutrición" sub="Plan asignado por tu entrenador" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,borderRadius:14,padding:"14px",marginBottom:14}}>
          <div style={{color:"#fff",fontWeight:700,marginBottom:8}}>Plan Definición</div>
          <div style={{display:"flex",gap:16}}>
            {[["2350","Kcal"],["195g","Prot"],["240g","Carbs"],["65g","Grasas"]].map(([v,l])=>(
              <div key={l}><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{l}</div><div style={{color:"#fff",fontWeight:800,fontSize:16}}>{v}</div></div>
            ))}
          </div>
        </div>
        {meals.map((m,i)=>(
          <div key={i} style={{background:C.card,borderRadius:14,padding:"12px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{background:C.orange+"22",borderRadius:8,padding:"5px 9px",color:C.orange,fontSize:12,fontWeight:700,flexShrink:0}}>{m.time}</div>
              <div>
                <div style={{color:C.text,fontWeight:700,fontSize:14}}>{m.name}</div>
                <div style={{color:C.muted,fontSize:12}}>{m.desc}</div>
              </div>
            </div>
            <div style={{color:C.muted,fontSize:12,fontWeight:600,marginLeft:8,flexShrink:0}}>{m.cal}cal</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AtletaLogros = ({ nav }) => {
  const total=DB.sessions.length;
  const unlocked=LOGROS.filter(l=>total>=l.req);
  const locked=LOGROS.filter(l=>total<l.req);
  const next=locked[0];
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Mis Logros" sub={`${unlocked.length}/${LOGROS.length} desbloqueados · ${total} sesiones`} onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        {next&&(
          <div style={{background:`linear-gradient(135deg,${C.orange}22,${C.card})`,borderRadius:16,padding:"14px",marginBottom:16,border:`1px solid ${C.orange}44`}}>
            <div style={{color:C.orange,fontWeight:700,fontSize:11,letterSpacing:1,marginBottom:8}}>PRÓXIMO LOGRO</div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:34,filter:"grayscale(1)",opacity:0.4}}>{next.icon}</div>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontWeight:800}}>{next.name}</div>
                <div style={{background:C.bg,borderRadius:5,height:6,marginTop:8,overflow:"hidden"}}>
                  <div style={{width:Math.min((total/next.req)*100,100)+"%",height:"100%",background:C.orange,borderRadius:5}}/>
                </div>
                <div style={{color:C.muted,fontSize:11,marginTop:4}}>{total}/{next.req} sesiones</div>
              </div>
            </div>
          </div>
        )}
        {unlocked.length>0&&(
          <>
            <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Desbloqueados ✅</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {unlocked.map(l=>(
                <div key={l.id} style={{background:C.card,borderRadius:14,padding:"14px",border:`2px solid ${l.color}44`,textAlign:"center",position:"relative"}}>
                  <div style={{position:"absolute",top:8,right:8,background:l.color,borderRadius:5,padding:"1px 5px",fontSize:10,color:"#fff",fontWeight:700}}>✓</div>
                  <div style={{fontSize:32,marginBottom:6}}>{l.icon}</div>
                  <div style={{color:C.text,fontWeight:800,fontSize:13}}>{l.name}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {locked.length>0&&(
          <>
            <div style={{color:C.muted,fontWeight:700,marginBottom:10}}>Por desbloquear</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {locked.map(l=>(
                <div key={l.id} style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,textAlign:"center",opacity:0.5}}>
                  <div style={{fontSize:32,marginBottom:6,filter:"grayscale(1)"}}>{l.icon}</div>
                  <div style={{color:C.muted,fontWeight:700,fontSize:13}}>{l.name}</div>
                  <div style={{color:C.dim,fontSize:11}}>{l.req} sesiones</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AtletaProgreso = ({ nav }) => {
  const dias=["Lun","Mar","Mié","Jue","Vie","Sáb"];
  const adh=[100,0,100,100,80,0];
  const total=DB.sessions.length;
  return (
    <div style={{paddingBottom:20}}>
      <Header title="Mi Progreso" sub="Evolución corporal" onHome={()=>nav("home")}/>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[["Peso","78.5 kg","-1.2kg",C.orange],["Grasa","18.4%","-0.8%",C.blue],["Músculo","38.2 kg","+0.6kg",C.green],["IMC","24.1","-0.4",C.purple]].map(([l,v,ch,col])=>(
            <div key={l} style={{background:C.card,borderRadius:14,padding:"12px",border:`1px solid ${C.border}`}}>
              <div style={{color:C.muted,fontSize:11}}>{l}</div>
              <div style={{color:C.text,fontSize:19,fontWeight:800}}>{v}</div>
              <div style={{color:col,fontSize:12,fontWeight:600}}>{ch}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          <button onClick={()=>nav("progresion")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:32,height:32,borderRadius:9,background:C.blue+"22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7}}><I n="chart" s={15} c={C.blue}/></div>
            <div style={{color:C.text,fontWeight:700,fontSize:13}}>Progresión cargas</div>
            <div style={{color:C.muted,fontSize:11}}>Ver por ejercicio</div>
          </button>
          <button onClick={()=>nav("logros")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:32,height:32,borderRadius:9,background:C.yellow+"22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7}}><span style={{fontSize:16}}>🏅</span></div>
            <div style={{color:C.text,fontWeight:700,fontSize:13}}>Mis logros</div>
            <div style={{color:C.muted,fontSize:11}}>{LOGROS.filter(l=>total>=l.req).length} badges · {total} sesiones</div>
          </button>
        </div>
        <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,marginBottom:10}}>
          <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Adherencia semanal</div>
          {dias.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
              <div style={{color:C.muted,fontSize:12,width:26}}>{d}</div>
              <div style={{flex:1,background:C.bg,borderRadius:5,height:7,overflow:"hidden"}}>
                <div style={{width:adh[i]+"%",height:"100%",background:adh[i]>0?C.green:C.card,borderRadius:5}}/>
              </div>
              <div style={{fontSize:12,color:adh[i]>0?C.green:C.muted}}>{adh[i]>0?"✓":"–"}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <div><div style={{color:C.text,fontWeight:700}}>🔥 Racha</div><div style={{color:C.orange,fontSize:26,fontWeight:900}}>12 días</div></div>
          <div style={{textAlign:"right"}}><div style={{color:C.text,fontWeight:700}}>Sesiones</div><div style={{color:C.green,fontSize:26,fontWeight:900}}>{total}</div></div>
        </div>
      </div>
    </div>
  );
};

const AtletaChat = ({ nav }) => {
  const [msg,setMsg]=useState("");
  const [msgs,setMsgs]=useState([
    {id:1,from:"trainer",text:"Hola! ¿Cómo te fue con la sesión de ayer? 💪",time:"09:30"},
    {id:2,from:"me",text:"Muy bien profe, pude subir 5kg en sentadilla!",time:"09:45"},
    {id:3,from:"trainer",text:"Excelente! Esta semana podemos aumentar el volumen en pierna.",time:"09:47"},
  ]);
  const send=()=>{
    if(!msg.trim())return;
    setMsgs(p=>[...p,{id:Date.now(),from:"me",text:msg,time:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}]);
    setMsg("");
  };
  return (
    <div style={{display:"flex",flexDirection:"column",paddingBottom:130}}>
      {/* Header con botón home */}
      <div style={{background:C.card,padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>nav("home")} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
          <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
        </button>
        <div style={{width:38,height:38,borderRadius:12,background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:13,flexShrink:0}}>JP</div>
        <div><div style={{color:C.text,fontWeight:700}}>Juan (Tu Entrenador)</div><div style={{color:C.green,fontSize:12}}>● En línea</div></div>
      </div>
      {/* Mensajes */}
      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10,minHeight:"50vh"}}>
        {msgs.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",background:m.from==="me"?`linear-gradient(135deg,${C.orange},${C.orangeL})`:C.card,border:m.from==="me"?"none":`1px solid ${C.border}`,borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px"}}>
              <div style={{color:"#fff",fontSize:14}}>{m.text}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginTop:4,textAlign:"right"}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Input fijo */}
      <div style={{position:"fixed",bottom:70,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.card,display:"flex",gap:8,alignItems:"center",zIndex:40}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..." style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",color:C.text,fontSize:14,outline:"none"}}/>
        <button onClick={send} style={{background:C.orange,border:"none",borderRadius:12,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><I n="send" s={17} c="#fff"/></button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function JUDStudioApp({ user, onSignOut }) {
  const [screen, setScreen] = useState("home");
  const [data, setData] = useState(null);

  const nav = (sc, d=null) => { setScreen(sc); setData(d); };
  const isTrainer = user?.role === "trainer";

  const TRAINER_TABS = [
    {id:"home",    icon:"home",     label:"Inicio"},
    {id:"clientes",icon:"users",    label:"Clientes"},
    {id:"calendario",icon:"calendar",label:"Agenda"},
    {id:"plantillas",icon:"edit",   label:"Rutinas"},
    {id:"estadisticas",icon:"chart",label:"Stats"},
  ];
  const CLIENT_TABS = [
    {id:"home",    icon:"home",     label:"Inicio"},
    {id:"rutina",  icon:"dumbbell", label:"Rutina"},
    {id:"progreso",icon:"chart",    label:"Progreso"},
    {id:"historial",icon:"calendar",label:"Historial"},
    {id:"chat",    icon:"chat",     label:"Mi Profe"},
  ];
  const TABS = isTrainer ? TRAINER_TABS : CLIENT_TABS;

  // Sesión activa: sin barra de navegación
  const hideTabs = screen === "sesion";

  const renderScreen = () => {
    if (isTrainer) {
      switch(screen) {
        case "home":           return <TrainerHome user={user} nav={nav} signOut={onSignOut}/>;
        case "clientes":       return <TrainerClientes nav={nav}/>;
        case "cliente-detalle":return <TrainerClienteDetalle client={data} nav={nav}/>;
        case "nuevo-cliente":  return <NuevoCliente nav={nav}/>;
        case "calendario":     return <TrainerCalendario nav={nav}/>;
        case "plantillas":     return <TrainerPlantillas nav={nav}/>;
        case "estadisticas":   return <TrainerStats nav={nav}/>;
        default:               return <TrainerHome user={user} nav={nav} signOut={onSignOut}/>;
      }
    } else {
      switch(screen) {
        case "home":       return <AtletaHome user={user} nav={nav} signOut={onSignOut}/>;
        case "rutina":     return <AtletaRutina nav={nav}/>;
        case "sesion":     return <AtletaSesion nav={nav}/>;
        case "historial":  return <AtletaHistorial nav={nav}/>;
        case "progreso":   return <AtletaProgreso nav={nav}/>;
        case "progresion": return <AtletaProgresion nav={nav}/>;
        case "nutricion":  return <AtletaNutricion nav={nav}/>;
        case "logros":     return <AtletaLogros nav={nav}/>;
        case "chat":       return <AtletaChat nav={nav}/>;
        default:           return <AtletaHome user={user} nav={nav} signOut={onSignOut}/>;
      }
    }
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"system-ui,-apple-system,'SF Pro Display',sans-serif",display:"flex",flexDirection:"column",position:"relative"}}>
      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}input::placeholder{color:#5A6275;}select option{background:#12141A;}::-webkit-scrollbar{width:0;height:0;}button{font-family:inherit;}@keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}.sc{animation:fadeIn 0.2s ease;}`}</style>
      
      {/* Screen content */}
      <div className="sc" key={screen} style={{flex:1,overflowY:"auto",paddingBottom:hideTabs?0:70}}>
        {renderScreen()}
      </div>

      {/* Bottom navigation — siempre visible excepto en sesión activa */}
      {!hideTabs && (
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"8px 0",zIndex:100}}>
          {TABS.map(tab=>{
            const active=screen===tab.id;
            return (
              <button key={tab.id} onClick={()=>{setScreen(tab.id);setData(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"5px 0"}}>
                <div style={{background:active?C.orange+"22":"transparent",borderRadius:9,padding:"5px 10px",transition:"all 0.2s"}}>
                  <I n={tab.icon} s={20} c={active?C.orange:C.dim}/>
                </div>
                <span style={{color:active?C.orange:C.dim,fontSize:10,fontWeight:active?700:500}}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
