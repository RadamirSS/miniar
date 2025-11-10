/**
 * Компонент для отрисовки квадрата Пифагора 3x3
 */

import type { SquareResult } from '@/lib/pifagor/types';

interface PifagorSquareProps {
  result: SquareResult;
}

export function PifagorSquare({ result }: PifagorSquareProps) {
  const { counts, rows, diags } = result;
  
  // Порядок отображения в квадрате Пифагора:
  // Строка 1: 1, 4, 7 (левый столбец)
  // Строка 2: 2, 5, 8 (средний столбец)
  // Строка 3: 3, 6, 9 (правый столбец)
  // То есть порядок: [1, 4, 7, 2, 5, 8, 3, 6, 9]
  const displayOrder = ['1', '4', '7', '2', '5', '8', '3', '6', '9'];
  
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 8,
        maxWidth: 280,
        margin: '0 auto'
      }}>
        {displayOrder.map((digit) => {
          const count = counts[digit] || 0;
          
          return (
            <div
              key={digit}
              style={{
                border: '1px solid var(--card-border)',
                borderRadius: 12,
                padding: 12,
                textAlign: 'center',
                background: count > 0 
                  ? 'rgba(139, 92, 246, 0.1)' 
                  : 'rgba(255, 255, 255, 0.02)',
                minHeight: 70,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4
              }}
            >
              <div style={{ 
                fontSize: 18, 
                fontWeight: 600,
                opacity: count > 0 ? 1 : 0.3
              }}>
                {digit}
              </div>
              {count > 0 && (
                <>
                  <div style={{ 
                    fontSize: 14, 
                    opacity: 0.8,
                    fontFamily: 'ui-monospace, monospace'
                  }}>
                    {digit.repeat(count)}
                  </div>
                  <div className="badge" style={{ fontSize: 10, marginTop: 4 }}>
                    ×{count}
                  </div>
                </>
              )}
              {count === 0 && (
                <div style={{ fontSize: 20, opacity: 0.2 }}>•</div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Линии и диагонали */}
      <div style={{ 
        marginTop: 20, 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 12,
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Строки:</div>
          <div className="badge">1-4-7: {rows.r147}</div>
          <div className="badge">2-5-8: {rows.r258}</div>
          <div className="badge">3-6-9: {rows.r369}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Диагонали:</div>
          <div className="badge">3-5-7: {diags.d357}</div>
          <div className="badge">1-5-9: {diags.d159}</div>
        </div>
      </div>
    </div>
  );
}

