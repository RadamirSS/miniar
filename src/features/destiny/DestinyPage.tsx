import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { parseDOB } from '@/core/date'
import { useAppStore } from '@/state/useAppStore'
import { computeDestiny } from '@/lib/destiny/math'
import type { DestinyResult, ReductionMode } from '@/lib/destiny/types'
import type { DestinyData } from './types'
import { DESTINY_LAYOUT, DESTINY_EDGES, ENERGY_FLOWS } from '@/lib/destiny/mapping'
import type { DestinyPoint } from './types'
import { DestinyCanvas } from './DestinyCanvas'
import { DestinyInterpretations } from './DestinyInterpretations'
import { Legend } from './Legend'

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts: string[] = []
  if (digits.length >= 2) {
    parts.push(digits.slice(0, 2))
  } else {
    parts.push(digits)
  }
  if (digits.length >= 4) {
    parts.push(digits.slice(2, 4))
  } else if (digits.length > 2) {
    parts.push(digits.slice(2))
  }
  if (digits.length > 4) {
    parts.push(digits.slice(4, 8))
  }
  return parts.filter(Boolean).join('.')
}

export function DestinyPage() {
  const setDOB = useAppStore((s) => s.setDOB)
  const dob = useAppStore((s) => s.dob)
  const [input, setInput] = useState(() =>
    dob ? `${String(dob.day).padStart(2, '0')}.${String(dob.month).padStart(2, '0')}.${dob.year}` : ''
  )
  const [mode, setMode] = useState<ReductionMode>('digital22')
  const [result, setResult] = useState<DestinyResult | null>(null)
  const [error, setError] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [lastCalculatedInput, setLastCalculatedInput] = useState<string | null>(null)
  const dateInputId = 'destiny-date-input'
  const modeSelectId = 'destiny-mode-select'

  const isValidInput = input.length === 10

  const handleCalculate = useCallback(() => {
    try {
      const computed = computeDestiny(input, mode)
      setResult(computed)
      setError('')
      const parsed = parseDOB(input)
      if (parsed) {
        setDOB(parsed)
      }
      setLastCalculatedInput(input)
    } catch (err) {
      console.error(err)
      setResult(null)
      setError('Некорректная дата. Проверьте формат ДД.ММ.ГГГГ.')
      setLastCalculatedInput(null)
    }
  }, [input, mode, setDOB])

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (!isValidInput) {
        setError('Введите дату в формате ДД.ММ.ГГГГ')
        return
      }
      handleCalculate()
    },
    [handleCalculate, isValidInput]
  )

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const handleExport = useCallback(
    async (format: 'svg' | 'png') => {
      if (!svgRef.current || !result) return
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgRef.current)

      if (format === 'svg') {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        downloadBlob(blob, 'destiny-matrix.svg')
        return
      }

      setIsExporting(true)
      try {
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        const image = new Image()
        const canvas = document.createElement('canvas')
        const size = 1200
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas context unavailable')

        await new Promise<void>((resolve, reject) => {
          image.onload = () => {
            ctx.drawImage(image, 0, 0, size, size)
            resolve()
          }
          image.onerror = reject
          image.src = url
        })

        URL.revokeObjectURL(url)

        await new Promise<void>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Не удалось подготовить PNG'))
              return
            }
            downloadBlob(blob, 'destiny-matrix.png')
            resolve()
          })
        })
      } catch (err) {
        console.error(err)
        setError('Не удалось экспортировать изображение.')
      } finally {
        setIsExporting(false)
      }
    },
    [downloadBlob, result]
  )

  useEffect(() => {
    if (!lastCalculatedInput || lastCalculatedInput.length !== 10) {
      return
    }
    try {
      const recomputed = computeDestiny(lastCalculatedInput, mode)
      setResult(recomputed)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Не удалось пересчитать матрицу для выбранной стратегии.')
    }
  }, [lastCalculatedInput, mode])

  const modeDescription = useMemo(
    () =>
      mode === 'digital22'
        ? 'Цифровой корень до диапазона 1…22 (0 → 22)'
        : 'Остаток от деления на 22 (0 → 22)',
    [mode]
  )

  const destinyData = useMemo<DestinyData | null>(() => {
    if (!result) return null
    return buildDestinyCanvasData(result)
  }, [result])

  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>Матрица судьбы · 22 аркана</h2>
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ display: 'grid', gap: 12 }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px' }}>
            <label htmlFor={dateInputId} style={{ display: 'block', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
              Дата рождения (ДД.ММ.ГГГГ)
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Например, 18.06.1988"
              value={input}
              onChange={(e) => setInput(formatDateInput(e.target.value))}
              className="input"
              id={dateInputId}
              style={{ paddingLeft: 14 }}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor={modeSelectId} style={{ display: 'block', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
              Редукция
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ReductionMode)}
              className="select"
              id={modeSelectId}
            >
              <option value="digital22">digital22</option>
              <option value="mod22">mod22</option>
            </select>
            <div className="note" style={{ marginTop: 6 }}>
              {modeDescription}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="btn"
            disabled={!isValidInput}
            style={{ opacity: isValidInput ? 1 : 0.6 }}
          >
            Рассчитать матрицу
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setInput('')
              setResult(null)
              setLastCalculatedInput(null)
              setError('')
            }}
          >
            Очистить
          </button>
          <div style={{ flex: '1 1 auto' }} />
          <button
            type="button"
            className="btn ghost"
            onClick={() => handleExport('svg')}
            disabled={!result}
          >
            Скачать SVG
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => handleExport('png')}
            disabled={!result || isExporting}
            style={{ opacity: !result || isExporting ? 0.6 : 1 }}
          >
            Скачать PNG
          </button>
        </div>
        {error && (
          <div
            role="alert"
            style={{
              color: 'salmon',
              fontSize: 13,
              background: 'rgba(248,113,113,0.12)',
              border: '1px solid rgba(248,113,113,0.35)',
              padding: '10px 12px',
              borderRadius: 10
            }}
          >
            {error}
          </div>
        )}
      </form>

      {result && destinyData ? (
        <>
          <div className="card" style={{ marginTop: 18 }}>
            <DestinyCanvas ref={svgRef} data={destinyData} />
          </div>
          <Legend />
          <DestinyInterpretations result={result} />
        </>
      ) : (
        <div className="note" style={{ marginTop: 12 }}>
          Введите дату и нажмите «Рассчитать матрицу», чтобы увидеть расчёты и интерпретации.
        </div>
      )}
    </section>
  )
}


