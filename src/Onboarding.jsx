import { useState } from 'react'
import { supabase } from './supabase.js'

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeLight:"#FF8C5A", text:"#FFFFFF",
  textMuted:"#8891A4", textDim:"#5A6275", green:"#2ECC8E",
  blue:"#4A9EFF", purple:"#8B5CF6", red:"#FF4757",
}

const STEPS = [
  { id:"nombre",    title:"¿Cómo te llamas?",              subtitle:"Tu nombre aparecerá en tu perfil",         type:"text",    field:"name",        placeholder:"Ej: Carlos Mendoza",    emoji:"👋" },
  { id:"telefono",  title:"¿Tu número de teléfono?",       subtitle:"Para que tu entrenador pueda contactarte", type:"tel",     field:"phone",       placeholder:"+56 9 1234 5678",        emoji:"📱" },
  { id:"nacimiento",title:"¿Cuándo naciste?",              subtitle:"Usamos esto para personalizar tu plan",    type:"date",    field:"birthdate",   placeholder:"",                       emoji:"🎂" },
  { id:"peso",      title:"¿Cuánto pesas?",                subtitle:"Tu peso actual en kilogramos",             type:"number",  field:"weight",      placeholder:"Ej: 75",                 emoji:"⚖️", unit:"kg" },
  { id:"talla",     title:"¿Cuánto mides?",                subtitle:"Tu altura en centímetros",                 type:"number",  field:"height",      placeholder:"Ej: 175",                emoji:"📏", unit:"cm" },
  { id:"objetivo",  title:"¿Cuál es tu objetivo?",         subtitle:"Elige el que más te identifica",           type:"options", field:"goal",
    options:[
      { value:"Bajar de peso",        icon:"🔥", desc:"Reducir grasa corporal" },
      { value:"Ganar músculo",         icon:"💪", desc:"Aumentar masa muscular" },
      { value:"Fuerza máxima",         icon:"🏋️", desc:"Levantar más peso" },
      { value:"Rendimiento deportivo", icon:"⚡", desc:"Mejorar mi deporte" },
      { value:"Recondicionar",         icon:"🌱", desc:"Volver a estar activo" },
      { value:"Mantenimiento",         icon:"⚖️", desc:"Mantener mi condición" },
    ]
  },
  { id:"nivel",     title:"¿Cuál es tu nivel?",            subtitle:"Sé honesto, esto es solo para ti",         type:"options", field:"level",
    options:[
      { value:"Principiante", icon:"🌱", desc:"Menos de 6 meses entrenando" },
      { value:"Intermedio",   icon:"💪", desc:"Entre 6 meses y 2 años" },
      { value:"Avanzado",     icon:"🔥", desc:"Más de 2 años de experiencia" },
    ]
  },
  { id:"dias",      title:"¿Cuántos días puedes entrenar?", subtitle:"Por semana, siendo realista",              type:"options", field:"days_per_week",
    options:[
      { value:"2", icon:"2️⃣", desc:"2 días por semana" },
      { value:"3", icon:"3️⃣", desc:"3 días por semana" },
      { value:"4", icon:"4️⃣", desc:"4 días por semana" },
      { value:"5", icon:"5️⃣", desc:"5 o más días por semana" },
    ]
  },
  { id:"lesiones",  title:"¿Tienes alguna lesión?",         subtitle:"Será visible solo para tu entrenador",     type:"textarea", field:"injuries",   placeholder:"Ej: Dolor en rodilla derecha, lumbalgia... (escribe 'ninguna' si no tienes)", emoji:"🩺" },
  { id:"historial", title:"¿Tienes historial deportivo?",   subtitle:"Cuéntanos brevemente",                     type:"textarea", field:"sport_history", placeholder:"Ej: Jugué fútbol 5 años, hice gym 1 año... (escribe 'ninguno' si no tienes)", emoji:"🏅" },
]

