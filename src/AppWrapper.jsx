import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import App from './App.jsx'
import Onboarding from './Onboarding.jsx'

const C = {
  bg:"#0A0B0F", card:"#12141A", card2:"#1A1D26", border:"#252836",
  orange:"#FF6B35", orangeLight:"#FF8C5A", text:"#FFFFFF",
  textMuted:"#8891A4", textDim:"#5A6275", green:"#2ECC8E", red:"#FF4757",
}

const AuthScreen = ({ onAuth }) => {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const inputStyle = {
    width:'100%', background:C.card2, border:`1px solid ${C.border}`,
    borderRadius:14, padding:'13px 16px', color:C.text, fontSize:14,
    outline:'none', boxSizing:'border-box', marginBottom:10,
  }

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    try {
      if (mode === 'login') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
        onAuth({ id: data.user.id, email: data.user.email, name: profile?.name || email.split('@')[0], role: profile?.role || 'client', onboarding_done: profile?.onboarding_done || false, ...profile })
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password })
        if (err) throw err
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, email, name: email.split('@')[0], role, onboarding_done: role === 'trainer' })
          onAuth({ id: data.user.id, email, name: email.split('@')[0], role, onboarding_done: role === 'trainer' })
        } else {
          setSuccess('¡Revisa tu email para confirmar tu cuenta!')
          setMode('login')
        }
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : err.message === 'User already registered' ? 'Este email ya está registrado' : err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ background:C.bg, minHeight:'100vh', maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
        <div style={{ width:4, height:52, borderRadius:4, background:C.orange }}/>
        <div>
          <div style={{ color:C.text, fontSize:38, fontWeight:900, letterSpacing:-1, lineHeight:1 }}>JUD</div>
          <div style={{ color:C.orange, fontSize:11, fontWeight:400, letterSpacing:7, marginTop:2 }}>PERFORMANCE</div>
        </div>
        <div style={{ width:8, height:8, borderRadius:'50%', background:C.orange, alignSelf:'flex-start', marginTop:6 }}/>
      </div>
      <p style={{ color:C.textMuted, fontSize:13, marginBottom:32, textAlign:'center' }}>Tu plataforma de entrenamiento personalizado</p>
      <div style={{ width:'100%', maxWidth:400 }}>
        {mode === 'register' && (
          <div style={{ display:'flex', background:C.card, borderRadius:14, padding:4, marginBottom:16, border:`1px solid ${C.border}` }}>
            {['trainer','client'].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:'10px', background: role===r ? `linear-gradient(135deg,${C.orange},${C.orangeLight})` : 'transparent', color: role===r ? '#fff' : C.textMuted, border:'none', borderRadius:11, cursor:'pointer', fontWeight:700, fontSize:13 }}>
                {r==='trainer' ? '🏋️ Entrenador' : '💪 Atleta'}
              </button>
            ))}
          </div>
        )}
        <div style={{ display:'flex', background:C.card, borderRadius:14, padding:4, marginBottom:20, border:`1px solid ${C.border}` }}>
          {[['login','Iniciar sesión'],['register','Registrarse']].map(([m,label]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{ flex:1, padding:'10px', background: mode===m ? C.card2 : 'transparent', color: mode===m ? C.text : C.textMuted, border: mode===m ? `1px solid ${C.border}` : 'none', borderRadius:11, cursor:'pointer', fontWeight:700, fontSize:13 }}>{label}</button>
          ))}
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" style={inputStyle}/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" style={{...inputStyle, marginBottom:16}} onKeyDown={e => e.key==='Enter' && handleSubmit()}/>
        {error && <div style={{ background:C.red+'22', border:`1px solid ${C.red}44`, borderRadius:12, padding:'10px 14px', marginBottom:12, color:C.red, fontSize:13 }}>⚠️ {error}</div>}
        {success && <div style={{ background:C.green+'22', border:`1px solid ${C.green}44`, borderRadius:12, padding:'10px 14px', marginBottom:12, color:C.green, fontSize:13 }}>✅ {success}</div>}
        <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', background: loading ? C.border : `linear-gradient(135deg,${C.orange},${C.orangeLight})`, border:'none', borderRadius:16, padding:'15px', color:'#fff', fontWeight:800, fontSize:15, cursor: loading?'not-allowed':'pointer' }}>
          {loading ? '⏳ Cargando...' : mode==='login' ? 'Iniciar Sesión' : 'Crear cuenta'}
        </button>
      </div>
    </div>
  )
}

const LoadingScreen = () => (
  <div style={{ background:'#0A0B0F', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui,sans-serif' }}>
    <div style={{ textAlign:'center' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:16 }}>
        <div style={{ width:3, height:40, borderRadius:3, background:'#FF6B35' }}/>
        <div style={{ color:'#fff', fontSize:28, fontWeight:900, letterSpacing:-1 }}>JUD</div>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'#FF6B35', alignSelf:'flex-start', marginTop:4 }}/>
      </div>
      <div style={{ color:'#5A6275', fontSize:13 }}>Cargando...</div>
    </div>
  </div>
)

export default function AppWrapper() {
  const [session, setSession] = useState(undefined)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) { await loadProfile(session.user) } else { setSession(null) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) { await loadProfile(session.user) } else { setSession(null); setUserProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (user) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const userData = { id: user.id, email: user.email, name: profile?.name || user.email.split('@')[0], role: profile?.role || 'client', onboarding_done: profile?.onboarding_done || false, ...profile }
    setUserProfile(userData)
    setSession(user)
  }

  const handleAuth = (userData) => {
    setUserProfile(userData)
    setSession({ id: userData.id })
  }

  const handleOnboardingComplete = async (profile) => {
    setUserProfile(prev => ({ ...prev, ...profile, onboarding_done: true }))
  }

  const handleSignOut = async () => { await supabase.auth.signOut() }

  if (session === undefined) return <LoadingScreen />
  if (!session) return <AuthScreen onAuth={handleAuth} />

  // Show onboarding for new clients
  if (userProfile && userProfile.role === 'client' && !userProfile.onboarding_done) {
    return <Onboarding userId={userProfile.id} userEmail={userProfile.email} onComplete={handleOnboardingComplete} />
  }

  return <App user={userProfile} onSignOut={handleSignOut} />
}
