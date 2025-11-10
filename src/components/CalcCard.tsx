import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/state/useAppStore'
import { compute, CalcConfig, Result, NumberResult, PifagorResult } from '@/core/calculators'

function useJson(url: string){
  const cache = useAppStore(s=>s.cache)
  const setCache = useAppStore(s=>s.setCache)
  const [data, setData] = useState<any>(cache[url] || null)
  const [err, setErr] = useState<string>('')
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    if(data) return
    setLoading(true)
    fetch(url).then(r=>r.json()).then(j=>{
      setData(j); setCache(url, j)
    }).catch(e=> setErr('Не удалось загрузить данные')).finally(()=> setLoading(false))
  },[url])
  return { data, err, loading }
}

function ResultBadge({r}:{r: Result}){
  if(r.kind==='number') return <div className="badge">Результат: {(r as NumberResult).value}</div>
  if(r.kind==='numbers') return <div className="badge">Результат: {r.values.join(', ')}</div>
  if(r.kind==='pifagor'){
    const rr = r as PifagorResult
    const sum = Object.values(rr.counts).reduce((a,b)=>a+b,0)
    return <div className="badge">Матрица · цифр: {sum}</div>
  }
  return null
}


export function CalcCard({ calc }: { calc: CalcConfig }){
  const dob = useAppStore(s=>s.dob)
  const [open, setOpen] = useState(false)
  const { data, err, loading } = useJson(calc.dataUrl)
  const res = useMemo(()=> dob ? compute(calc.id, dob) : null, [dob, calc.id])

  return (
    <div className="card">
      <div className="accordion-head" onClick={()=>setOpen(o=>!o)} style={{cursor:'pointer'}}>
        <div>
          <div className="accordion-title">{calc.title}</div>
          {res && <div style={{marginTop:8}}><ResultBadge r={res}/></div>}
        </div>
        <svg className={`chev ${open?'open':''}`} width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" opacity=".8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div className={`panel ${open?'open':''}`}>
        <div style={{marginTop:12}}>
          {loading && <div className="note">Загрузка...</div>}
          {err && <div style={{color:'salmon'}}>{err}</div>}
          {res && calc.renderInterpretation(res, data)}
        </div>
      </div>
    </div>
  )
}
