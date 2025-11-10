import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/state/useAppStore'
import { parseDOB } from '@/core/date'

const MONTHS = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' },
]

const MIN_YEAR = 1900
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, idx) => CURRENT_YEAR - idx)

export function DateInput(){
  const setDOB = useAppStore(s => s.setDOB)
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [err, setErr] = useState('')

  const daysInMonth = useMemo(() => {
    if (!month) return 31
    const monthNum = Number(month)
    if (monthNum === 2) {
      if (!year) return 29
      const y = Number(year)
      const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
      return isLeap ? 29 : 28
    }
    if ([4, 6, 9, 11].includes(monthNum)) return 30
    return 31
  }, [month, year])

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, idx) => idx + 1),
    [daysInMonth]
  )

  useEffect(() => {
    if (day && Number(day) > daysInMonth) {
      setDay('')
    }
  }, [day, daysInMonth])

  function onCalc(){
    if (!day || !month || !year) {
      setErr('Выберите день, месяц и год')
      return
    }
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const parsed = parseDOB(iso)
    if (!parsed) {
      setErr('Некорректная дата')
      return
    }
    setErr('')
    setDOB(parsed)
  }
  return (
    <div className="card">
      <div className="row">
        <div className="field date-field">
          <div className="icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="4" stroke="currentColor" opacity=".85"/>
              <path d="M3 9h18" stroke="currentColor" opacity=".85"/>
              <path d="M7 3v4M17 3v4" stroke="currentColor" opacity=".85"/>
            </svg>
          </div>
          <div className="date-grid">
            <select
              className="select"
              value={day}
              onChange={(e) => { setErr(''); setDay(e.target.value) }}
              aria-label="День"
            >
              <option value="">День</option>
              {days.map(d => (
                <option key={d} value={d}>{d.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select
              className="select"
              value={month}
              onChange={(e) => { setErr(''); setMonth(e.target.value) }}
              aria-label="Месяц"
            >
              <option value="">Месяц</option>
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              className="select year"
              value={year}
              onChange={(e) => { setErr(''); setYear(e.target.value) }}
              aria-label="Год"
            >
              <option value="">Год</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn" onClick={onCalc}>Рассчитать</button>
      </div>
      {err ? (
        <div style={{color:'salmon',marginTop:8}}>{err}</div>
      ) : (
        <div className="note">Доступный диапазон: {MIN_YEAR} — {CURRENT_YEAR}</div>
      )}
    </div>
  )
}
