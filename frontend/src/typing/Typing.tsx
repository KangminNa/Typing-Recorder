import React, { useState, useEffect, useRef } from 'react'
import ReactTooltip from 'react-tooltip'

const SAMPLE_EN = `The quick brown fox jumps over the lazy dog.`
const SAMPLE_KO = `빠른 갈색 여우가 게으른 개를 뛰어넘습니다.`

export default function Typing(){
  const [lang, setLang] = useState<'en'|'ko'>('en')
  const [text, setText] = useState(SAMPLE_EN)
  const [input, setInput] = useState('')
  const [startAt, setStartAt] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [errors, setErrors] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [caretIndex, setCaretIndex] = useState(0)

  const { user, token } = React.useContext<any>(require('../auth/AuthContext').AuthContext)

  useEffect(()=>{ inputRef.current?.focus() }, [])

  useEffect(()=>{ fetchLessons().then(l=>{ setLessons(l); if(l.length>0) setSelectedLesson(l[0].id) }) }, [])

  useEffect(()=>{
    setText(lang === 'en' ? SAMPLE_EN : SAMPLE_KO)
    reset(false)
  }, [lang])

  function reset(clearInput = true){
    if(clearInput) setInput('')
    setStartAt(null); setFinished(false); setErrors(0); setCaretIndex(0)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    const v = e.target.value
    if(!startAt && v.length>0) setStartAt(Date.now())
    // update caret index
    setCaretIndex(v.length)
    // recalc errors only for current typed portion
    let err = 0
    for(let i=0;i<v.length;i++) if(v[i] !== text[i]) err++
    setErrors(err)
    setInput(v)
    if(v === text) setFinished(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    // allow user to correct mistakes with backspace; update caret accordingly
    if(e.key === 'Backspace'){
      setTimeout(()=>{
        const v = inputRef.current?.value || ''
        setCaretIndex(v.length)
        let err = 0
        for(let i=0;i<v.length;i++) if(v[i] !== text[i]) err++
        setErrors(err)
      }, 0)
    }
  }

  // render text with per-character coloring
  function renderText(){
    const chars = text.split('')
    const inputChars = input.split('')
    return chars.map((ch, idx)=>{
      const typed = inputChars[idx]
      const cls = typed == null ? 'char upcoming' : (typed === ch ? 'char correct' : 'char wrong')
      const isCaret = idx === caretIndex
      return (
        <span
          key={idx}
          className={`${cls} ${isCaret? 'caret':''}`}
          data-tip={typed !== ch && typed!=null ? `Expected: ${ch}` : ''}
          tabIndex={0}
          onFocus={(e)=>{
            // show tooltip on focus if available
            try{ ReactTooltip.show(e.currentTarget) }catch(_){}
          }}
          onBlur={(e)=>{ try{ ReactTooltip.hide(e.currentTarget) }catch(_){} }}
        >{ch}</span>
      )
    })
  }

  const elapsed = startAt ? (finished ? (Date.now()-startAt) : (Date.now()-startAt)) : 0
  const minutes = Math.max(elapsed/1000/60, 1/60)
  const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length
  const wpm = Math.round(wordsTyped / minutes)
  const accuracy = input.length ? Math.round(((input.length - errors)/input.length)*100) : 100

  async function submitScore(){
    try{
      await fetch('/api/typing/result', {
        method: 'POST',
        headers: {'Content-Type':'application/json', Authorization: token?`Bearer ${token}`:''},
        body: JSON.stringify({ name: user?.name || 'Anonymous', wpm, accuracy, errors, durationMs: elapsed, text })
      })
      alert('Saved')
    }catch(e){ console.error(e); alert('Save failed') }
  }

  // Recording state
  const [recState, setRecState] = useState<'idle'|'recording'|'uploaded'>('idle')
  const [recBlob, setRecBlob] = useState<Blob | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  async function startRecord(){
    if(!token){ alert('Login required'); window.location.hash='#login'; return }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      const chunks: any[] = []
      const recStart = Date.now()
      mr.ondataavailable = (e)=> chunks.push(e.data)
      mr.onstop = async ()=>{
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setRecBlob(blob)
        // upload with progress
        setUploadProgress(0)
        try{
          // dynamic import to avoid circular
          const { uploadRecording } = await import('./upload')
          await uploadRecording(blob, Date.now()-recStart, selectedLesson, token, (p:number)=> setUploadProgress(p))
          setRecState('uploaded')
          setUploadProgress(null)
          alert('Uploaded')
        }catch(e){ console.error(e); setUploadProgress(null); alert('Upload failed') }
      }
      mediaRef.current = mr
      mr.start()
      setRecState('recording')
    }catch(e){ console.error(e); alert('Mic error') }
  }

  function stopRecord(){
    if(mediaRef.current && mediaRef.current.state === 'recording'){
      mediaRef.current.stop()
    }
    setRecState('idle')
  }

  return (
    <div>
      <div className="typing-container">
      <div className="floating-bar">
        <div className="lang-group">
          <label className={`lang-btn ${lang==='en'?'active':''}`} onClick={()=>setLang('en')}>EN</label>
          <label className={`lang-btn ${lang==='ko'?'active':''}`} onClick={()=>setLang('ko')}>KO</label>
        </div>
        <div className="controls">
          {recState !== 'recording' ? (
            <button className="record" onClick={startRecord}>● Record</button>
          ) : (
            <button className="record" onClick={stopRecord}>■ Stop</button>
          )}
          <button className="ghost" onClick={()=>reset(true)}>Reset</button>
        </div>
        <div style={{width:200, marginLeft:12}}>
          {uploadProgress!=null && (
            <div style={{height:8, background:'#eef2ff', borderRadius:6, overflow:'hidden'}}>
              <div style={{width:`${uploadProgress}%`, height:'100%', background:'linear-gradient(90deg,#06b6d4,#7c3aed)'}} />
            </div>
          )}
        </div>
      </div>

      <div className="book">
        <div className="page left">
          <div className="page-inner">
            <div className="page-header">Source</div>
            <div className="page-body">
              <div style={{marginBottom:12}}>
                <label>Lesson: </label>
                <select value={selectedLesson || ''} onChange={e=>{
                  const id = e.target.value; setSelectedLesson(id); const l = lessons.find(x=>x.id===id); if(l) { setText(l.content); setLang(l.language); reset(true) }
                }}>
                  {lessons.map(ls => <option key={ls.id} value={ls.id}>{ls.title} ({ls.language})</option>)}
                </select>
              </div>
              {text}
            </div>
          </div>
        </div>
        <div className="page right">
          <div className="page-inner">
            <div className="page-header">Type here</div>
            <div className="page-body type-area">
                    <div className="rendered-text">{renderText()}</div>
              <input ref={inputRef} value={input} onChange={handleChange} onKeyDown={handleKeyDown} className="typing-input" placeholder="Start typing..." aria-label="typing-input" />
              <div style={{marginTop:8}}>
                <small style={{color:'#6b7280'}}>Tip: Use Backspace to correct errors. Wrong characters show the expected character on hover.</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-panel">
        <div>WPM: <strong>{wpm}</strong></div>
        <div>Accuracy: <strong>{accuracy}%</strong></div>
        <div>Errors: <strong>{errors}</strong></div>
        <div>Time: <strong>{(elapsed/1000).toFixed(1)}s</strong></div>
        <div style={{marginTop:8}}>
          <button onClick={submitScore} className="primary">Save Score</button>
        </div>
      </div>
    </div>
    </div>
  )
}
