import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DestinyPage } from './DestinyPage'
import { useAppStore } from '@/state/useAppStore'
import { cleanup } from '@testing-library/react'

describe('DestinyPage', () => {
  afterEach(() => {
    cleanup()
    useAppStore.getState().setDOB(null)
  })

  it('calculates matrix and keeps form visible', async () => {
    render(<DestinyPage />)

    const dateInput = screen.getByLabelText('Дата рождения (ДД.ММ.ГГГГ)') as HTMLInputElement
    fireEvent.change(dateInput, { target: { value: '18.06.1988' } })

    fireEvent.click(screen.getByText('Рассчитать матрицу'))

    await waitFor(() => {
      expect(screen.getByLabelText('Матрица судьбы')).toBeInTheDocument()
      expect(screen.getByLabelText('Путь / Судьба')).toBeInTheDocument()
    })

    expect(dateInput).toBeInTheDocument()
    expect(screen.getByText('Матрица судьбы · 22 аркана')).toBeInTheDocument()
    expect(screen.getByText('Арканы')).toBeInTheDocument()
  })
})


