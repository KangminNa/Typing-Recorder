import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

export default function RecordingsList(){
  const { token } = useContext(AuthContext)
  const [rows, setRows] = useState<any[]>([])
  const [playing, setPlaying] = useState<string | null>(null)

  useEffect(()=>{ fetchList() }, [])

  async function fetchList(){
    try{
      const res = await fetch('/api/recordings', { headers: token? { Authorization: `Bearer ${token}` } : undefined })
      const j = await res.json()
      if(j && j.success) setRows(j.rows || [])
    }catch(e){ console.error(e) }
  }

  async function play(rec:any){
    if(!rec || !rec.data) return
    // data is base64? backend returns bytea; we'll request endpoint /api/recordings/:id/data
    try{
      const res = await fetch(`/api/recordings/${rec.id}/data`, { headers: token? { Authorization: `Bearer ${token}` } : undefined })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      setPlaying(rec.id)
      audio.onended = ()=> setPlaying(null)
      audio.play()
    }catch(e){ console.error(e) }
  }

  return (
    <div className="recordings-list">
      <h4>Recordings</h4>
      {rows.length===0 && <div>No recordings</div>}
      {rows.map(r=> (
        <div key={r.id} className="record-row">
          <div style={{flex:1}}>{r.userId} • {r.durationMs}ms • {new Date(r.createdAt).toLocaleString()}</div>
          <div><button className="ghost" onClick={()=>play(r)}>{playing===r.id? 'Playing' : 'Play'}</button></div>
        </div>
      ))}
    </div>
  )
}
