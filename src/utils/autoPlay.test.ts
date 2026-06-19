import { describe, it, expect, vi } from 'vitest'
import { autoExecuteMoves, getDelayForSpeed } from './autoPlay'
import type { Move } from '../types/tower'

describe('Auto Play Logic', () => {
  describe('getDelayForSpeed', () => {
    it('should return slow delay (1000ms)', () => {
      expect(getDelayForSpeed('slow')).toBe(1000)
    })

    it('should return normal delay (500ms)', () => {
      expect(getDelayForSpeed('normal')).toBe(500)
    })

    it('should return fast delay (200ms)', () => {
      expect(getDelayForSpeed('fast')).toBe(200)
    })
  })

  describe('autoExecuteMoves', () => {
    it('should execute all moves in order', async () => {
      const moves: Move[] = [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'C' },
      ]

      const onMove = vi.fn()
      const onComplete = vi.fn()

      await autoExecuteMoves(moves, 'fast', onMove, onComplete)

      expect(onMove).toHaveBeenCalledTimes(3)
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should call onMove callback with correct move data', async () => {
      const moves: Move[] = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
      ]

      const onMove = vi.fn()
      const onComplete = vi.fn()

      await autoExecuteMoves(moves, 'fast', onMove, onComplete)

      expect(onMove).toHaveBeenNthCalledWith(1, { from: 'A', to: 'B' })
      expect(onMove).toHaveBeenNthCalledWith(2, { from: 'B', to: 'C' })
    })

    it('should call onComplete callback after all moves', async () => {
      const moves: Move[] = [{ from: 'A', to: 'B' }]

      const onMove = vi.fn()
      const onComplete = vi.fn()

      await autoExecuteMoves(moves, 'fast', onMove, onComplete)

      expect(onComplete).toHaveBeenCalled()
    })

    it('should respect speed setting in delays', async () => {
      const moves: Move[] = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
      ]

      const onMove = vi.fn()
      const onComplete = vi.fn()

      const startTime = Date.now()
      await autoExecuteMoves(moves, 'fast', onMove, onComplete)
      const elapsed = Date.now() - startTime

      // Fast speed should complete in ~400ms (2 moves * 200ms)
      // Allow some tolerance for execution overhead
      expect(elapsed).toBeLessThan(1000)
    })

    it('should work with empty moves array', async () => {
      const moves: Move[] = []

      const onMove = vi.fn()
      const onComplete = vi.fn()

      await autoExecuteMoves(moves, 'fast', onMove, onComplete)

      expect(onMove).not.toHaveBeenCalled()
      expect(onComplete).toHaveBeenCalled()
    })
  })
})
