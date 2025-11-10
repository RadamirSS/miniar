export function Legend() {
  return (
    <div
      className="card"
      style={{
        marginTop: 16,
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
      }}
    >
      <LegendItem color="rgba(96,165,250,0.75)" title="Мужская линия">
        Родовой потенциал и проявление по мужскому роду
      </LegendItem>
      <LegendItem color="rgba(236,72,153,0.75)" title="Женская линия">
        Родовой потенциал и проявление по женскому роду
      </LegendItem>
      <LegendItem color="rgba(139,92,246,0.65)" title="Духовная / материальная оси">
        Внутренний квадрат, связь духа и материи
      </LegendItem>
      <LegendItem color="rgba(255,255,255,0.75)" title="Зоны любви и денег" dashed>
        Дополнительные задачи на любовь и финансы
      </LegendItem>
      <LegendItem color="rgba(251,191,36,0.85)" title="Энергетические линии">
        Движение энергии и зоны комфорта
      </LegendItem>
    </div>
  )
}

function LegendItem({
  color,
  title,
  children,
  dashed
}: {
  color: string
  title: string
  children: string
  dashed?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span
        aria-hidden
        style={{
          width: 32,
          height: 6,
          marginTop: 8,
          borderRadius: 999,
          background: color,
          border: dashed ? '1px dashed rgba(255,255,255,0.6)' : 'none'
        }}
      />
      <div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{children}</div>
      </div>
    </div>
  )
}


