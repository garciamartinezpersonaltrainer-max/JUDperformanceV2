import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", blue:"#4A9EFF", green:"#2ECC8E",
  red:"#FF4757", yellow:"#FFD32A", purple:"#8B5CF6",
  text:"#FFFFFF", muted:"#8891A4", dim:"#5A6275",
};

const I = ({ n, s=20, c="currentColor" }) => {
  const icons = {
    home:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    back:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    send:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    edit:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    dumbbell: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M2 8h4M18 8h4M2 16h4M18 16h4M6 8h12M6 16h12"/></svg>,
    chart: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    credit: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    chat:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  };
  return icons[n] || null;
};

const Badge = ({ text, color=C.orange }) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{text}</span>
);

const ProgressBar = ({ value, color=C.orange, h=6 }) => (
  <div style={{width:"100%",background:C.border,borderRadius:10,height:h,overflow:"hidden"}}>
    <div style={{width:`${Math.min(value||0,100)}%`,height:"100%",background:color,borderRadius:10,transition:"width 0.5s"}}/>
  </div>
);

// NAV HEADER con botón volver y home
const NavHeader = ({ title, onBack, onHome, color=C.orange }) => (
  <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
    <button onClick={onBack} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
      <I n="back" s={14} c={C.muted}/><span style={{color:C.muted,fontWeight:700,fontSize:12}}>Volver</span>
    </button>
    <span style={{color:C.text,fontWeight:800,fontSize:15,flex:1}}>{title}</span>
    <button onClick={onHome} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
      <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
    </button>
  </div>
);

