/**
 * Компонент для отрисовки квадрата Пифагора 3x3
 */

import { useMemo } from 'react'
import type { SquareResult } from '@/lib/pifagor/types'

interface PifagorSquareProps {
  result: SquareResult
}

const order = ['1', '4', '7', '2', '5', '8', '3', '6', '9'] as const

export function PifagorSquare({ result }: PifagorSquareProps) {
  const { counts, rows, diags } = result

  const stats = useMemo(
    () => [
      { label: 'Строка 1-4-7', value: rows.r147 },
      { label: 'Строка 2-5-8', value: rows.r258 },
      { label: 'Строка 3-6-9', value: rows.r369 },
      { label: 'Диагональ 3-5-7', value: diags.d357 },
      { label: 'Диагональ 1-5-9', value: diags.d159 }
    ],
    [rows, diags]
  )

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 12,
          width: '100%',
          maxWidth: 320,
          margin: '0 auto'
        }}
      >
        {order.map((digit) => {
          const count = counts[digit] || 0
          const display = count > 0 ? digit.repeat(count) : '•'

          return (
            <div
              key={digit}
              aria-label={`Цифра ${digit}, количество ${count}`}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 16,
                position: 'relative',
                background: count > 0 ? 'rgba(139,92,246,0.14)' : 'rgba(17,17,27,0.35)',
                border: '1px solid color-mix(in oklab, var(--card-border) 85%, transparent)',
                boxShadow: count > 0 ? '0 8px 18px rgba(139,92,246,0.18)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                transition: 'background 0.2s ease',
                textAlign: 'center'
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '100%',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
                  fontSize: count >= 4 ? 16 : 20,
                  letterSpacing: 1,
                  color: count > 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)'
                }}
              >
                {display}
              </span>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12
        }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              borderRadius: 12,
              border: '1px solid var(--card-border)',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 13
            }}
          >
            <span style={{ opacity: 0.75 }}>{item.label}</span>
            <span className="badge" style={{ fontWeight: 600 }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

