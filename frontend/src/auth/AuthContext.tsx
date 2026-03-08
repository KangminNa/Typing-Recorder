import React, { createContext, useState, useEffect } from 'react'

type User = { id:string; email:string; name?:string; role?:string }

export const AuthContext = createContext<any>(null)

export const AuthProvider: React.FC<{children:any}> = ({children})=>{
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  useEffect(()=>{
    if(token){
      localStorage.setItem('token', token)
      // fetch /api/auth/me
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()).then(j=>{
        if(j && j.success) setUser(j.user)
        else { setUser(null); setToken(null); localStorage.removeItem('token') }
      }).catch(()=>{ setUser(null); setToken(null); localStorage.removeItem('token') })
    } else {
      setUser(null)
      localStorage.removeItem('token')
    }
  }, [token])

  const login = (t:string)=> setToken(t)
  const logout = ()=>{ setToken(null); setUser(null); localStorage.removeItem('token') }

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
}