function toDestinyPoint(coord: readonly [number, number]): DestinyPoint {
  return { x: coord[0], y: coord[1] }
}

function calculateAngleFromCenter(coord: readonly [number, number]): number {
  const dx = coord[0] - 0.5
  const dy = coord[1] - 0.5
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
  return (angle + 360) % 360
}

function buildDestinyCanvasData(result: DestinyResult): DestinyData {
  const coreNumbers = Object.entries(result.nodes)
    .filter(([, node]) => node.variant !== 'energy' && (node.radius ?? 0) >= 24)
    .map(([id, node]) => ({
      id,
      value: node.value,
      calculated: node.variant !== 'neutral',
      x: node.coord[0],
      y: node.coord[1],
      label: node.label
    }))

  const allowedEdgeKeys = new Set([
    'male-diagonal',
    'female-diagonal',
    'center-horizontal',
    'center-vertical',
    'inner-horizontal',
    'inner-vertical',
    'love-guide',
    'money-guide'
  ])

  const edgeLines = DESTINY_EDGES.filter((edge) => allowedEdgeKeys.has(edge.key)).map((edge) => {
    const points = edge.points
      .map((key) => DESTINY_LAYOUT[key as keyof typeof DESTINY_LAYOUT])
      .filter(Boolean)
      .map((coord) => toDestinyPoint(coord as readonly [number, number]))

    if (edge.close && points.length > 1) {
      points.push(points[0])
    }

    return {
      id: `edge-${edge.key}`,
      points,
      dashed: Boolean(edge.dasharray)
    }
  })

  const flowLines = ENERGY_FLOWS.map((flow) => {
    const start = DESTINY_LAYOUT[flow.from]
    const end = DESTINY_LAYOUT[flow.to]
    const points: DestinyPoint[] = [
      toDestinyPoint(start),
      ...flow.points.map((point) =>
        toDestinyPoint(DESTINY_LAYOUT[point.layout as keyof typeof DESTINY_LAYOUT])
      ),
      toDestinyPoint(end)
    ]
    return {
      id: `flow-${flow.key}`,
      points,
      dashed: false
    }
  })

  const perimeterConfig: Array<{ age: number; key: keyof typeof DESTINY_LAYOUT }> = [
    { age: 0, key: 'leftOuter' },
    { age: 10, key: 'topLeftOuter' },
    { age: 20, key: 'topOuter' },
    { age: 30, key: 'topRightOuter' },
    { age: 40, key: 'rightOuter' },
    { age: 50, key: 'bottomRightOuter' },
    { age: 60, key: 'bottomOuter' },
    { age: 70, key: 'bottomLeftOuter' }
  ]

  const perimeterAges = perimeterConfig
    .map(({ age, key }) => {
      const coord = DESTINY_LAYOUT[key]
      if (!coord) return null
      return {
        age,
        angle: calculateAngleFromCenter(coord)
      }
    })
    .filter((item): item is { age: number; angle: number } => item !== null)
    .sort((a, b) => a.angle - b.angle)

  return {
    coreNumbers,
    energyLines: [...edgeLines, ...flowLines],
    perimeterAges
  }
}

