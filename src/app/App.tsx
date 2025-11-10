import { useState } from 'react'
import { useAppStore } from '@/state/useAppStore'
import { CalcCard } from '@/components/CalcCard'
import { calculators } from '@/config/calculators'

import { Header } from '@/components/Header'
import { DestinyPage } from '@/features/destiny/DestinyPage'
import { AccountPage } from '@/features/account/AccountPage'

type ActivePage = 'calc' | 'account'

export default function App() {
  const dob = useAppStore((s) => s.dob)
  const [activePage, setActivePage] = useState<ActivePage>('calc')

  return (
    <div className="app-shell">
      <div className="container">
        <Header />
        {activePage === 'calc' ? (
          <>
            <DestinyPage />
            <section style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>Классические расчёты</h2>
              {dob ? (
                <div className="mt-4 space-y-3" style={{ marginTop: 0, display: 'grid', gap: 12 }}>
                  {calculators.map((c) => (
                    <CalcCard key={c.id} calc={c} />
                  ))}
                </div>
              ) : (
                <div className="note" style={{ marginTop: 8 }}>
                  Введите дату рождения вверху экрана, чтобы увидеть расчёты.
                </div>
              )}
            </section>
          </>
        ) : (
          <AccountPage />
        )}
      </div>
      <nav className="bottom-nav" aria-label="Основное меню">
        <button
          type="button"
          className={activePage === 'calc' ? 'active' : ''}
          onClick={() => setActivePage('calc')}
        >
          Рассчёт
        </button>
        <button
          type="button"
          className={activePage === 'account' ? 'active' : ''}
          onClick={() => setActivePage('account')}
        >
          Личный кабинет
        </button>
      </nav>
    </div>
  )
}
