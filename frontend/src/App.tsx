import React, { useContext, useState } from 'react'
import Typing from './typing/Typing'
import { AuthProvider, AuthContext } from './auth/AuthContext'
import Login from './Login'
import Admin from './admin/Admin'

function InnerApp(){
  const { user, logout } = useContext(AuthContext)
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">Typing Recorder</div>
        <div className="top-actions">
          {user ? (
            <>
              <span style={{marginRight:12}}>Hi, {user.name || user.email}</span>
              <button className="ghost" onClick={()=>{ logout() }}>Sign out</button>
            </>
          ) : (
            <button className="ghost" onClick={()=>{ /* open login modal? show inline */ window.location.hash='#login' }}>Sign in</button>
          )}
        </div>
      </header>

      <main className="main-area">
        <Typing />
        {user && user.role === 'admin' && (
          <div style={{position:'fixed', top:92, right:180}}>
            <button className="ghost" onClick={()=>setShowAdmin(s=>!s)}>Admin</button>
          </div>
        )}
        {showAdmin && <div className="admin-drawer"><Admin /></div>}
      </main>

      <footer className="footer">&copy; 2026 Typing Recorder</footer>
    </div>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <InnerApp />
      <div id="modals">
        <div id="login-root" style={{display: window.location.hash==='#login' ? 'block' : 'none', position:'fixed', right:40, top:140}}>
          <Login />
        </div>
      </div>
    </AuthProvider>
  )
}