// PESTAÑA RESUMEN
const TabResumen = ({ client }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    goal: client.goal || "",
    level: client.level || "",
    weight: client.weight || "",
    height: client.height || "",
    injuries: client.injuries || "",
    notes: client.notes || "",
  });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await supabase.from("profiles").update(form).eq("id", client.id);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = { width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" };

  return (
    <div style={{padding:"14px 16px"}}>
      {/* Info básica */}
      <div style={{background:C.card,borderRadius:16,padding:"16px",marginBottom:12,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{color:C.text,fontWeight:700}}>Información del atleta</div>
          <button onClick={()=>setEditing(!editing)} style={{background:C.orange+"22",border:"none",borderRadius:8,padding:"5px 10px",color:C.orange,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
            <I n="edit" s={12} c={C.orange}/>{editing?"Cancelar":"Editar"}
          </button>
        </div>

        {editing ? (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div>
                <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>Peso (kg)</label>
                <input type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="75" style={inp}/>
              </div>
              <div>
                <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>Talla (cm)</label>
                <input type="number" value={form.height} onChange={e=>setForm({...form,height:e.target.value})} placeholder="175" style={inp}/>
              </div>
            </div>
            <div>
              <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>Objetivo</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["Hipertrofia","Pérdida de peso","Fuerza máxima","Recondicionar","Mantenimiento"].map(g=>(
                  <button key={g} onClick={()=>setForm({...form,goal:g})} style={{background:form.goal===g?C.orange:C.card2,border:"none",borderRadius:8,padding:"6px 10px",color:form.goal===g?"#fff":C.muted,fontSize:12,cursor:"pointer"}}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>Nivel</label>
              <div style={{display:"flex",gap:6}}>
                {["Principiante","Intermedio","Avanzado"].map(l=>(
                  <button key={l} onClick={()=>setForm({...form,level:l})} style={{flex:1,background:form.level===l?C.blue:C.card2,border:"none",borderRadius:8,padding:"8px",color:form.level===l?"#fff":C.muted,fontSize:12,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>Lesiones / Limitaciones</label>
              <input value={form.injuries} onChange={e=>setForm({...form,injuries:e.target.value})} placeholder="Ej: dolor lumbar, rodilla..." style={inp}/>
            </div>
            <div>
              <label style={{color:C.muted,fontSize:11,display:"block",marginBottom:4}}>Notas del entrenador</label>
              <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Observaciones, objetivos específicos..." style={{...inp,height:70,resize:"none"}}/>
            </div>
            <button onClick={save} style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:800,cursor:"pointer"}}>
              {saved?"✅ Guardado":"Guardar cambios"}
            </button>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              ["📧","Email",client.email],
              ["🎯","Objetivo",form.goal||"Sin definir"],
              ["⚡","Nivel",form.level||"Sin definir"],
              ["⚖️","Peso",form.weight?`${form.weight} kg`:"—"],
              ["📏","Talla",form.height?`${form.height} cm`:"—"],
              ["📅","Registro",new Date(client.created_at).toLocaleDateString("es-CL")],
            ].map(([icon,label,val])=>(
              <div key={label} style={{background:C.card2,borderRadius:12,padding:"10px"}}>
                <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                <div style={{color:C.muted,fontSize:11}}>{label}</div>
                <div style={{color:C.text,fontWeight:700,fontSize:13,marginTop:2}}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lesiones y notas (solo vista) */}
      {!editing && (form.injuries || form.notes) && (
        <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,marginBottom:12}}>
          {form.injuries && <div style={{marginBottom:8}}><div style={{color:C.yellow,fontSize:12,fontWeight:700,marginBottom:4}}>⚠️ Lesiones / Limitaciones</div><div style={{color:C.muted,fontSize:13}}>{form.injuries}</div></div>}
          {form.notes && <div><div style={{color:C.blue,fontSize:12,fontWeight:700,marginBottom:4}}>📝 Notas del entrenador</div><div style={{color:C.muted,fontSize:13}}>{form.notes}</div></div>}
        </div>
      )}

      {/* Estado */}
      <div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:14,padding:"12px",display:"flex",gap:10,alignItems:"center"}}>
        <I n="check" s={18} c={C.green}/>
        <div>
          <div style={{color:C.green,fontWeight:700}}>Cliente activo</div>
          <div style={{color:C.muted,fontSize:12}}>Aprobado por el entrenador</div>
        </div>
      </div>
    </div>
  );
};

// PESTAÑA RUTINA
const TabRutina = () => {
  const rutinas = [
    {day:"Lunes",focus:"Pecho + Tríceps",exs:["Press Banca 4x8-10","Aperturas Cable 3x12","Fondos 3xF"]},
    {day:"Miércoles",focus:"Espalda + Bíceps",exs:["Dominadas 4x6-8","Remo Barra 4x8-10","Curl Mancuerna 3x12"]},
    {day:"Viernes",focus:"Pierna + Core",exs:["Sentadilla 4x8-10","Prensa 3x12-15","Plancha 3x60s"]},
  ];
  return (
    <div style={{padding:"14px 16px"}}>
      <div style={{background:C.orange+"11",border:`1px solid ${C.orange}33`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
        <I n="dumbbell" s={18} c={C.orange}/>
        <div>
          <div style={{color:C.orange,fontWeight:700,fontSize:13}}>Rutina Fullbody 3x/semana</div>
          <div style={{color:C.muted,fontSize:12}}>Asignada por el entrenador</div>
        </div>
      </div>
      {rutinas.map((r,i)=>(
        <div key={i} style={{background:C.card,borderRadius:14,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{color:C.text,fontWeight:700}}>{r.day}</div>
            <Badge text={r.focus} color={C.orange}/>
          </div>
          {r.exs.map((ex,j)=>(
            <div key={j} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.orange,flexShrink:0}}/>
              <span style={{color:C.muted,fontSize:13}}>{ex}</span>
            </div>
          ))}
        </div>
      ))}
      <button style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <I n="edit" s={16} c="#fff"/> Cambiar rutina
      </button>
    </div>
  );
};

// PESTAÑA PROGRESO
const TabProgreso = ({ client }) => {
  const dias=["Lun","Mar","Mié","Jue","Vie","Sáb"];
  const adh=[100,0,100,100,80,0];
  const metrics=[
    {label:"Peso corporal",val:client.weight?`${client.weight} kg`:"—",change:"—",color:C.orange},
    {label:"Grasa corporal",val:"—",change:"—",color:C.blue},
    {label:"Masa muscular",val:"—",change:"—",color:C.green},
    {label:"IMC",val:client.weight&&client.height?`${(client.weight/((client.height/100)**2)).toFixed(1)}`:"—",change:"—",color:C.purple},
  ];
  return (
    <div style={{padding:"14px 16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {metrics.map((m,i)=>(
          <div key={i} style={{background:C.card,borderRadius:14,padding:"12px",border:`1px solid ${C.border}`}}>
            <div style={{color:C.muted,fontSize:11}}>{m.label}</div>
            <div style={{color:C.text,fontSize:19,fontWeight:800}}>{m.val}</div>
            <div style={{color:m.color,fontSize:12,fontWeight:600}}>{m.change}</div>
          </div>
        ))}
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
        <div><div style={{color:C.text,fontWeight:700}}>🔥 Racha</div><div style={{color:C.orange,fontSize:24,fontWeight:900}}>—</div></div>
        <div style={{textAlign:"right"}}><div style={{color:C.text,fontWeight:700}}>Sesiones</div><div style={{color:C.green,fontSize:24,fontWeight:900}}>—</div></div>
      </div>
    </div>
  );
};

// PESTAÑA PAGOS
const TabPagos = ({ client }) => {
  const [plan,setPlan]=useState(client.plan||"Básico");
  const [saved,setSaved]=useState(false);
  const planes=[{name:"Básico",price:"$19.990",color:C.blue},{name:"Premium",price:"$34.990",color:C.orange},{name:"Elite",price:"$59.990",color:C.purple}];
  const savePlan=async()=>{ await supabase.from("profiles").update({plan}).eq("id",client.id); setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div style={{padding:"14px 16px"}}>
      <div style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:12,border:`1px solid ${C.border}`}}>
        <div style={{color:C.text,fontWeight:700,marginBottom:12}}>Plan actual</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {planes.map(p=>(
            <button key={p.name} onClick={()=>setPlan(p.name)} style={{flex:1,background:plan===p.name?p.color:C.card2,border:`1px solid ${plan===p.name?p.color:C.border}`,borderRadius:12,padding:"10px 6px",cursor:"pointer"}}>
              <div style={{color:plan===p.name?"#fff":C.muted,fontWeight:700,fontSize:13}}>{p.name}</div>
              <div style={{color:plan===p.name?"rgba(255,255,255,0.8)":C.dim,fontSize:11}}>{p.price}/mes</div>
            </button>
          ))}
        </div>
        <button onClick={savePlan} style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:12,padding:"11px",color:"#fff",fontWeight:700,cursor:"pointer"}}>
          {saved?"✅ Guardado":"Asignar plan"}
        </button>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`}}>
        <div style={{color:C.text,fontWeight:700,marginBottom:10}}>Historial de pagos</div>
        {["Mayo 2026","Abril 2026","Marzo 2026"].map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,padding:"8px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
            <div style={{color:C.text,fontSize:13}}>{m}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:C.muted,fontSize:13}}>$34.990</span>
              <Badge text={i===0?"Pendiente":"Pagado"} color={i===0?C.red:C.green}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// PESTAÑA CHAT
const TabChat = ({ client, trainerUser }) => {
  const [msgs,setMsgs]=useState([
    {id:1,from:"trainer",text:`Hola ${client.name||"atleta"}! Bienvenido/a a JUD Performance 💪`,time:"Hoy"},
  ]);
  const [msg,setMsg]=useState("");
  const send=()=>{
    if(!msg.trim())return;
    setMsgs(p=>[...p,{id:Date.now(),from:"trainer",text:msg,time:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}]);
    setMsg("");
  };
  return (
    <div style={{paddingBottom:80}}>
      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10,minHeight:"40vh"}}>
        {msgs.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:m.from==="trainer"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",background:m.from==="trainer"?`linear-gradient(135deg,${C.orange},${C.orangeL})`:C.card,border:m.from==="trainer"?"none":`1px solid ${C.border}`,borderRadius:m.from==="trainer"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px"}}>
              <div style={{color:"#fff",fontSize:14}}>{m.text}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginTop:4,textAlign:"right"}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{position:"fixed",bottom:70,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.card,display:"flex",gap:8,alignItems:"center",zIndex:40}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={`Mensaje para ${client.name||"atleta"}...`} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",color:C.text,fontSize:14,outline:"none"}}/>
        <button onClick={send} style={{background:C.orange,border:"none",borderRadius:12,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
          <I n="send" s={17} c="#fff"/>
        </button>
      </div>
    </div>
  );
};

// MAIN COMPONENT
const COLORS = ["#FF6B35","#4A9EFF","#2ECC8E","#8B5CF6","#FFD32A","#FF4757"];
const getColor = (id) => COLORS[id?.charCodeAt(0) % COLORS.length] || "#FF6B35";
const getInitials = (name) => name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "??";

export default function ClienteDetalle({ clientId, user, nav }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("resumen");

  useEffect(() => {
    if (clientId) loadClient();
  }, [clientId]);

  const loadClient = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").eq("id", clientId).single();
    if (data) setClient(data);
    setLoading(false);
  };

  if (loading) return <div style={{padding:"40px",textAlign:"center",color:C.muted}}>Cargando...</div>;
  if (!client) return <div style={{padding:"40px",textAlign:"center",color:C.muted}}>Cliente no encontrado</div>;

  const color = getColor(client.id);
  const tabs = [
    {id:"resumen",label:"Resumen",icon:"check"},
    {id:"rutina",label:"Rutina",icon:"dumbbell"},
    {id:"progreso",label:"Progreso",icon:"chart"},
    {id:"pagos",label:"Pagos",icon:"credit"},
    {id:"chat",label:"Chat",icon:"chat"},
  ];

  return (
    <div style={{paddingBottom:20}}>
      {/* Nav Header */}
      <NavHeader
        title={client.name||client.email}
        onBack={()=>nav("clientes")}
        onHome={()=>nav("home")}
      />

      {/* Profile hero */}
      <div style={{background:`linear-gradient(160deg,${color}33,${C.card})`,padding:"20px 16px 0",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:20,flexShrink:0}}>
            {getInitials(client.name||client.email)}
          </div>
          <div>
            <div style={{color:C.text,fontWeight:800,fontSize:18}}>{client.name||"Sin nombre"}</div>
            <div style={{color:C.muted,fontSize:13}}>{client.email}</div>
            <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
              {client.goal&&<Badge text={client.goal} color={color}/>}
              {client.level&&<Badge text={client.level} color={C.blue}/>}
              <Badge text="Activo" color={C.green}/>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",overflowX:"auto",gap:0}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,background:"none",border:"none",borderBottom:`2px solid ${tab===t.id?color:"transparent"}`,color:tab===t.id?color:C.muted,cursor:"pointer",padding:"10px 12px",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:5}}>
              <I n={t.icon} s={13} c={tab===t.id?color:C.muted}/>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab==="resumen" && <TabResumen client={client}/>}
      {tab==="rutina" && <TabRutina/>}
      {tab==="progreso" && <TabProgreso client={client}/>}
      {tab==="pagos" && <TabPagos client={client}/>}
      {tab==="chat" && <TabChat client={client} trainerUser={user}/>}
    </div>
  );
}
