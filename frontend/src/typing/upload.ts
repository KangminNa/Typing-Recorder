export function uploadRecording(blob: Blob, durationMs: number, lessonId:string|null, token:string|null, onProgress?: (p:number)=>void){
  return new Promise((resolve, reject)=>{
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/recordings')
    if(token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.onload = ()=>{
      if(xhr.status>=200 && xhr.status<300){ try{ resolve(JSON.parse(xhr.responseText)) }catch(e){ resolve(xhr.responseText) } }
      else reject(new Error('Upload failed: '+xhr.status))
    }
    xhr.onerror = ()=> reject(new Error('Network error'))
    if(xhr.upload && onProgress) xhr.upload.onprogress = (e)=>{ if(e.lengthComputable) onProgress(Math.round((e.loaded/e.total)*100)) }
    const fd = new FormData()
    fd.append('file', blob, 'rec.webm')
    fd.append('durationMs', String(durationMs))
    fd.append('lessonId', lessonId||'')
    xhr.send(fd)
  })
}
