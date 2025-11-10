import { useMemo, useState } from 'react'
import type { DestinyResult } from '@/lib/destiny/types'
import {
  DESTINY_VALUE_LABELS,
  getArcanaInterpretation,
  getLineInterpretation,
  getNodeInterpretation,
  getZoneInterpretation,
  useDestinyInterpretations
} from './interpret'

type TabKey = 'arcana' | 'lines' | 'zones'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'arcana', label: 'Арканы' },
  { key: 'lines', label: 'Линии / оси' },
  { key: 'zones', label: 'Зоны' }
]

const ARCANA_ORDER = [
  'A',
  'B',
  'C',
  'D',
  'M1',
  'M2',
  'W1',
  'W2',
  'H1',
  'H2',
  'T_love',
  'T_money',
  'R1',
  'R2'
] as const

export function DestinyInterpretations({ result }: { result: DestinyResult }) {
  const [activeTab, setActiveTab] = useState<TabKey>('arcana')
  const { arcana, zones } = useDestinyInterpretations()

  const arcanaItems = useMemo(() => {
    return ARCANA_ORDER.map((key) => {
      const value = result.values[key as keyof typeof result.values]
      const interpretation = value ? getArcanaInterpretation(value, arcana) : null
      return {
        key,
        value,
        label: DESTINY_VALUE_LABELS[key] ?? key,
        interpretation
      }
    })
  }, [result.values, arcana])

  const lineItems = useMemo(() => {
    return [
      {
        key: 'male',
        title: 'Мужская линия',
        values: [
          { key: 'M1', value: result.values.M1 },
          { key: 'M2', value: result.values.M2 }
        ],
        interpretation: getLineInterpretation('male', zones)
      },
      {
        key: 'female',
        title: 'Женская линия',
        values: [
          { key: 'W1', value: result.values.W1 },
          { key: 'W2', value: result.values.W2 }
        ],
        interpretation: getLineInterpretation('female', zones)
      },
      {
        key: 'upper',
        title: 'Духовная ось',
        values: [
          { key: 'H1', value: result.values.H1 },
          { key: 'H2', value: result.values.H2 }
        ],
        interpretation: getLineInterpretation('upper', zones)
      },
      {
        key: 'lower',
        title: 'Материальная ось',
        values: [
          { key: 'R1', value: result.values.R1 },
          { key: 'R2', value: result.values.R2 }
        ],
        interpretation: getLineInterpretation('lower', zones)
      }
    ]
  }, [result.values, zones])

  const zoneItems = useMemo(() => {
    return [
      {
        key: 'center',
        title: zones.nodes.center?.title ?? 'Центр',
        value: result.values.D,
        interpretation: getNodeInterpretation('center', zones)
      },
      {
        key: 'lovePoint',
        title: zones.zones.lovePoint?.title ?? 'Зона любви',
        value: result.values.T_love,
        interpretation: getZoneInterpretation('lovePoint', zones)
      },
      {
        key: 'moneyPoint',
        title: zones.zones.moneyPoint?.title ?? 'Зона денег',
        value: result.values.T_money,
        interpretation: getZoneInterpretation('moneyPoint', zones)
      },
      {
        key: 'comfort',
        title: zones.zones.comfort?.title ?? 'Зона комфорта',
        value: result.values.H2,
        interpretation: getZoneInterpretation('comfort', zones)
      }
    ]
  }, [result.values, zones])

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className="btn"
            style={{
              flex: 1,
              minWidth: 0,
              background:
                activeTab === tab.key
                  ? 'linear-gradient(170deg, rgba(139,92,246,0.9), rgba(59,130,246,0.8))'
                  : 'transparent',
              borderColor:
                activeTab === tab.key
                  ? 'rgba(139,92,246,0.8)'
                  : 'color-mix(in oklab, var(--card-border) 80%, transparent)',
              boxShadow: activeTab === tab.key ? undefined : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: activeTab === 'arcana' ? 'block' : 'none' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {arcanaItems.map((item) => (
            <div
              key={item.key}
              style={{
                border: '1px solid var(--card-border)',
                borderRadius: 12,
                padding: 14,
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>{item.label}</div>
                <div className="badge">Аркан {item.value}</div>
              </div>
              {item.interpretation ? (
                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.interpretation.title}</div>
                  {item.interpretation.text}
                </div>
              ) : (
                <div className="note" style={{ marginTop: 8 }}>
                  Интерпретация пока не заполнена.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: activeTab === 'lines' ? 'block' : 'none' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {lineItems.map((item) => (
            <div
              key={item.key}
              style={{
                border: '1px solid var(--card-border)',
                borderRadius: 12,
                padding: 14,
                background: 'rgba(139,92,246,0.05)'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {item.values.map((v) => (
                  <div key={v.key} className="badge">
                    {v.key}: {v.value}
                  </div>
                ))}
              </div>
              {item.interpretation ? (
                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                  {item.interpretation.text}
                </div>
              ) : (
                <div className="note" style={{ marginTop: 8 }}>
                  Интерпретация пока не заполнена.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: activeTab === 'zones' ? 'block' : 'none' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {zoneItems.map((item) => (
            <div
              key={item.key}
              style={{
                border: '1px solid var(--card-border)',
                borderRadius: 12,
                padding: 14,
                background: 'rgba(59,130,246,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div className="badge">{item.value}</div>
              </div>
              {item.interpretation ? (
                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                  {item.interpretation.text}
                </div>
              ) : (
                <div className="note" style={{ marginTop: 8 }}>
                  Интерпретация пока не заполнена.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


