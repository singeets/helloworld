import React, {useEffect, useState} from 'react'

export default function Users({token, api}){
  const [users,setUsers]=useState([])
  useEffect(()=>{fetchUsers()},[])
  async function fetchUsers(){
    const r = await fetch(api+'/users'); const j=await r.json(); setUsers(j)
  }
  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map(u=> (
          <li key={u.id}>{u.username} — {u.count} <button onClick={async ()=>{await fetch(`${api}/users/${u.id}/increment`,{method:'POST',headers:{Authorization:token}}); fetchUsers()}}>+1</button></li>
        ))}
      </ul>
    </div>
  )
}
