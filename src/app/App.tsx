import { useAppStore } from '@/state/useAppStore'
import { DateInput } from '@/components/DateInput'
import { CalcCard } from '@/components/CalcCard'
import { calculators } from '@/config/calculators'

import { Header } from "@/components/Header"
export default function App() {
  const dob = useAppStore(s => s.dob)
  return (
    <div className="container">
      <Header />
      <DateInput />
      {dob && (
        <div className="mt-4 space-y-3">
          {calculators.map(c => (
            <CalcCard key={c.id} calc={c} />
          ))}
        </div>
      )}
    </div>
  )
}
