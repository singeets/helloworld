import React, {useState} from 'react'

export default function Login({onLogin, api}){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  return (
    <div>
      <h3>Login</h3>
      <input placeholder='username' value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={async ()=>{
        const r = await fetch(api+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
        if(r.ok){ const j = await r.json(); onLogin(j.token) } else { alert('login failed') }
      }}>Login</button>
    </div>
  )
}
