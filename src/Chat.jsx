import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", blue:"#4A9EFF", green:"#2ECC8E",
  red:"#FF4757", text:"#FFFFFF", muted:"#8891A4", dim:"#5A6275",
};

const I = ({ n, s=20, c="currentColor" }) => {
  const icons = {
    home: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    back: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    send: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[n] || null;
};

const COLORS = ["#FF6B35","#4A9EFF","#2ECC8E","#8B5CF6","#FFD32A"];
const getColor = (id) => COLORS[(id?.charCodeAt(0)||0) % COLORS.length];
const getInitials = (name) => name ? name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "??";

// ─── CONVERSACIÓN INDIVIDUAL ──────────────────────────────────────────────────
export function Conversacion({ user, otherUser, onBack, onHome }) {
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadMessages();

    // Suscripción en tiempo real
    const channel = supabase
      .channel("messages-" + [user.id, otherUser.id].sort().join("-"))
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new.sender_id === otherUser.id) {
          setMsgs(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [otherUser.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    if (data) setMsgs(data);
    setLoading(false);
  };

  const send = async () => {
    if (!msg.trim()) return;
    const newMsg = {
      sender_id: user.id,
      receiver_id: otherUser.id,
      content: msg.trim(),
    };
    setMsg("");
    const { data } = await supabase.from("messages").insert(newMsg).select().single();
    if (data) setMsgs(prev => [...prev, data]);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit" });
  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Hoy";
    return d.toLocaleDateString("es-CL", { day:"numeric", month:"short" });
  };

  let lastDate = "";

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:C.bg}}>
      {/* Header */}
      <div style={{background:C.card,padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
        <button onClick={onBack} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
          <I n="back" s={14} c={C.muted}/><span style={{color:C.muted,fontWeight:700,fontSize:12}}>Volver</span>
        </button>
        <div style={{width:38,height:38,borderRadius:"50%",background:getColor(otherUser.id),display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:13,flexShrink:0}}>
          {getInitials(otherUser.name||otherUser.email)}
        </div>
        <div style={{flex:1}}>
          <div style={{color:C.text,fontWeight:700,fontSize:14}}>{otherUser.name||otherUser.email}</div>
          <div style={{color:C.green,fontSize:11}}>● En línea</div>
        </div>
        <button onClick={onHome} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
          <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
        </button>
      </div>

      {/* Mensajes */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",paddingBottom:140,display:"flex",flexDirection:"column",gap:8}}>
        {loading ? (
          <div style={{textAlign:"center",color:C.muted,padding:"40px"}}>Cargando mensajes...</div>
        ) : msgs.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>💬</div>
            <div style={{color:C.muted}}>Inicia la conversación con {otherUser.name||"tu atleta"}</div>
          </div>
        ) : msgs.map((m, i) => {
          const isMe = m.sender_id === user.id;
          const msgDate = formatDate(m.created_at);
          const showDate = msgDate !== lastDate;
          lastDate = msgDate;
          return (
            <div key={m.id}>
              {showDate && (
                <div style={{textAlign:"center",margin:"8px 0"}}>
                  <span style={{background:C.card2,color:C.muted,fontSize:11,padding:"3px 12px",borderRadius:20}}>{msgDate}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"75%",background:isMe?`linear-gradient(135deg,${C.orange},${C.orangeL})`:C.card,border:isMe?"none":`1px solid ${C.border}`,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px"}}>
                  <div style={{color:"#fff",fontSize:14,lineHeight:1.5}}>{m.content}</div>
                  <div style={{color:"rgba(255,255,255,0.55)",fontSize:10,marginTop:4,textAlign:"right",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:4}}>
                    {formatTime(m.created_at)}
                    {isMe && <I n="check" s={10} c="rgba(255,255,255,0.55)"/>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input fijo */}
      <div style={{position:"fixed",bottom:70,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.card,display:"flex",gap:8,alignItems:"center",zIndex:40}}>
        <input
          value={msg}
          onChange={e=>setMsg(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Escribe un mensaje..."
          style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",color:C.text,fontSize:14,outline:"none"}}
        />
        <button onClick={send} disabled={!msg.trim()} style={{background:msg.trim()?C.orange:C.card2,border:"none",borderRadius:12,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",cursor:msg.trim()?"pointer":"not-allowed",flexShrink:0,transition:"background 0.2s"}}>
          <I n="send" s={17} c={msg.trim()?"#fff":C.dim}/>
        </button>
      </div>
    </div>
  );
}

// ─── LISTA DE CHATS (para entrenador) ─────────────────────────────────────────
export function ChatList({ user, nav, onHome }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (data) setClients(data);

    // Contar mensajes no leídos
    const { data: unreadMsgs } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("receiver_id", user.id)
      .eq("read", false);
    if (unreadMsgs) {
      const counts = {};
      unreadMsgs.forEach(m => { counts[m.sender_id] = (counts[m.sender_id]||0) + 1; });
      setUnread(counts);
    }
    setLoading(false);
  };

  return (
    <div style={{paddingBottom:20}}>
      <div style={{background:`linear-gradient(135deg,${C.blue}22,${C.card})`,padding:"16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={onHome} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
              <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
            </button>
            <div>
              <div style={{color:C.text,fontWeight:800,fontSize:18}}>Mensajes</div>
              <div style={{color:C.muted,fontSize:12}}>{clients.length} conversaciones</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {loading ? (
          <div style={{textAlign:"center",color:C.muted,padding:"40px"}}>Cargando...</div>
        ) : clients.length === 0 ? (
          <div style={{background:C.card,borderRadius:18,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:40,marginBottom:10}}>💬</div>
            <div style={{color:C.muted}}>No hay clientes activos aún</div>
          </div>
        ) : clients.map(c => (
          <div key={c.id} onClick={()=>nav("chat-conv", c)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:getColor(c.id),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16}}>
                {getInitials(c.name||c.email)}
              </div>
              {unread[c.id] > 0 && (
                <div style={{position:"absolute",top:-2,right:-2,background:C.orange,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff"}}>
                  {unread[c.id]}
                </div>
              )}
            </div>
            <div style={{flex:1}}>
              <div style={{color:C.text,fontWeight:700}}>{c.name||c.email}</div>
              <div style={{color:C.muted,fontSize:12}}>{c.email}</div>
            </div>
            <div style={{color:C.dim,fontSize:12}}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT ATLETA (con su entrenador) ──────────────────────────────────────────
export function ChatAtleta({ user, nav }) {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainer();
  }, []);

  const loadTrainer = async () => {
    // Buscar el entrenador del atleta
    const { data: profile } = await supabase
      .from("profiles")
      .select("trainer_id")
      .eq("id", user.id)
      .single();

    if (profile?.trainer_id) {
      const { data: trainerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.trainer_id)
        .single();
      if (trainerData) { setTrainer(trainerData); setLoading(false); return; }
    }

    // Si no tiene trainer_id, buscar cualquier entrenador
    const { data: trainers } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "trainer")
      .limit(1);
    if (trainers && trainers.length > 0) setTrainer(trainers[0]);
    setLoading(false);
  };

  if (loading) return <div style={{padding:"40px",textAlign:"center",color:C.muted}}>Conectando con tu entrenador...</div>;
  if (!trainer) return (
    <div style={{padding:"40px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>👋</div>
      <div style={{color:C.muted}}>Tu entrenador aún no está en la plataforma</div>
    </div>
  );

  return (
    <Conversacion
      user={user}
      otherUser={trainer}
      onBack={()=>nav("home")}
      onHome={()=>nav("home")}
    />
  );
}
