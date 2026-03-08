import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

export default function Admin(){
  const { token } = useContext(AuthContext)
  const [lessons, setLessons] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    const r = await fetch('/api/lessons')
    const j = await r.json()
    if(j && j.success) setLessons(j.rows)
  }

  async function save(){
    if(!token) return alert('Login required')
    const url = editing.id ? `/api/lessons/${editing.id}` : '/api/lessons'
    const method = editing.id ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(editing) })
    const j = await r.json(); if(j && j.success){ fetchList(); setEditing(null) }
  }

  async function del(id:string){ if(!token) return alert('Login required'); if(!confirm('Delete?')) return; await fetch(`/api/lessons/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchList() }

  return (
    <div className="admin-panel">
      <h3>Lessons</h3>
      <div className="admin-list">
        {lessons.map(l=> (
          <div key={l.id} className="admin-row">
            <div style={{flex:1}}>{l.title} <small style={{color:'#666'}}>({l.language})</small></div>
            <div><button className="ghost" onClick={()=>setEditing(l)}>Edit</button> <button className="ghost" onClick={()=>del(l.id)}>Delete</button></div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <button className="primary" onClick={()=>setEditing({ title:'', language:'en', content:'' })}>New Lesson</button>
      </div>

      {editing && (
        <div className="editor">
          <h4>{editing.id? 'Edit':'New'}</h4>
          <input value={editing.title} onChange={e=>setEditing({...editing, title:e.target.value})} placeholder="Title" />
          <select value={editing.language} onChange={e=>setEditing({...editing, language:e.target.value})}>
            <option value="en">English</option>
            <option value="ko">Korean</option>
          </select>
          <textarea value={editing.content} onChange={e=>setEditing({...editing, content:e.target.value})} rows={6} />
          <div style={{marginTop:8}}>
            <button className="primary" onClick={save}>Save</button>
            <button className="ghost" style={{marginLeft:8}} onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
