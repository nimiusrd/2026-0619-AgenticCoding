import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component - Tower of Hanoi Game', () => {
  it('renders difficulty select screen', () => {
    render(<App />)
    const heading = screen.getByRole('heading', {
      name: /ハノイの塔/i,
    })
    expect(heading).toBeDefined()
  })

  it('displays difficulty buttons', () => {
    render(<App />)
    const button3 = screen.getByRole('button', { name: /3つのリング/ })
    const button4 = screen.getByRole('button', { name: /4つのリング/ })
    const button5 = screen.getByRole('button', { name: /5つのリング/ })
    expect(button3).toBeDefined()
    expect(button4).toBeDefined()
    expect(button5).toBeDefined()
  })
})

