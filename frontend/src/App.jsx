import React, {useState, useEffect} from 'react'
import Login from './Login'
import Register from './Register'
import Users from './Users'
import ProfileForm from './ProfileForm'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [me, setMe] = useState(null)

  useEffect(()=>{
    if(token) localStorage.setItem('token', token); else localStorage.removeItem('token')
    if(token) fetchMe()
  },[token])

  async function fetchMe(){
    const r = await fetch(API+'/me', {headers:{Authorization: token}})
    if(r.ok){ const j = await r.json(); setMe(j) } else { setMe(null) }
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>Mini App</h2>
      {!token ? (
        <div style={{display:'flex',gap:20}}>
          <Login onLogin={setToken} api={API} />
          <Register api={API} />
        </div>
      ) : (
        <div>
          <div style={{display:'flex',gap:10, alignItems:'center'}}>
            <button onClick={async ()=>{await fetch(API+'/logout',{method:'POST',headers:{Authorization:token}}); setToken(null); setMe(null)}}>Logout</button>
            <div style={{marginLeft:20}}>
              {me ? <div>Hi, {me.full_name || me.username}</div> : 'Loading...'}
            </div>
          </div>
          <ProfileForm token={token} api={API} me={me} refreshMe={fetchMe} />
          <Users token={token} api={API} />
        </div>
      )}
    </div>
  )
}
