import React, {useState, useEffect} from 'react'

export default function ProfileForm({token, api, me, refreshMe}){
  const [fullName, setFullName] = useState(me?.full_name || '')
  const [dob, setDob] = useState(me?.date_of_birth || '')
  const [placeQuery, setPlaceQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedPlace, setSelectedPlace] = useState({place_name: me?.place_of_birth || '', lat: me?.latitude || '', lon: me?.longitude || ''})

  useEffect(()=>{
    setFullName(me?.full_name || '')
    setDob(me?.date_of_birth || '')
    setSelectedPlace({place_name: me?.place_of_birth || '', lat: me?.latitude || '', lon: me?.longitude || ''})
  },[me])

  useEffect(()=>{
    if(placeQuery.length < 3){ setSuggestions([]); return }
    const t = setTimeout(async ()=>{
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeQuery)}&addressdetails=1&limit=5`)
      const j = await res.json()
      setSuggestions(j)
    }, 300)
    return ()=>clearTimeout(t)
  },[placeQuery])

  async function save(){
    const payload = {
      user_id: me.id,
      full_name: fullName,
      date_of_birth: dob || null,
      place_of_birth: selectedPlace.place_name,
      latitude: selectedPlace.lat ? parseFloat(selectedPlace.lat) : null,
      longitude: selectedPlace.lon ? parseFloat(selectedPlace.lon) : null
    }
    const r = await fetch(api + '/profile/update', {
      method: 'POST',
      headers: {'Content-Type':'application/json', Authorization: token},
      body: JSON.stringify(payload)
    })
    if(r.ok){ alert('Saved'); refreshMe() } else { alert('Error saving') }
  }

  return (
    <div style={{border:'1px solid #ddd', padding:10, marginTop:10, borderRadius:6, maxWidth:600}}>
      <h3>Update Profile</h3>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <input placeholder='Full name' value={fullName} onChange={e=>setFullName(e.target.value)} />
        <label>Date of Birth</label>
        <input type='date' value={dob||''} onChange={e=>setDob(e.target.value)} />
        <label>Place of Birth</label>
        <input placeholder='Type place...' value={placeQuery} onChange={e=>setPlaceQuery(e.target.value)} />
        <div>
          {suggestions.map(s=>(
            <div key={s.place_id} style={{padding:6,cursor:'pointer'}} onClick={()=>{ setSelectedPlace({place_name: s.display_name, lat: s.lat, lon: s.lon}); setPlaceQuery(''); setSuggestions([]) }}>
              {s.display_name}
            </div>
          ))}
        </div>
        <div>
          <strong>Selected:</strong> {selectedPlace.place_name} {selectedPlace.lat ? `(lat: ${selectedPlace.lat}, lon: ${selectedPlace.lon})` : ''}
        </div>
        <button onClick={save}>Save Profile</button>
      </div>
    </div>
  )
}
