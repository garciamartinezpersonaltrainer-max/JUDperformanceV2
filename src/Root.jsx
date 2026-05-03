import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import App from './App.jsx'

const C = {
  bg:"#0A0B0F", card:"#12141A", border:"#252836",
  orange:"#FF6B35", orangeL:"#FF8C5A", text:"#FFFFFF",
  muted:"#8891A4", dim:"#5A6275", green:"#2ECC8E", red:"#FF4757",
}

const Loading = () => (
  <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
    <div style={{textAlign:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:12}}>
        <div style={{width:3,height:40,borderRadius:3,background:C.orange}}/>
        <div style={{color:C.text,fontSize:28,fontWeight:900,letterSpacing:-1}}>JUD</div>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.orange,alignSelf:"flex-start",marginTop:4}}/>
      </div>
      <div style={{color:C.muted,fontSize:13}}>Cargando...</div>
    </div>
  </div>
)

const AuthScreen = ({ onAuth }) => {
  const [mode,setMode]=useState("login")
  const [role,setRole]=useState("client")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [name,setName]=useState("")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [success,setSuccess]=useState("")

  const inp = { width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:10 }

  const submit = async () => {
    setError(""); setSuccess("")
    if(!email||!password){setError("Completa todos los campos");return}
    if(mode==="register"&&!name){setError("Ingresa tu nombre");return}
    setLoading(true)
    try {
      if(mode==="login"){
        const {data,error:err}=await supabase.auth.signInWithPassword({email,password})
        if(err) throw err
        const {data:profile}=await supabase.from("profiles").select("*").eq("id",data.user.id).single()
        onAuth({id:data.user.id,email:data.user.email,name:profile?.name||email.split("@")[0],role:profile?.role||"client"})
      } else {
        const {data,error:err}=await supabase.auth.signUp({email,password})
        if(err) throw err
        if(data.user){
          await supabase.from("profiles").upsert({id:data.user.id,email,name,role,onboarding_done:false})
          onAuth({id:data.user.id,email,name,role,onboarding_done:false})
        } else {
          setSuccess("¡Revisa tu email para confirmar tu cuenta!")
          setMode("login")
        }
      }
    } catch(err){
      setError(err.message==="Invalid login credentials"?"Email o contraseña incorrectos":err.message==="User already registered"?"Este email ya está registrado":err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif"}}>
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
        {mode==="register"&&(
          <div style={{display:"flex",background:C.card,borderRadius:14,padding:4,marginBottom:14,border:`1px solid ${C.border}`}}>
            {["trainer","client"].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:"10px",background:role===r?`linear-gradient(135deg,${C.orange},${C.orangeL})`:"transparent",color:role===r?"#fff":C.muted,border:"none",borderRadius:11,cursor:"pointer",fontWeight:700,fontSize:13}}>
                {r==="trainer"?"🏋️ Entrenador":"💪 Atleta"}
              </button>
            ))}
          </div>
        )}
        <div style={{display:"flex",background:C.card,borderRadius:14,padding:4,marginBottom:16,border:`1px solid ${C.border}`}}>
          {[["login","Iniciar sesión"],["register","Registrarse"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setError("");setSuccess("")}} style={{flex:1,padding:"10px",background:mode===m?C.card:"transparent",border:mode===m?`1px solid ${C.border}`:"none",borderRadius:11,color:mode===m?C.text:C.muted,cursor:"pointer",fontWeight:700,fontSize:13}}>
              {l}
            </button>
          ))}
        </div>
        {mode==="register"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre completo" style={inp}/>}
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo electrónico" style={inp}/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" onKeyDown={e=>e.key==="Enter"&&submit()} style={{...inp,marginBottom:14}}/>
        {error&&<div style={{background:C.red+"22",border:`1px solid ${C.red}44`,borderRadius:12,padding:"10px 14px",marginBottom:12,color:C.red,fontSize:13}}>⚠️ {error}</div>}
        {success&&<div style={{background:C.green+"22",border:`1px solid ${C.green}44`,borderRadius:12,padding:"10px 14px",marginBottom:12,color:C.green,fontSize:13}}>✅ {success}</div>}
        <button onClick={submit} disabled={loading} style={{width:"100%",background:loading?C.border:`linear-gradient(135deg,${C.orange},${C.orangeL})`,border:"none",borderRadius:14,padding:"14px",color:"#fff",fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer"}}>
          {loading?"⏳ Cargando...":mode==="login"?"Iniciar Sesión":"Crear cuenta"}
        </button>
      </div>
    </div>
  )
}

export default function Root() {
  const [session,setSession]=useState(undefined)
  const [user,setUser]=useState(null)

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){ await loadProfile(session.user) } else { setSession(null) }
    })
    const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_,session)=>{
      if(session){ await loadProfile(session.user) } else { setSession(null);setUser(null) }
    })
    return()=>subscription.unsubscribe()
  },[])

  const loadProfile = async(u) => {
    const {data:profile}=await supabase.from("profiles").select("*").eq("id",u.id).single()
    const userData={id:u.id,email:u.email,name:profile?.name||u.email.split("@")[0],role:profile?.role||"client",...profile}
    setUser(userData); setSession(u)
  }

  const handleAuth = (userData) => { setUser(userData); setSession({id:userData.id}) }
  const handleSignOut = async() => { await supabase.auth.signOut() }

  if(session===undefined) return <Loading/>
  if(!session) return <AuthScreen onAuth={handleAuth}/>
  return <App user={user} onSignOut={handleSignOut}/>
}
