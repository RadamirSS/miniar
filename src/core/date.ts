export function parseDOB(input: string): {day:number,month:number,year:number} | null {
  input = input.trim()
  const iso = /^\d{4}-\d{2}-\d{2}$/
  const dot = /^\d{2}\.\d{2}\.\d{4}$/
  let d=0,m=0,y=0
  if (iso.test(input)) {
    const [yy,mm,dd] = input.split('-').map(Number)
    y=yy;m=mm;d=dd
  } else if (dot.test(input)) {
    const [dd,mm,yy] = input.split('.').map(Number)
    y=yy;m=mm;d=dd
  } else {
    return null
  }
  const dt = new Date(y, m-1, d)
  if (dt.getFullYear()!==y || dt.getMonth()!==m-1 || dt.getDate()!==d) return null
  if (y<1900) return null
  const now = new Date()
  if (dt>now) return null
  return { day:d, month:m, year:y }
}
