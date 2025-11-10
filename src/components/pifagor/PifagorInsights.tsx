import { useMemo } from 'react'
import type { SquareResult } from '@/lib/pifagor/types'
import { getDigitText, getLinesAndDiagsText, getPsychotypeText } from '@/lib/pifagor/interpret'

interface PifagorInsightsProps {
  result: SquareResult
}

const baseTextStyle = {
  whiteSpace: 'pre-wrap' as const,
  fontSize: 13,
  lineHeight: 1.6,
  margin: '4px 0 0'
}

const sectionStyle = {
  display: 'grid',
  gap: 12
}

const sectionTitleStyle = {
  fontWeight: 600,
  fontSize: 16 as const
}

export function PifagorInsights({ result }: PifagorInsightsProps) {
  const digits = useMemo(() => {
    return Array.from({ length: 9 }, (_, idx) => {
      const digit = idx + 1
      const count = result.counts[String(digit)] || 0
      const { base, level } = getDigitText(digit, count)
      const signature =
        count > 0 ? String(digit).repeat(count) : digit === 2 ? 'Х/1-2' : 'X'

      return { digit, count, base, level, signature }
    })
  }, [result.counts])

  const linesAndDiags = useMemo(() => getLinesAndDiagsText(result), [result])
  const psychotypeText = useMemo(() => getPsychotypeText(result.counts), [result.counts])

  const activeDigits = digits.filter((digit) => digit.count > 0)

  return (
    <div style={{ display: 'grid', gap: 20, marginTop: 16 }}>
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>Цифры</div>
        {activeDigits.length === 0 && (
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            В матрице отсутствуют цифры для интерпретации.
          </div>
        )}
        {activeDigits.map(({ digit, signature, base, level }) => (
          <div key={digit} style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontWeight: 600, opacity: 0.9 }}>
              {`Цифра ${digit}`} · {signature}
            </div>
            {base && (
              <div style={{ display: 'grid', gap: 4 }}>
                <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 600 }}>Базовая интерпретация</div>
                <pre style={baseTextStyle}>{base}</pre>
              </div>
            )}
            {level && (
              <div style={{ display: 'grid', gap: 4 }}>
                <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 600 }}>
                  Интерпретация повторов ({signature})
                </div>
                <pre style={baseTextStyle}>{level}</pre>
              </div>
            )}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>Линии и диагонали</div>
        {[
          { key: 'row_1_4_7', label: 'Строка 1-4-7' },
          { key: 'row_2_5_8', label: 'Строка 2-5-8' },
          { key: 'row_3_6_9', label: 'Строка 3-6-9' },
          { key: 'diag_3_5_7', label: 'Диагональ 3-5-7' },
          { key: 'diag_1_5_9', label: 'Диагональ 1-5-9' }
        ].map(({ key, label }) => {
          const item = linesAndDiags[key]
          if (!item) return null

          return (
            <div key={key} style={{ display: 'grid', gap: 4 }}>
              <div style={{ fontWeight: 600, opacity: 0.85 }}>
                {label} — сумма {item.qty}
              </div>
              {item.text && <pre style={baseTextStyle}>{item.text}</pre>}
            </div>
          )
        })}
      </section>

      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>Психотип</div>
        {psychotypeText && <pre style={baseTextStyle}>{psychotypeText}</pre>}
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Единиц: {result.counts['1'] || 0} · Двоек: {result.counts['2'] || 0}
        </div>
      </section>
    </div>
  )
}