export default function Onboarding({ userId, userEmail, onComplete }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = STEPS[step]
  const progress = ((step) / STEPS.length) * 100

  const getValue = () => data[current.field] || ''
  const setValue = (val) => setData(prev => ({ ...prev, [current.field]: val }))

  const canContinue = () => {
    const val = getValue()
    if (current.type === 'options') return !!val
    if (current.field === 'name') return val.trim().length > 1
    return val !== ''
  }

  const handleNext = async () => {
    if (!canContinue()) { setError('Por favor completa este campo'); return }
    setError('')

    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      // Save to Supabase
      setLoading(true)
      try {
        const profile = {
          id: userId,
          email: userEmail,
          name: data.name || userEmail.split('@')[0],
          role: 'client',
          phone: data.phone || null,
          birthdate: data.birthdate || null,
          weight: data.weight ? parseFloat(data.weight) : null,
          height: data.height ? parseFloat(data.height) : null,
          goal: data.goal || null,
          level: data.level || null,
          days_per_week: data.days_per_week ? parseInt(data.days_per_week) : null,
          injuries: data.injuries || null,
          sport_history: data.sport_history || null,
          onboarding_done: true,
        }
        const { error: err } = await supabase.from('profiles').upsert(profile)
        if (err) throw err
        onComplete(profile)
      } catch (err) {
        setError('Error al guardar: ' + err.message)
      }
      setLoading(false)
    }
  }

  const handleBack = () => { if (step > 0) { setStep(s => s - 1); setError('') } }

  return (
    <div style={{ background:C.bg, minHeight:'100vh', maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', fontFamily:"system-ui,-apple-system,sans-serif" }}>

      {/* Progress bar */}
      <div style={{ height:3, background:C.border }}>
        <div style={{ width:progress+'%', height:'100%', background:`linear-gradient(90deg,${C.orange},${C.orangeLight})`, transition:'width 0.4s ease', borderRadius:2 }}/>
      </div>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px' }}>
        {step === 0 ? (
          <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.textDim, fontSize:13 }}>
            Salir
          </button>
        ) : (
          <button onClick={handleBack} style={{ background:'none', border:'none', cursor:'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
        )}
        <div style={{ color:C.textDim, fontSize:13 }}>{step + 1} de {STEPS.length}</div>
        <div style={{ width:24 }}/>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:'20px 24px', display:'flex', flexDirection:'column' }}>

        {/* Emoji + Title */}
        <div style={{ marginBottom:32 }}>
          {current.emoji && (
            <div style={{ fontSize:48, marginBottom:16 }}>{current.emoji}</div>
          )}
          <h1 style={{ color:C.text, fontSize:26, fontWeight:900, margin:'0 0 8px', lineHeight:1.2 }}>{current.title}</h1>
          <p style={{ color:C.textMuted, fontSize:14, margin:0, lineHeight:1.6 }}>{current.subtitle}</p>
        </div>

        {/* Input */}
        {(current.type === 'text' || current.type === 'tel' || current.type === 'date' || current.type === 'number') && (
          <div style={{ position:'relative' }}>
            <input
              type={current.type}
              value={getValue()}
              onChange={e => { setValue(e.target.value); setError('') }}
              placeholder={current.placeholder}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              autoFocus
              style={{ width:'100%', background:C.card, border:`2px solid ${error?C.red:getValue()?C.orange:C.border}`, borderRadius:16, padding: current.unit ? '16px 60px 16px 20px' : '16px 20px', color:C.text, fontSize:18, outline:'none', boxSizing:'border-box', transition:'border 0.2s' }}
            />
            {current.unit && (
              <div style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', color:C.orange, fontWeight:700, fontSize:16 }}>{current.unit}</div>
            )}
          </div>
        )}

        {current.type === 'textarea' && (
          <textarea
            value={getValue()}
            onChange={e => { setValue(e.target.value); setError('') }}
            placeholder={current.placeholder}
            autoFocus
            rows={4}
            style={{ width:'100%', background:C.card, border:`2px solid ${error?C.red:getValue()?C.orange:C.border}`, borderRadius:16, padding:'16px 20px', color:C.text, fontSize:15, outline:'none', boxSizing:'border-box', resize:'none', fontFamily:'inherit', lineHeight:1.6 }}
          />
        )}

        {current.type === 'options' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {current.options.map(opt => {
              const selected = getValue() === opt.value
              return (
                <button key={opt.value} onClick={() => { setValue(opt.value); setError('') }}
                  style={{ background: selected ? `linear-gradient(135deg,${C.orange}22,${C.orange}11)` : C.card, border:`2px solid ${selected?C.orange:C.border}`, borderRadius:16, padding:'14px 18px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, textAlign:'left', transition:'all 0.15s' }}>
                  <div style={{ fontSize:26, flexShrink:0 }}>{opt.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:C.text, fontWeight:700, fontSize:15 }}>{opt.value}</div>
                    <div style={{ color:C.textMuted, fontSize:12, marginTop:2 }}>{opt.desc}</div>
                  </div>
                  {selected && (
                    <div style={{ width:24, height:24, borderRadius:'50%', background:C.orange, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ color:C.red, fontSize:13, marginTop:10 }}>⚠️ {error}</div>
        )}

        <div style={{ flex:1 }}/>

        {/* Continue button */}
        <button onClick={handleNext} disabled={loading || !canContinue()}
          style={{ width:'100%', background: canContinue() ? `linear-gradient(135deg,${C.orange},${C.orangeLight})` : C.card, border:'none', borderRadius:18, padding:'17px', color: canContinue() ? '#fff' : C.textDim, fontWeight:800, fontSize:16, cursor: canContinue() ? 'pointer' : 'not-allowed', marginTop:24, transition:'all 0.2s' }}>
          {loading ? '⏳ Guardando...' : step === STEPS.length - 1 ? '¡Empezar! 🚀' : 'Continuar →'}
        </button>

        {/* Skip optional */}
        {(current.field === 'injuries' || current.field === 'sport_history' || current.field === 'phone') && (
          <button onClick={() => { setValue('ninguno'); setTimeout(handleNext, 50) }}
            style={{ background:'none', border:'none', color:C.textMuted, fontSize:13, cursor:'pointer', marginTop:12, textAlign:'center' }}>
            Omitir este paso
          </button>
        )}
      </div>
    </div>
  )
}
