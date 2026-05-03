import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", blue:"#4A9EFF", green:"#2ECC8E",
  red:"#FF4757", yellow:"#FFD32A", purple:"#8B5CF6",
  text:"#FFFFFF", muted:"#8891A4", dim:"#5A6275",
};

const Badge = ({ text, color=C.orange }) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{text}</span>
);

const I = ({ n, s=20, c="currentColor" }) => {
  const icons = {
    search: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x:      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    mail:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    home:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  };
  return icons[n] || null;
};

const COLORS = ["#FF6B35","#4A9EFF","#2ECC8E","#8B5CF6","#FFD32A","#FF4757"];

export default function ClientesScreen({ user, nav }) {
  const [clients, setClients] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("activos");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    
    if (data) {
      setPending(data.filter(c => c.status === "pending" || !c.status));
      setClients(data.filter(c => c.status === "active"));
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("profiles").update({ status, trainer_id: user.id }).eq("id", id);
    loadClients();
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    await supabase.from("invitations").insert({ trainer_id: user.id, email: inviteEmail });
    setInviteMsg(`✅ Invitación enviada a ${inviteEmail}`);
    setInviteEmail("");
    setTimeout(() => { setInviteMsg(""); setShowInvite(false); }, 2000);
  };

  const getInitials = (name) => name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "??";
  const getColor = (id) => COLORS[id?.charCodeAt(0) % COLORS.length] || C.orange;

  const filtered = (tab === "pendientes" ? pending : clients)
    .filter(c => (c.name||c.email||"").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{paddingBottom:20}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.blue}22,${C.card})`,padding:"16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>nav("home")} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
              <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
            </button>
            <div>
              <div style={{color:C.text,fontWeight:800,fontSize:18}}>Clientes</div>
              <div style={{color:C.muted,fontSize:12}}>{clients.length} activos · {pending.length} pendientes</div>
            </div>
          </div>
          <button onClick={()=>setShowInvite(!showInvite)} style={{background:C.orange,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <I n="plus" s={14} c="#fff"/>Invitar
          </button>
        </div>

        {/* Invitar por email */}
        {showInvite && (
          <div style={{background:C.card2,borderRadius:14,padding:"14px",border:`1px solid ${C.orange}44`,marginBottom:12}}>
            <div style={{color:C.text,fontWeight:700,marginBottom:8}}>📧 Invitar atleta por email</div>
            <div style={{display:"flex",gap:8}}>
              <input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="email@ejemplo.com" onKeyDown={e=>e.key==="Enter"&&sendInvite()} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.text,fontSize:14,outline:"none"}}/>
              <button onClick={sendInvite} style={{background:C.orange,border:"none",borderRadius:10,padding:"10px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>Enviar</button>
            </div>
            {inviteMsg && <div style={{color:C.green,fontSize:13,marginTop:8}}>{inviteMsg}</div>}
          </div>
        )}

        {/* Search */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",display:"flex",gap:8,alignItems:"center"}}>
          <I n="search" s={16} c={C.muted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..." style={{background:"none",border:"none",color:C.text,fontSize:14,outline:"none",flex:1}}/>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.card}}>
        {[["activos","Activos",clients.length],["pendientes","Pendientes",pending.length]].map(([t,l,count])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"12px",background:"none",border:"none",borderBottom:`2px solid ${tab===t?C.orange:"transparent"}`,color:tab===t?C.orange:C.muted,cursor:"pointer",fontWeight:700,fontSize:13}}>
            {l} {count>0&&<span style={{background:tab===t?C.orange:C.border,color:tab===t?"#fff":C.muted,borderRadius:20,padding:"1px 7px",fontSize:11,marginLeft:4}}>{count}</span>}
          </button>
        ))}
      </div>

      <div style={{padding:"12px 16px"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:"40px",color:C.muted}}>Cargando clientes...</div>
        ) : filtered.length === 0 ? (
          <div style={{background:C.card,borderRadius:18,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:40,marginBottom:10}}>{tab==="pendientes"?"⏳":"👥"}</div>
            <div style={{color:C.muted,marginBottom:6}}>
              {tab==="pendientes" ? "No hay solicitudes pendientes" : "No hay clientes activos aún"}
            </div>
            <div style={{color:C.dim,fontSize:12}}>
              {tab==="pendientes" ? "Cuando un atleta se registre aparecerá aquí" : "Aprueba solicitudes o invita atletas"}
            </div>
          </div>
        ) : filtered.map(c => (
          <div key={c.id} onClick={()=>tab==="activos"&&nav("cliente-detalle",c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px",marginBottom:10,cursor:tab==="activos"?"pointer":"default"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:46,height:46,borderRadius:"50%",background:getColor(c.id),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:15,flexShrink:0}}>
                {getInitials(c.name||c.email)}
              </div>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontWeight:800,fontSize:15}}>{c.name||"Sin nombre"}</div>
                <div style={{color:C.muted,fontSize:12}}>{c.email}</div>
                <div style={{color:C.dim,fontSize:11,marginTop:2}}>
                  Registrado: {new Date(c.created_at).toLocaleDateString("es-CL")}
                </div>
              </div>
              {tab==="pendientes" ? (
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>updateStatus(c.id,"active")} style={{background:C.green,border:"none",borderRadius:10,padding:"8px 12px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                    <I n="check" s={13} c="#fff"/>Aceptar
                  </button>
                  <button onClick={()=>updateStatus(c.id,"rejected")} style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:10,padding:"8px",cursor:"pointer"}}>
                    <I n="x" s={14} c={C.red}/>
                  </button>
                </div>
              ) : (
                <Badge text="Activo" color={C.green}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
