import { describe, it, expect } from 'vitest'
import { generateOptimalMoves, isValidMoveSequence } from './hanoiSolver'
import { initializeGame, moveDisk, isGameCleared } from './hanoi'

describe('Hanoi Solver Algorithm', () => {
  describe('generateOptimalMoves', () => {
    it('should generate 7 moves for 3 disks', () => {
      const moves = generateOptimalMoves(3, 'A', 'C', 'B')
      expect(moves).toHaveLength(7)
    })

    it('should generate 15 moves for 4 disks', () => {
      const moves = generateOptimalMoves(4, 'A', 'C', 'B')
      expect(moves).toHaveLength(15)
    })

    it('should generate 31 moves for 5 disks', () => {
      const moves = generateOptimalMoves(5, 'A', 'C', 'B')
      expect(moves).toHaveLength(31)
    })

    it('should generate 1 move for 1 disk', () => {
      const moves = generateOptimalMoves(1, 'A', 'C', 'B')
      expect(moves).toHaveLength(1)
      expect(moves[0]).toEqual({ from: 'A', to: 'C' })
    })

    it('should generate valid first move', () => {
      const moves = generateOptimalMoves(3, 'A', 'C', 'B')
      // First move is A→C (1st step of recursive algorithm)
      expect(moves[0]).toEqual({ from: 'A', to: 'C' })
    })

    it('should generate valid moves for reaching different target rod', () => {
      const movesToB = generateOptimalMoves(3, 'A', 'B', 'C')
      expect(movesToB).toHaveLength(7)
      // Verify last move is to rod B
      expect(movesToB[movesToB.length - 1].to).toBe('B')
    })
  })

  describe('isValidMoveSequence', () => {
    it('should validate 3-disk solution', () => {
      const game = initializeGame(3)
      const moves = generateOptimalMoves(3, 'A', 'C', 'B')
      expect(isValidMoveSequence(game, moves)).toBe(true)
    })

    it('should result in game cleared state after all moves', () => {
      let game = initializeGame(3)
      const moves = generateOptimalMoves(3, 'A', 'C', 'B')
      
      for (const move of moves) {
        game = moveDisk(game, move.from, move.to)
      }
      
      expect(isGameCleared(game)).toBe(true)
    })

    it('should validate 4-disk solution', () => {
      let game = initializeGame(4)
      const moves = generateOptimalMoves(4, 'A', 'C', 'B')
      
      for (const move of moves) {
        game = moveDisk(game, move.from, move.to)
      }
      
      expect(isGameCleared(game)).toBe(true)
    })

    it('should validate 5-disk solution', () => {
      let game = initializeGame(5)
      const moves = generateOptimalMoves(5, 'A', 'C', 'B')
      
      for (const move of moves) {
        game = moveDisk(game, move.from, move.to)
      }
      
      expect(isGameCleared(game)).toBe(true)
    })
  })
})
