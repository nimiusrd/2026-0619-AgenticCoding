import { describe, it, expect } from 'vitest'
import {
  initializeGame,
  canMoveDisk,
  moveDisk,
  isGameCleared,
  getTopDisk,
} from './hanoi'

describe('Hanoi Game Logic', () => {
  describe('initializeGame', () => {
    it('should initialize game with 3 disks on rod A', () => {
      const game = initializeGame(3)
      expect(game.rods.A).toHaveLength(3)
      expect(game.rods.B).toHaveLength(0)
      expect(game.rods.C).toHaveLength(0)
      expect(game.moveCount).toBe(0)
      expect(game.difficulty).toBe(3)
    })

    it('should initialize game with 4 disks on rod A', () => {
      const game = initializeGame(4)
      expect(game.rods.A).toHaveLength(4)
      expect(game.moveCount).toBe(0)
    })

    it('should initialize disks in correct order (largest at bottom)', () => {
      const game = initializeGame(3)
      expect(game.rods.A[0].id).toBe(3) // largest disk at bottom
      expect(game.rods.A[1].id).toBe(2)
      expect(game.rods.A[2].id).toBe(1) // smallest disk at top
    })
  })

  describe('getTopDisk', () => {
    it('should return the top disk from a rod', () => {
      const game = initializeGame(3)
      const topDisk = getTopDisk(game, 'A')
      expect(topDisk?.id).toBe(1)
    })

    it('should return undefined when rod is empty', () => {
      const game = initializeGame(3)
      const topDisk = getTopDisk(game, 'B')
      expect(topDisk).toBeUndefined()
    })
  })

  describe('canMoveDisk', () => {
    it('should allow moving from rod A to rod B (empty target)', () => {
      const game = initializeGame(3)
      expect(canMoveDisk(game, 'A', 'B')).toBe(true)
    })

    it('should not allow moving from empty rod', () => {
      const game = initializeGame(3)
      expect(canMoveDisk(game, 'B', 'C')).toBe(false)
    })

    it('should allow moving smaller disk on top of larger disk', () => {
      const game = initializeGame(3)
      // Move disk 1 from A to B
      const updated = moveDisk(game, 'A', 'B')
      // Now move disk 1 from B to C
      expect(canMoveDisk(updated, 'B', 'C')).toBe(true)
    })

    it('should not allow moving larger disk on top of smaller disk', () => {
      const game = initializeGame(3)
      // Move disk 1 from A to B
      const updated1 = moveDisk(game, 'A', 'B')
      // Move disk 1 from B to C
      const updated2 = moveDisk(updated1, 'B', 'C')
      // Try to move disk 2 from A onto disk 1 in C
      expect(canMoveDisk(updated2, 'A', 'C')).toBe(false)
    })

    it('should allow moving disk 2 to empty rod B', () => {
      const game = initializeGame(3)
      // Move disk 1 first
      const updated = moveDisk(game, 'A', 'B')
      // Now disk 2 is at top of rod A
      expect(canMoveDisk(updated, 'A', 'C')).toBe(true)
    })
  })

  describe('moveDisk', () => {
    it('should move disk from source to destination rod', () => {
      const game = initializeGame(3)
      const updated = moveDisk(game, 'A', 'B')
      expect(updated.rods.A).toHaveLength(2)
      expect(updated.rods.B).toHaveLength(1)
      expect(updated.rods.B[0].id).toBe(1)
    })

    it('should increment move count', () => {
      const game = initializeGame(3)
      const updated = moveDisk(game, 'A', 'B')
      expect(updated.moveCount).toBe(1)
    })

    it('should throw error on invalid move', () => {
      const game = initializeGame(3)
      // Try to move from empty rod
      expect(() => moveDisk(game, 'B', 'C')).toThrow()
    })

    it('should handle multiple sequential moves', () => {
      let game = initializeGame(3)
      game = moveDisk(game, 'A', 'B')
      game = moveDisk(game, 'A', 'C')
      game = moveDisk(game, 'B', 'C')
      expect(game.moveCount).toBe(3)
      expect(game.rods.C).toHaveLength(2)
    })
  })

  describe('isGameCleared', () => {
    it('should return false when game is not cleared', () => {
      const game = initializeGame(3)
      expect(isGameCleared(game)).toBe(false)
    })

    it('should return true when all disks are on rod C', () => {
      let game = initializeGame(3)
      // 3-disk Tower of Hanoi solution: 7 moves
      game = moveDisk(game, 'A', 'C')
      game = moveDisk(game, 'A', 'B')
      game = moveDisk(game, 'C', 'B')
      game = moveDisk(game, 'A', 'C')
      game = moveDisk(game, 'B', 'A')
      game = moveDisk(game, 'B', 'C')
      game = moveDisk(game, 'A', 'C')
      expect(isGameCleared(game)).toBe(true)
    })

    it('should return false when disks are on different rods', () => {
      let game = initializeGame(3)
      game = moveDisk(game, 'A', 'B')
      expect(isGameCleared(game)).toBe(false)
    })
  })
})
