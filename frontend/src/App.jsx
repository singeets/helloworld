import React, {useState, useEffect} from 'react'
import Login from './Login'
import Register from './Register'
import Users from './Users'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(()=>{
    if(token) localStorage.setItem('token', token); else localStorage.removeItem('token')
  },[token])

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
          <button onClick={async ()=>{await fetch(API+'/logout',{method:'POST',headers:{Authorization:token}}); setToken(null)}}>Logout</button>
          <Users token={token} api={API} />
        </div>
      )}
    </div>
  )
}
