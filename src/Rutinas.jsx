import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";
import { EJERCICIOS, GRUPOS, METODOS_INTENSIDAD } from "./ejercicios_data.js";

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", blue:"#4A9EFF", green:"#2ECC8E",
  red:"#FF4757", yellow:"#FFD32A", purple:"#8B5CF6",
  text:"#FFFFFF", muted:"#8891A4", dim:"#5A6275",
};

const I = ({ n, s=20, c="currentColor" }) => {
  const icons = {
    home:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    back:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    plus:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    check:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x:        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    dumbbell: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M2 8h4M18 8h4M2 16h4M18 16h4M6 8h12M6 16h12"/></svg>,
    swap:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  };
  return icons[n] || null;
};

// ─── MEDIDOR DE INTENSIDAD ────────────────────────────────────────────────────
const MedidorIntensidad = ({ rpe, rir, onChange }) => {
  const rpeColor = rpe <= 5 ? C.green : rpe <= 7 ? C.yellow : rpe <= 9 ? C.orange : C.red;
  return (
    <div style={{background:C.card2,borderRadius:12,padding:"12px",marginTop:8}}>
      <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:8}}>⚡ INTENSIDAD</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div>
          <div style={{color:C.muted,fontSize:10,marginBottom:4}}>RPE (1-10)</div>
          <input type="range" min="1" max="10" value={rpe} onChange={e=>onChange("rpe",parseInt(e.target.value))}
            style={{width:"100%",accentColor:rpeColor}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:C.dim,fontSize:10}}>Fácil</span>
            <span style={{color:rpeColor,fontWeight:800,fontSize:16}}>{rpe}</span>
            <span style={{color:C.dim,fontSize:10}}>Máximo</span>
          </div>
          <div style={{color:rpeColor,fontSize:10,textAlign:"center",marginTop:2}}>
            {rpe<=5?"Baja intensidad":rpe<=7?"Moderado":rpe<=9?"Alta intensidad":"Fallo muscular"}
          </div>
        </div>
        <div>
          <div style={{color:C.muted,fontSize:10,marginBottom:4}}>RIR (Reps en reserva)</div>
          <input type="range" min="0" max="5" value={rir} onChange={e=>onChange("rir",parseInt(e.target.value))}
            style={{width:"100%",accentColor:C.blue}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:C.dim,fontSize:10}}>0</span>
            <span style={{color:C.blue,fontWeight:800,fontSize:16}}>{rir}</span>
            <span style={{color:C.dim,fontSize:10}}>5+</span>
          </div>
          <div style={{color:C.blue,fontSize:10,textAlign:"center",marginTop:2}}>
            {rir===0?"Fallo total":rir===1?"1 rep en reserva":rir<=3?`${rir} reps en reserva`:"Cómodo"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SELECTOR DE EJERCICIO ────────────────────────────────────────────────────
const SelectorEjercicio = ({ onSelect, onClose, grupoFiltro }) => {
  const [search, setSearch] = useState("");
  const [grupo, setGrupo] = useState(grupoFiltro||"");
  const [equipo, setEquipo] = useState("");

  const equipos = [...new Set(EJERCICIOS.map(e=>e.equipo))];
  const filtered = EJERCICIOS.filter(e =>
    (grupo ? e.grupo===grupo : true) &&
    (equipo ? e.equipo===equipo : true) &&
    (search ? e.nombre.toLowerCase().includes(search.toLowerCase()) ||
               e.principal.toLowerCase().includes(search.toLowerCase()) : true)
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.card,padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}>
        <button onClick={onClose} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 11px",cursor:"pointer"}}>
          <I n="x" s={16} c={C.muted}/>
        </button>
        <div style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"9px 12px",display:"flex",gap:8,alignItems:"center"}}>
          <I n="search" s={15} c={C.muted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ejercicio o músculo..." autoFocus
            style={{background:"none",border:"none",color:C.text,fontSize:14,outline:"none",flex:1}}/>
        </div>
      </div>

      {/* Filtros de grupo */}
      <div style={{background:C.card,padding:"8px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:6,overflowX:"auto"}}>
        <button onClick={()=>setGrupo("")} style={{flexShrink:0,background:!grupo?C.orange:C.card2,border:"none",borderRadius:10,padding:"5px 12px",color:!grupo?"#fff":C.muted,fontWeight:600,fontSize:12,cursor:"pointer"}}>
          Todos
        </button>
        {GRUPOS.map(g=>(
          <button key={g.id} onClick={()=>setGrupo(g.id===grupo?"":g.id)} style={{flexShrink:0,background:grupo===g.id?g.color:C.card2,border:"none",borderRadius:10,padding:"5px 12px",color:grupo===g.id?"#fff":C.muted,fontWeight:600,fontSize:12,cursor:"pointer"}}>
            {g.emoji} {g.nombre}
          </button>
        ))}
      </div>

      {/* Filtro equipo */}
      <div style={{background:C.card,padding:"6px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:5,overflowX:"auto"}}>
        <button onClick={()=>setEquipo("")} style={{flexShrink:0,background:!equipo?C.blue:C.card2,border:"none",borderRadius:8,padding:"4px 10px",color:!equipo?"#fff":C.muted,fontSize:11,cursor:"pointer"}}>Todo</button>
        {equipos.map(eq=>(
          <button key={eq} onClick={()=>setEquipo(eq===equipo?"":eq)} style={{flexShrink:0,background:equipo===eq?C.blue:C.card2,border:"none",borderRadius:8,padding:"4px 10px",color:equipo===eq?"#fff":C.muted,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{eq}</button>
        ))}
      </div>

      {/* Lista */}
      <div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>
        <div style={{color:C.muted,fontSize:12,marginBottom:8}}>{filtered.length} ejercicios</div>
        {filtered.map(ex=>{
          const g = GRUPOS.find(g=>g.id===ex.grupo);
          return (
            <div key={ex.id} onClick={()=>onSelect(ex)} style={{background:C.card,borderRadius:14,padding:"13px",marginBottom:8,cursor:"pointer",border:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:12,background:(g?.color||C.orange)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {g?.emoji||"💪"}
              </div>
              <div style={{flex:1}}>
                <div style={{color:C.text,fontWeight:700,fontSize:14}}>{ex.nombre}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>
                  {ex.principal} · {ex.equipo} · {ex.dificultad}
                </div>
                <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                  <span style={{background:C.orange+"22",color:C.orange,borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:600}}>{ex.series} series</span>
                  <span style={{background:C.blue+"22",color:C.blue,borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:600}}>{ex.reps} reps</span>
                  <span style={{background:C.green+"22",color:C.green,borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:600}}>{ex.descanso}</span>
                </div>
              </div>
              <I n="plus" s={18} c={C.orange}/>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ─── VIDEO PLAYER EMBEBIDO ────────────────────────────────────────────────────
const VideoPlayer = ({ url, nombre }) => {
  const [show, setShow] = useState(false);
  
  // Extraer ID de YouTube
  const getYoutubeId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&
?#]+)/);
    return match ? match[1] : null;
  };
  
  const videoId = getYoutubeId(url);
  if (!videoId) return null;

  return (
    <div style={{marginTop:10}}>
      {!show ? (
        <button onClick={()=>setShow(true)} style={{width:"100%",background:"#FF0000",border:"none",borderRadius:12,padding:"10px 14px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:18}}>▶</span> Ver ejecución del movimiento
        </button>
      ) : (
        <div style={{borderRadius:12,overflow:"hidden",position:"relative",marginTop:6}}>
          <button onClick={()=>setShow(false)} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.7)",border:"none",borderRadius:8,padding:"4px 8px",color:"#fff",fontSize:12,cursor:"pointer",zIndex:10}}>
            ✕ Cerrar
          </button>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={nombre}
            width="100%"
            height="200"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{display:"block"}}
          />
        </div>
      )}
    </div>
  );
};

// ─── TARJETA DE EJERCICIO EN RUTINA ──────────────────────────────────────────
const EjercicioCard = ({ exData, index, onRemove, onUpdate, onSwap }) => {
  const [expanded, setExpanded] = useState(false);
  const g = GRUPOS.find(g=>g.id===exData.ejercicio.grupo);
  const metodo = METODOS_INTENSIDAD[exData.metodo] || METODOS_INTENSIDAD.estandar;

  // Buscar alternativas
  const alternativas = (exData.ejercicio.alternativas||[])
    .map(id => EJERCICIOS.find(e=>e.id===id))
    .filter(Boolean);

  return (
    <div style={{background:C.card,borderRadius:16,marginBottom:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
      {/* Header del ejercicio */}
      <div onClick={()=>setExpanded(!expanded)} style={{padding:"13px 14px",cursor:"pointer",display:"flex",gap:10,alignItems:"center"}}>
        <div style={{width:36,height:36,borderRadius:10,background:(g?.color||C.orange)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
          {g?.emoji||"💪"}
        </div>
        <div style={{flex:1}}>
          <div style={{color:C.text,fontWeight:700,fontSize:14}}>{exData.ejercicio.nombre}</div>
          <div style={{color:C.muted,fontSize:11,marginTop:2}}>
            {exData.series}×{exData.reps} · {exData.descanso} descanso · RPE {exData.rpe}
          </div>
          <div style={{color:g?.color||C.orange,fontSize:10,marginTop:2}}>{metodo.icono} {metodo.nombre}</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={e=>{e.stopPropagation();onSwap(index);}} style={{background:C.blue+"22",border:"none",borderRadius:8,padding:6,cursor:"pointer"}}>
            <I n="swap" s={14} c={C.blue}/>
          </button>
          <button onClick={e=>{e.stopPropagation();onRemove(index);}} style={{background:C.red+"22",border:"none",borderRadius:8,padding:6,cursor:"pointer"}}>
            <I n="x" s={14} c={C.red}/>
          </button>
        </div>
      </div>

      {/* Contenido expandido */}
      {expanded && (
        <div style={{padding:"0 14px 14px"}}>
          {/* Parámetros */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            {[["Series",exData.series,"series"],["Reps",exData.reps,"reps"],["Descanso",exData.descanso,"desc"]].map(([label,val,key])=>(
              <div key={key}>
                <div style={{color:C.muted,fontSize:10,marginBottom:4}}>{label}</div>
                <input value={val} onChange={e=>onUpdate(index,key,e.target.value)}
                  style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",textAlign:"center"}}/>
              </div>
            ))}
          </div>

          {/* Método de intensificación */}
          <div style={{marginBottom:10}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:6}}>MÉTODO DE INTENSIFICACIÓN</div>
            <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4}}>
              {Object.entries(METODOS_INTENSIDAD).map(([key,m])=>(
                <button key={key} onClick={()=>onUpdate(index,"metodo",key)}
                  style={{flexShrink:0,background:exData.metodo===key?C.orange:C.card2,border:`1px solid ${exData.metodo===key?C.orange:C.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:12}}>{m.icono}</span>
                  <span style={{color:exData.metodo===key?"#fff":C.muted,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{m.nombre}</span>
                </button>
              ))}
            </div>
            {exData.metodo && exData.metodo!=="estandar" && METODOS_INTENSIDAD[exData.metodo]?.ejemplo && (
              <div style={{background:C.orange+"11",borderRadius:8,padding:"6px 10px",marginTop:6}}>
                <div style={{color:C.orange,fontSize:10,fontWeight:600}}>Ejemplo: {METODOS_INTENSIDAD[exData.metodo].ejemplo}</div>
              </div>
            )}
          </div>

          {/* Medidor de intensidad */}
          <MedidorIntensidad rpe={exData.rpe} rir={exData.rir} onChange={(k,v)=>onUpdate(index,k,v)}/>

          {/* Notas técnicas */}
          <div style={{background:C.blue+"11",borderRadius:10,padding:"8px 10px",marginTop:10}}>
            <div style={{color:C.blue,fontSize:10,fontWeight:700,marginBottom:4}}>📋 Nota técnica</div>
            <div style={{color:C.muted,fontSize:11,lineHeight:1.5}}>{exData.ejercicio.notas}</div>
          </div>

          {/* VIDEO EMBEBIDO */}
          {exData.ejercicio.video && (
            <VideoPlayer url={exData.ejercicio.video} nombre={exData.ejercicio.nombre}/>
          )}

          {/* Músculos */}
          <div style={{marginTop:10}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:5}}>MÚSCULOS ACTIVADOS</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              <span style={{background:C.orange+"22",color:C.orange,borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700}}>
                {exData.ejercicio.principal}
              </span>
              {(exData.ejercicio.secundarios||[]).map(m=>(
                <span key={m} style={{background:C.card2,color:C.muted,borderRadius:8,padding:"3px 8px",fontSize:11}}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Alternativas */}
          {alternativas.length > 0 && (
            <div style={{marginTop:10}}>
              <div style={{color:C.muted,fontSize:10,marginBottom:5}}>🔄 EJERCICIOS ALTERNATIVOS</div>
              <div style={{display:"flex",gap:6,overflowX:"auto",flexWrap:"wrap"}}>
                {alternativas.map(alt=>(
                  <button key={alt.id} onClick={()=>onUpdate(index,"ejercicio",alt)}
                    style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>
                    <div style={{color:C.text,fontSize:11,fontWeight:600}}>{alt.nombre}</div>
                    <div style={{color:C.muted,fontSize:10}}>{alt.equipo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notas personalizadas */}
          <div style={{marginTop:10}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:4}}>NOTAS PERSONALIZADAS</div>
            <textarea value={exData.notasPersonales||""} onChange={e=>onUpdate(index,"notasPersonales",e.target.value)}
              placeholder="Indicaciones específicas para este cliente..."
              style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:12,outline:"none",resize:"none",height:55,boxSizing:"border-box"}}/>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CONSTRUCTOR DE RUTINAS ───────────────────────────────────────────────────
export default function RutinasScreen({ user, nav }) {
  const [paso, setPaso] = useState(1); // 1: info básica, 2: días y ejercicios, 3: asignar
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dias, setDias] = useState([
    { nombre:"Lunes", ejercicios:[], activo:true },
    { nombre:"Martes", ejercicios:[], activo:false },
    { nombre:"Miércoles", ejercicios:[], activo:true },
    { nombre:"Jueves", ejercicios:[], activo:false },
    { nombre:"Viernes", ejercicios:[], activo:true },
    { nombre:"Sábado", ejercicios:[], activo:false },
    { nombre:"Domingo", ejercicios:[], activo:false },
  ]);
  const [diaActivo, setDiaActivo] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const [showSwap, setShowSwap] = useState(null); // índice del ejercicio a intercambiar
  const [clientes, setClientes] = useState([]);
  const [clienteSelec, setClienteSelec] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [rutinasGuardadas, setRutinasGuardadas] = useState([]);
  const [vistaRutinas, setVistaRutinas] = useState(true);

  useEffect(() => {
    loadClientes();
    loadRutinas();
  }, []);

  const loadClientes = async () => {
    const { data } = await supabase.from("profiles").select("id,name,email").eq("role","client").eq("status","active");
    if (data) setClientes(data);
  };

  const loadRutinas = async () => {
    const { data } = await supabase.from("rutinas").select("*").eq("trainer_id", user.id).order("created_at",{ascending:false});
    if (data) setRutinasGuardadas(data);
  };

  const agregarEjercicio = (ex) => {
    const newDias = [...dias];
    newDias[diaActivo].ejercicios.push({
      ejercicio: ex,
      series: ex.series || "3",
      reps: ex.reps || "10-12",
      descanso: ex.descanso || "90s",
      metodo: "estandar",
      rpe: 7,
      rir: 2,
      notasPersonales: "",
    });
    setDias(newDias);
    setShowSelector(false);
  };

  const removerEjercicio = (idx) => {
    const newDias = [...dias];
    newDias[diaActivo].ejercicios.splice(idx, 1);
    setDias(newDias);
  };

  const actualizarEjercicio = (idx, campo, valor) => {
    const newDias = [...dias];
    newDias[diaActivo].ejercicios[idx][campo] = valor;
    setDias(newDias);
  };

  const guardarRutina = async () => {
    if (!nombre.trim()) { alert("Escribe un nombre para la rutina"); return; }
    setGuardando(true);
    const rutinaData = {
      trainer_id: user.id,
      client_id: clienteSelec || null,
      nombre,
      descripcion,
      dias: dias.filter(d=>d.activo),
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("rutinas").insert(rutinaData);
    if (error) { alert("Error: " + error.message); setGuardando(false); return; }
    setGuardando(false);
    await loadRutinas();
    setVistaRutinas(true);
    // Reset
    setNombre(""); setDescripcion(""); setClienteSelec("");
    setDias(dias.map(d=>({...d,ejercicios:[]})));
    setPaso(1);
  };

  const diasActivos = dias.filter(d=>d.activo);
  const totalEjercicios = diasActivos.reduce((a,d)=>a+d.ejercicios.length,0);

  // ─── VISTA: LISTA DE RUTINAS ───────────────────────────────────────────────
  if (vistaRutinas) return (
    <div style={{paddingBottom:20}}>
      <div style={{background:`linear-gradient(135deg,${C.purple}22,${C.card})`,padding:"16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>nav("home")} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
              <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
            </button>
            <div>
              <div style={{color:C.text,fontWeight:800,fontSize:18}}>Rutinas</div>
              <div style={{color:C.muted,fontSize:12}}>{rutinasGuardadas.length} rutinas creadas</div>
            </div>
          </div>
          <button onClick={()=>setVistaRutinas(false)} style={{background:C.orange,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <I n="plus" s={14} c="#fff"/>Nueva
          </button>
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {rutinasGuardadas.length === 0 ? (
          <div style={{background:C.card,borderRadius:18,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:48,marginBottom:12}}>📋</div>
            <div style={{color:C.muted,marginBottom:6}}>No hay rutinas creadas</div>
            <div style={{color:C.dim,fontSize:12}}>Crea tu primera rutina con la biblioteca de ejercicios</div>
          </div>
        ) : rutinasGuardadas.map((r,i)=>(
          <div key={i} style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{color:C.text,fontWeight:800,fontSize:15}}>{r.nombre}</div>
            <div style={{color:C.muted,fontSize:12,marginTop:2}}>{r.descripcion}</div>
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <span style={{background:C.orange+"22",color:C.orange,borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700}}>
                {r.dias?.length||0} días
              </span>
              <span style={{background:C.blue+"22",color:C.blue,borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700}}>
                {r.dias?.reduce((a,d)=>a+(d.ejercicios?.length||0),0)||0} ejercicios
              </span>
              {r.client_id && <span style={{background:C.green+"22",color:C.green,borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700}}>Asignada</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── VISTA: CONSTRUCTOR ────────────────────────────────────────────────────
  return (
    <div style={{paddingBottom:20}}>
      {showSelector && (
        <SelectorEjercicio onSelect={agregarEjercicio} onClose={()=>setShowSelector(false)}/>
      )}
      {showSwap !== null && (
        <SelectorEjercicio
          onSelect={(ex)=>{ actualizarEjercicio(showSwap,"ejercicio",ex); setShowSwap(null); }}
          onClose={()=>setShowSwap(null)}
          grupoFiltro={dias[diaActivo].ejercicios[showSwap]?.ejercicio?.grupo}
        />
      )}

      {/* Header */}
      <div style={{background:C.card,padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setVistaRutinas(true)} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
          <I n="back" s={14} c={C.muted}/><span style={{color:C.muted,fontWeight:700,fontSize:12}}>Volver</span>
        </button>
        <div style={{flex:1}}>
          <div style={{color:C.text,fontWeight:800,fontSize:15}}>Nueva Rutina</div>
          <div style={{color:C.muted,fontSize:11}}>Paso {paso} de 3</div>
        </div>
        <button onClick={()=>nav("home")} style={{background:C.orange+"22",border:"none",borderRadius:10,padding:"7px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
          <I n="home" s={14} c={C.orange}/><span style={{color:C.orange,fontWeight:700,fontSize:12}}>Inicio</span>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{background:C.border,height:3}}>
        <div style={{width:`${(paso/3)*100}%`,height:"100%",background:C.orange,transition:"width 0.3s"}}/>
      </div>

      {/* PASO 1: Info básica */}
      {paso === 1 && (
        <div style={{padding:"16px"}}>
          <div style={{color:C.text,fontWeight:700,fontSize:16,marginBottom:14}}>Información de la rutina</div>
          <div style={{marginBottom:12}}>
            <label style={{color:C.muted,fontSize:12,display:"block",marginBottom:5}}>Nombre de la rutina *</label>
            <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Fullbody Hipertrofia 4 días"
              style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{color:C.muted,fontSize:12,display:"block",marginBottom:5}}>Descripción</label>
            <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} placeholder="Objetivo, nivel requerido, observaciones..."
              style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:14,outline:"none",resize:"none",height:80,boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{color:C.muted,fontSize:12,display:"block",marginBottom:8}}>Días de entrenamiento</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {dias.map((d,i)=>(
                <button key={i} onClick={()=>{ const nd=[...dias]; nd[i].activo=!nd[i].activo; setDias(nd); }}
                  style={{background:d.activo?C.orange:C.card,border:`1px solid ${d.activo?C.orange:C.border}`,borderRadius:10,padding:"8px 12px",color:d.activo?"#fff":C.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  {d.nombre.slice(0,3)}
                </button>
              ))}
            </div>
            <div style={{color:C.muted,fontSize:12,marginTop:8}}>{diasActivos.length} días seleccionados</div>
          </div>
          <button onClick={()=>setPaso(2)} disabled={!nombre.trim()||diasActivos.length===0}
            style={{width:"100%",background:nombre.trim()&&diasActivos.length>0?`linear-gradient(135deg,${C.orange},${C.orangeL})`:C.border,border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>
            Continuar →
          </button>
        </div>
      )}

      {/* PASO 2: Ejercicios por día */}
      {paso === 2 && (
        <div>
          {/* Tabs de días */}
          <div style={{display:"flex",overflowX:"auto",background:C.card,borderBottom:`1px solid ${C.border}`}}>
            {diasActivos.map((d,i)=>{
              const idxReal = dias.findIndex(dd=>dd.nombre===d.nombre);
              return (
                <button key={i} onClick={()=>setDiaActivo(idxReal)}
                  style={{flexShrink:0,background:"none",border:"none",borderBottom:`2px solid ${diaActivo===idxReal?C.orange:"transparent"}`,color:diaActivo===idxReal?C.orange:C.muted,cursor:"pointer",padding:"10px 14px",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>
                  {d.nombre.slice(0,3)}
                  {d.ejercicios.length>0&&<span style={{background:C.orange,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10}}>{d.ejercicios.length}</span>}
                </button>
              );
            })}
          </div>

          <div style={{padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:C.text,fontWeight:700}}>{dias[diaActivo].nombre}</div>
              <button onClick={()=>setShowSelector(true)}
                style={{background:C.orange,border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                <I n="plus" s={14} c="#fff"/>Ejercicio
              </button>
            </div>

            {dias[diaActivo].ejercicios.length === 0 ? (
              <div style={{background:C.card,borderRadius:16,padding:"40px",textAlign:"center",border:`2px dashed ${C.border}`}}>
                <div style={{fontSize:40,marginBottom:10}}>💪</div>
                <div style={{color:C.muted,marginBottom:8}}>Sin ejercicios este día</div>
                <button onClick={()=>setShowSelector(true)} style={{background:C.orange,border:"none",borderRadius:12,padding:"10px 20px",color:"#fff",fontWeight:700,cursor:"pointer"}}>
                  + Agregar ejercicio
                </button>
              </div>
            ) : (
              dias[diaActivo].ejercicios.map((ex,i)=>(
                <EjercicioCard key={i} exData={ex} index={i}
                  onRemove={removerEjercicio}
                  onUpdate={actualizarEjercicio}
                  onSwap={(idx)=>setShowSwap(idx)}
                />
              ))
            )}

            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={()=>setPaso(1)} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",color:C.muted,fontWeight:700,cursor:"pointer"}}>← Atrás</button>
              <button onClick={()=>setPaso(3)} disabled={totalEjercicios===0}
                style={{flex:2,background:totalEjercicios>0?`linear-gradient(135deg,${C.orange},${C.orangeL})`:C.border,border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:800,cursor:"pointer"}}>
                Continuar ({totalEjercicios} ejercicios) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: Asignar y guardar */}
      {paso === 3 && (
        <div style={{padding:"16px"}}>
          <div style={{color:C.text,fontWeight:700,fontSize:16,marginBottom:14}}>Asignar y guardar</div>

          {/* Resumen */}
          <div style={{background:C.card,borderRadius:16,padding:"14px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{color:C.text,fontWeight:700,marginBottom:10}}>📋 Resumen de la rutina</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Nombre",nombre],["Días",`${diasActivos.length} días`],["Ejercicios totales",totalEjercicios],["Sesión estimada","45-90 min"]].map(([l,v])=>(
                <div key={l} style={{background:C.card2,borderRadius:10,padding:"10px"}}>
                  <div style={{color:C.muted,fontSize:11}}>{l}</div>
                  <div style={{color:C.text,fontWeight:700,fontSize:13}}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Días con ejercicios */}
          {diasActivos.map((d,i)=>(
            <div key={i} style={{background:C.card,borderRadius:12,padding:"12px",marginBottom:8,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div style={{color:C.text,fontWeight:700}}>{d.nombre}</div>
                <span style={{color:C.orange,fontSize:12}}>{d.ejercicios.length} ejercicios</span>
              </div>
              {d.ejercicios.map((ex,j)=>(
                <div key={j} style={{color:C.muted,fontSize:12,marginTop:3}}>• {ex.ejercicio.nombre} — {ex.series}×{ex.reps}</div>
              ))}
            </div>
          ))}

          {/* Asignar a cliente */}
          <div style={{marginBottom:20,marginTop:16}}>
            <label style={{color:C.muted,fontSize:12,display:"block",marginBottom:8}}>Asignar a cliente (opcional)</label>
            <select value={clienteSelec} onChange={e=>setClienteSelec(e.target.value)}
              style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box"}}>
              <option value="">Sin asignar (guardar como plantilla)</option>
              {clientes.map(c=>(
                <option key={c.id} value={c.id}>{c.name||c.email}</option>
              ))}
            </select>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPaso(2)} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",color:C.muted,fontWeight:700,cursor:"pointer"}}>← Atrás</button>
            <button onClick={guardarRutina} disabled={guardando}
              style={{flex:2,background:guardando?C.border:`linear-gradient(135deg,${C.green},#27ae60)`,border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:800,cursor:"pointer"}}>
              {guardando?"⏳ Guardando...":"✅ Guardar rutina"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
