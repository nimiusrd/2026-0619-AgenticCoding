import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  it('renders heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', {
      name: /React \+ Vite \+ TypeScript/i,
    })
    expect(heading).toBeDefined()
  })
})
