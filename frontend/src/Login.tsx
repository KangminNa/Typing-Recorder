import React, { useState, useContext } from 'react'
import { AuthContext } from './auth/AuthContext'

export default function Login(){
  const { login } = useContext(AuthContext)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [mode,setMode]=useState<'login'|'register'>('login')

  async function submit(e:any){
    e.preventDefault()
    try{
      const url = mode==='login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
      const j = await res.json()
      if(j && j.success){
        login(j.token.accessToken)
        alert('OK')
      } else {
        alert('Failed: '+(j.message||JSON.stringify(j)))
      }
    }catch(e){ console.error(e); alert('Error') }
  }

  return (
    <div className="auth-box">
      <h3>{mode==='login'?'Login':'Register'}</h3>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:8}}>
          <button type="submit" className="primary">{mode==='login'? 'Sign in' : 'Sign up'}</button>
          <button type="button" className="ghost" onClick={()=>setMode(mode==='login'?'register':'login')} style={{marginLeft:8}}>{mode==='login'?'Create account':'Have account'}</button>
        </div>
      </form>
    </div>
  )
}
