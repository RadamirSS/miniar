/**
 * Компонент для отображения интерпретаций квадрата Пифагора
 */

import { useState } from 'react';
import type { SquareResult, Counts } from '@/lib/pifagor/types';
import { getDigitText, getLinesAndDiagsText, getPsychotypeText } from '@/lib/pifagor/interpret';

interface PifagorInsightsProps {
  result: SquareResult;
}

export function PifagorInsights({ result }: PifagorInsightsProps) {
  const [openSection, setOpenSection] = useState<string | null>('digits');
  
  const linesAndDiags = getLinesAndDiagsText(result);
  const psychotypeText = getPsychotypeText(result.counts);
  
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  return (
    <div style={{ marginTop: 20 }}>
      {/* Цифры */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div 
          className="accordion-head" 
          onClick={() => toggleSection('digits')}
          style={{ cursor: 'pointer' }}
        >
          <div className="accordion-title">Цифры</div>
          <svg 
            className={`chev ${openSection === 'digits' ? 'open' : ''}`} 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" opacity=".8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className={`panel ${openSection === 'digits' ? 'open' : ''}`}>
          <div style={{ marginTop: 12 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => {
              const count = result.counts[String(digit)] || 0;
              const { base, level } = getDigitText(digit, count);
              const levelKey = count === 0 
                ? (digit === 2 ? 'Х/1-2' : 'X') 
                : digit.toString().repeat(count);
              
              return (
                <div key={digit} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div className="badge">Цифра {digit}</div>
                    <div className="badge" style={{ opacity: 0.7 }}>
                      {count > 0 ? levelKey : 'отсутствует'} ({count})
                    </div>
                  </div>
                  {base && (
                    <div style={{ 
                      fontSize: 13, 
                      opacity: 0.85, 
                      marginBottom: 8,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6
                    }}>
                      {base}
                    </div>
                  )}
                  {level && (
                    <div style={{ 
                      fontSize: 13, 
                      marginTop: 8,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      padding: 10,
                      background: 'rgba(139, 92, 246, 0.08)',
                      borderRadius: 8,
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      {level}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Линии и диагонали */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div 
          className="accordion-head" 
          onClick={() => toggleSection('lines')}
          style={{ cursor: 'pointer' }}
        >
          <div className="accordion-title">Линии и диагонали</div>
          <svg 
            className={`chev ${openSection === 'lines' ? 'open' : ''}`} 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" opacity=".8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className={`panel ${openSection === 'lines' ? 'open' : ''}`}>
          <div style={{ marginTop: 12 }}>
            {[
              { key: 'row_1_4_7', label: 'Строка 1-4-7' },
              { key: 'row_2_5_8', label: 'Строка 2-5-8' },
              { key: 'row_3_6_9', label: 'Строка 3-6-9' },
              { key: 'diag_3_5_7', label: 'Диагональ 3-5-7' },
              { key: 'diag_1_5_9', label: 'Диагональ 1-5-9' },
            ].map(({ key, label }) => {
              const item = linesAndDiags[key];
              if (!item) return null;
              
              return (
                <div key={key} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div className="badge">{label}</div>
                    <div className="badge" style={{ opacity: 0.7 }}>Сумма: {item.qty}</div>
                  </div>
                  {item.text && (
                    <div style={{ 
                      fontSize: 13,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      padding: 10,
                      background: 'rgba(139, 92, 246, 0.08)',
                      borderRadius: 8,
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      {item.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Психотип */}
      <div className="card">
        <div 
          className="accordion-head" 
          onClick={() => toggleSection('psychotype')}
          style={{ cursor: 'pointer' }}
        >
          <div className="accordion-title">Психотип</div>
          <svg 
            className={`chev ${openSection === 'psychotype' ? 'open' : ''}`} 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" opacity=".8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className={`panel ${openSection === 'psychotype' ? 'open' : ''}`}>
          <div style={{ marginTop: 12 }}>
            <div style={{ 
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              padding: 10,
              background: 'rgba(139, 92, 246, 0.08)',
              borderRadius: 8,
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              {psychotypeText}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
              Единиц: {result.counts['1'] || 0}, Двоек: {result.counts['2'] || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

