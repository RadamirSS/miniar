import { DOB } from '@/state/useAppStore'

export type NumberResult = { kind:'number', value:number, key?: string }
export type NumbersResult = { kind:'numbers', values:number[], key?: string }
export type PifagorResult = { kind:'pifagor', matrix:number[][], counts: Record<string, number> }
export type Result = NumberResult | NumbersResult | PifagorResult

export type CalcConfig = {
  id: 'numerology_day'|'life_path'|'pifagor'|'rhythm_year'
  title: string
  dataUrl: string
  renderInterpretation: (res: Result, data: any) => JSX.Element | null
}

function sumDigits(n: number): number {
  let s = 0
  for (const ch of String(n)) if (/[0-9]/.test(ch)) s += Number(ch)
  return s
}
function reduceToDigit(n: number): number {
  while (n > 9) { n = sumDigits(n) }
  return n
}

// 1) Число дня рождения — редукция дня до 1..9 (ключ для текста определим в renderInterpretation на основе JSON)
function calcNumerologyDay(dob: DOB): NumberResult {
  if(!dob) return { kind:'number', value: 0 }
  const day = dob.day
  const value = reduceToDigit(day)
  return { kind:'number', value }
}

// 2) Число жизненного пути — сумма всех цифр даты рождения до 1..9
function calcLifePath(dob: DOB): NumberResult {
  if(!dob) return { kind:'number', value: 0 }
  const n = sumDigits(dob.day) + sumDigits(dob.month) + sumDigits(dob.year)
  const value = reduceToDigit(n)
  return { kind:'number', value, key: String(value) }
}

// 3) Квадрат Пифагора — считаем количество каждой цифры 1..9 в ДДММГГГГ
function calcPifagor(dob: DOB): PifagorResult {
  if(!dob) return { kind:'pifagor', matrix: [], counts:{} as Record<string, number> }
  const s = `${dob.day.toString().padStart(2,'0')}${dob.month.toString().padStart(2,'0')}${dob.year}`
  const counts: Record<string, number> = { '1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0 }
  for (const ch of s) if (counts[ch]!==undefined) counts[ch]++
  const order = ['1','4','7','2','5','8','3','6','9']
  const matrix = [0,1,2].map(r => [0,1,2].map(c => counts[order[r*3+c]]))
  return { kind:'pifagor', matrix, counts }
}

// 4) Ритм на год — личный год = сумма (день + месяц + целевой год) → 1..9, с учетом составных 13/14/15/21/22
function calcRhythmYear(dob: DOB, targetYear: number): NumberResult {
  if(!dob) return { kind:'number', value: 0 }
  const comp = sumDigits(dob.day) + sumDigits(dob.month) + sumDigits(targetYear)
  const reduced = reduceToDigit(comp)
  const special = ['13','14','15','21','22']
  let key: string | undefined = special.includes(String(comp)) ? String(comp) : String(reduced)
  return { kind:'number', value: reduced, key }
}

export function compute(id: CalcConfig['id'], dob: DOB): Result {
  switch(id){
    case 'numerology_day': return calcNumerologyDay(dob)
    case 'life_path': return calcLifePath(dob)
    case 'pifagor': return calcPifagor(dob)
    case 'rhythm_year': return calcRhythmYear(dob, new Date().getFullYear())
  }
}

export const calculators: CalcConfig[] = [
  {
    id: 'numerology_day',
    title: 'Число дня рождения',
    dataUrl: '/data/numerology.json',
    renderInterpretation: (res, data) => {
      const r = res as NumberResult
      // Определяем ключ через соответствие day -> раздел (где day присутствует в entries[key].dates)
      const entryMap = data as Record<string, any>
      // Соберём список всех дат в разделах
      let key: string | undefined = undefined
      // попытка найти исходную дату по всем разделам
      // так как мы не знаем dob тут, используем эвристику: разделы содержат "dates": [...] с днями месяца в строках,
      // мы покажем все разделы, где присутствует редуцированное значение r.value или прямой день не известен.
      // Проще: если есть ключ, равный r.value — берём его, иначе первый числовой ключ.
      if (entryMap[String(r.value)]) key = String(r.value)
      else {
        const numericKeys = Object.keys(entryMap).filter(k => /^\d+$/.test(k))
        key = numericKeys[0]
      }
      const entry = key ? entryMap[key] : null
      const title = entry?.tarot?.card || 'Расшифровка'
      const blocks: string[] = []
      if (entry?.tarot?.description) blocks.push(entry.tarot.description)
      if (entry?.vedic?.modes?.goodness) blocks.push(entry.vedic.modes.goodness)
      if (entry?.vedic?.modes?.passion) blocks.push(entry.vedic.modes.passion)
      if (entry?.vedic?.modes?.ignorance) blocks.push(entry.vedic.modes.ignorance)
      const text = blocks.join('\n\n')
      return <div><div style={{fontWeight:600, marginBottom:6}}>{title}</div><pre style={{whiteSpace:'pre-wrap'}}>{text}</pre></div>
    }
  },
  {
    id: 'life_path',
    title: 'Число жизненного пути',
    dataUrl: '/data/life_path_numbers.json',
    renderInterpretation: (res, data) => {
      const r = res as NumberResult
      const text = (data as any)[String(r.value)]
      return text ? <pre style={{whiteSpace:'pre-wrap'}}>{text}</pre> : <div>Нет расшифровки</div>
    }
  },
  {
    id: 'pifagor',
    title: 'Квадрат Пифагора',
    dataUrl: '/data/pifagor.json',
    renderInterpretation: (res, data) => {
      const r = res as PifagorResult
      const d = (data as any).digits
      const blocks: JSX.Element[] = []
      for (const digit of ['1','2','3','4','5','6','7','8','9']) {
        const count = r.counts[digit] || 0
        const levelKey = count===0 ? 'X' : digit.repeat(count)
        const base = d?.[digit]?.base
        const lvl = d?.[digit]?.levels?.[levelKey] || d?.[digit]?.levels?.[String(count)]
        blocks.push(
          <div key={digit} style={{marginTop:10}}>
            <div className="badge">Цифра {digit}: {levelKey}</div>
            {base && <pre style={{whiteSpace:'pre-wrap', opacity:.8, marginTop:6}}>{base}</pre>}
            {lvl && <pre style={{whiteSpace:'pre-wrap', marginTop:6}}>{lvl}</pre>}
          </div>
        )
      }
      return <div>{blocks}</div>
    }
  },
  {
    id: 'rhythm_year',
    title: 'Ритм на год',
    dataUrl: '/data/rhythm_year.json',
    renderInterpretation: (res, data) => {
      const r = res as NumberResult
      const d = data as any
      const txt = d[r.key || ''] || d[String(r.value)]
      return txt ? <pre style={{whiteSpace:'pre-wrap'}}>{txt}</pre> : <div>Нет расшифровки</div>
    }
  }
]
