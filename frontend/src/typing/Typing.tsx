import React, { useState, useEffect, useRef } from 'react'

const SAMPLE = `The quick brown fox jumps over the lazy dog.`

export default function Typing(){
  const [text] = useState(SAMPLE)
  const [input, setInput] = useState('')
  const [startAt, setStartAt] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [errors, setErrors] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(()=>{ inputRef.current?.focus() }, [])

  useEffect(()=>{
    if(input.length === 0){ setStartAt(null); setFinished(false); setErrors(0); }
    if(input === text){ setFinished(true) }
  }, [input, text])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    const v = e.target.value
    if(!startAt && v.length>0) setStartAt(Date.now())
    // count errors: difference between chars
    let err = 0
    for(let i=0;i<v.length;i++) if(v[i] !== text[i]) err++
    setErrors(err)
    setInput(v)
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
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: 'Anonymous', wpm, accuracy, errors, durationMs: elapsed, text })
      })
      alert('Saved')
    }catch(e){ console.error(e); alert('Save failed') }
  }

  return (
    <div>
      <div className="card">
        <div className="text-box">{text}</div>
        <input ref={inputRef} value={input} onChange={handleChange} className="typing-input" />
      </div>
      <div className="stats">
        <div>WPM: {wpm}</div>
        <div>Accuracy: {accuracy}%</div>
        <div>Errors: {errors}</div>
        <div>Time: {(elapsed/1000).toFixed(1)}s</div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={()=>{ setInput(''); setStartAt(null); setFinished(false); setErrors(0)}}>Reset</button>
        <button onClick={submitScore} style={{marginLeft:8}}>Save Score</button>
      </div>
    </div>
  )
}
