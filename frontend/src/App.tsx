import React, { useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import Typing from './typing/Typing'
import { AuthProvider, AuthContext } from './auth/AuthContext'
import Login from './Login'
import Signup from './Signup'
import Admin from './admin/Admin'

function InnerApp(){
  const { user, logout } = useContext(AuthContext)
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">Typing Recorder</div>
        <div className="top-actions">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <span style={{marginRight:12}}>Hi, {user.name || user.email}</span>
              <button className="ghost" onClick={()=>{ logout() }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="ghost">Sign in</button></Link>
              <Link to="/signup"><button className="ghost">Sign up</button></Link>
            </>
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InnerApp/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
      {/* Global ReactTooltip instance */}
      <ReactTooltip globalEventOff="click" />
    </AuthProvider>
  )
}
