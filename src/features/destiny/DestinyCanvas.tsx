import { forwardRef, useMemo } from 'react'
import type { DestinyData, DestinyPoint } from './types'

interface DestinyCanvasProps {
  data: DestinyData
  className?: string
}

const VIEWBOX_SIZE = 1000
const CENTER = VIEWBOX_SIZE / 2
const OUTER_RADIUS = 420
const INNER_RADIUS = 240
const CORE_RING_RADIUS = 320
const PERIMETER_TICK_LENGTH = 16
const PERIMETER_TEXT_RADIUS = OUTER_RADIUS + 40

const ACCENT_COLOR = 'rgba(139,92,246,0.85)'
const BASE_COLOR = 'rgba(148,163,184,0.55)'
const BACKGROUND_GRADIENT =
  'radial-gradient(circle at 50% 30%, rgba(139,92,246,.08), transparent 65%)'

function polarToCartesian(angleDeg: number, radius: number) {
  const radians = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians)
  }
}

function pointToSvg(point: DestinyPoint): { x: number; y: number } {
  return {
    x: point.x * VIEWBOX_SIZE,
    y: point.y * VIEWBOX_SIZE
  }
}

function buildOctagonPath(radius: number) {
  const points: string[] = []
  for (let i = 0; i < 8; i++) {
    const angle = -90 + i * 45
    const { x, y } = polarToCartesian(angle, radius)
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return points.join(' ')
}

function linePathFromPoints(points: DestinyPoint[]) {
  if (!points.length) return ''
  return points
    .map((point, index) => {
      const { x, y } = pointToSvg(point)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function getLineColor(id: string): string {
  if (id.includes('male')) return 'rgba(96,165,250,0.85)'
  if (id.includes('female')) return 'rgba(236,72,153,0.85)'
  if (id.includes('love')) return 'rgba(244,114,182,0.9)'
  if (id.includes('money')) return 'rgba(74,222,128,0.85)'
  if (id.includes('comfort')) return 'rgba(251,191,36,0.85)'
  return 'rgba(148,163,184,0.6)'
}

export const DestinyCanvas = forwardRef<SVGSVGElement, DestinyCanvasProps>(function DestinyCanvas(
  { data, className },
  ref
) {
  const outerOctagon = useMemo(() => buildOctagonPath(OUTER_RADIUS), [])

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        role="img"
        aria-label="Матрица судьбы"
        style={{
          width: '100%',
          height: 'auto',
          background: BACKGROUND_GRADIENT
        }}
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <polygon
            points={outerOctagon}
            fill="rgba(17,17,27,0.35)"
            stroke="rgba(148,163,184,0.45)"
            strokeWidth={3}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={CORE_RING_RADIUS}
            fill="none"
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={2}
            strokeDasharray="12 12"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="none"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth={2}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={100}
            fill="rgba(17,17,27,0.65)"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth={2}
          />
          <line
            x1={CENTER}
            y1={CENTER - OUTER_RADIUS}
            x2={CENTER}
            y2={CENTER + OUTER_RADIUS}
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={2}
          />
          <line
            x1={CENTER - OUTER_RADIUS}
            y1={CENTER}
            x2={CENTER + OUTER_RADIUS}
            y2={CENTER}
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={2}
          />
          <line
            x1={CENTER - OUTER_RADIUS * Math.SQRT1_2}
            y1={CENTER - OUTER_RADIUS * Math.SQRT1_2}
            x2={CENTER + OUTER_RADIUS * Math.SQRT1_2}
            y2={CENTER + OUTER_RADIUS * Math.SQRT1_2}
            stroke="rgba(148,163,184,0.2)"
            strokeWidth={2}
            strokeDasharray="10 12"
          />
          <line
            x1={CENTER + OUTER_RADIUS * Math.SQRT1_2}
            y1={CENTER - OUTER_RADIUS * Math.SQRT1_2}
            x2={CENTER - OUTER_RADIUS * Math.SQRT1_2}
            y2={CENTER + OUTER_RADIUS * Math.SQRT1_2}
            stroke="rgba(148,163,184,0.2)"
            strokeWidth={2}
            strokeDasharray="10 12"
          />
        </g>

        <g strokeLinecap="round" strokeLinejoin="round">
          {data.perimeterAges.map(({ age, angle }) => {
            const outerPoint = polarToCartesian(angle, OUTER_RADIUS)
            const tickEnd = polarToCartesian(angle, OUTER_RADIUS + PERIMETER_TICK_LENGTH)
            const textPoint = polarToCartesian(angle, PERIMETER_TEXT_RADIUS)

            return (
              <g key={`age-${age}`}>
                <line
                  x1={outerPoint.x}
                  y1={outerPoint.y}
                  x2={tickEnd.x}
                  y2={tickEnd.y}
                  stroke="rgba(148,163,184,0.45)"
                  strokeWidth={2}
                />
                <text
                  x={textPoint.x}
                  y={textPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={16}
                  fill="rgba(226,232,240,0.85)"
                >
                  {age}
                </text>
              </g>
            )
          })}
        </g>

        <g strokeLinecap="round" strokeLinejoin="round">
          {data.energyLines.map((line) => {
            const d = linePathFromPoints(line.points)
            if (!d) return null
            const color = getLineColor(line.id)
            return (
              <path
                key={line.id}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={line.id.includes('male') || line.id.includes('female') ? 4 : 3}
                strokeDasharray={line.dashed ? '8 12' : undefined}
                opacity={line.dashed ? 0.7 : 0.9}
              />
            )
          })}
        </g>

        <g>
          {data.coreNumbers.map((node) => {
            const { x, y } = pointToSvg({ x: node.x, y: node.y })
            const isCalculated = node.calculated
            const radius = isCalculated ? 38 : 30
            const fill = isCalculated ? 'rgba(139,92,246,0.22)' : 'rgba(15,23,42,0.85)'
            const stroke = isCalculated ? ACCENT_COLOR : BASE_COLOR
            const strokeWidth = isCalculated ? 4 : 2.5
            const textColor = isCalculated ? 'rgba(255,255,255,0.95)' : 'rgba(226,232,240,0.85)'

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                aria-label={node.label ? `${node.label}` : `Значение ${node.id}`}
              >
                <circle
                  r={radius}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  style={{
                    filter: isCalculated ? 'drop-shadow(0 12px 24px rgba(139,92,246,0.35))' : 'none'
                  }}
                />
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fontSize={radius > 32 ? 24 : 20}
                  fontWeight={700}
                  fill={textColor}
                >
                  {node.value}
                </text>
                {node.label && (
                  <text
                    x={0}
                    y={radius + 26}
                    textAnchor="middle"
                    fontSize={14}
                    fill="rgba(226,232,240,0.75)"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>

        {data.labels && data.labels.length > 0 && (
          <g>
            {data.labels.map((label) => {
              const { x, y } = pointToSvg(label)
              return (
                <text
                  key={`label-${label.text}-${x}-${y}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fontSize={14}
                  fill="rgba(226,232,240,0.8)"
                >
                  {label.text}
                </text>
              )
            })}
          </g>
        )}
      </svg>
    </div>
  )
})

