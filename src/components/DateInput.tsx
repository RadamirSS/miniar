import { useState } from 'react'
import { useAppStore } from '@/state/useAppStore'
import { parseDOB } from '@/core/date'

export function DateInput(){
  const setDOB = useAppStore(s => s.setDOB)
  const [raw, setRaw] = useState('')
  const [err, setErr] = useState('')
  function onCalc(){
    const p = parseDOB(raw)
    if(!p){ setErr('Введите дату в формате ДД.ММ.ГГГГ или YYYY-MM-DD'); return }
    setErr(''); setDOB(p)
  }
  return (
    <div className="card">
      <div className="row">
        <div className="field">
          <div className="icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="4" stroke="currentColor" opacity=".85"/>
              <path d="M3 9h18" stroke="currentColor" opacity=".85"/>
              <path d="M7 3v4M17 3v4" stroke="currentColor" opacity=".85"/>
            </svg>
          </div>
          <input className="input" placeholder="ДД.ММ.ГГГГ или YYYY-MM-DD" value={raw} onChange={e=>setRaw(e.target.value)} />
        </div>
        <button className="btn" onClick={onCalc}>Рассчитать</button>
      </div>
      {err ? <div style={{color:'salmon',marginTop:8}}>{err}</div> : <div className="note">Например: <span className="kbd">23.07.1991</span> или <span className="kbd">1991-07-23</span></div>}
    </div>
  )
}
