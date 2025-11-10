import { useAppStore } from '@/state/useAppStore'

export function Header(){
  const userName = useAppStore(s => s.userName)
  return (
    <div className="header">
      <div className="logo" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l2.2 4.6 5.1.7-3.7 3.6.9 5.1L12 14.9 7.5 17l.9-5.1L4.7 8.3l5.1-.7L12 3Z" stroke="white" opacity=".95"/>
        </svg>
      </div>
      <div>
        <h1>Нумерологический калькулятор</h1>
        <div className="sub">
          4 расчёта · локальные расшифровки
          {userName && (
            <span style={{ marginLeft: 8 }}>
              · {userName}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
