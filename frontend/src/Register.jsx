import React, {useState} from 'react'

export default function Register({api}){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  return (
    <div>
      <h3>Register</h3>
      <input placeholder='username' value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={async ()=>{
        const r = await fetch(api+'/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
        if(r.ok) { alert('registered. You can login now') } else { const t = await r.text(); alert('error: '+t) }
      }}>Register</button>
    </div>
  )
}
