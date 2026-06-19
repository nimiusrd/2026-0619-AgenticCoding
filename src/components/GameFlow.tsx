import { useState, useEffect, useCallback } from 'react'
import type { Difficulty, GameState, AutoPlaySpeed, Rod } from '../types/tower'
import { initializeGame, isGameCleared, canMoveDisk, moveDisk } from '../utils/hanoi'
import { generateOptimalMoves } from '../utils/hanoiSolver'
import { autoExecuteMoves } from '../utils/autoPlay'
import DifficultySelect from './DifficultySelect'
import TowerBoard from './TowerBoard'
import DiskSelector from './DiskSelector'
import AutoPlayer from './AutoPlayer'
import ClearScreen from './ClearScreen'

type GamePhase = 'difficulty' | 'playing' | 'cleared'

export default function GameFlow() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('difficulty')
  const [game, setGame] = useState<GameState | null>(null)
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<AutoPlaySpeed>('normal')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const handleDifficultySelect = (difficulty: Difficulty) => {
    const newGame = initializeGame(difficulty)
    setGame(newGame)
    setGamePhase('playing')
  }

  const handleGameUpdate = (newGame: GameState) => {
    setGame(newGame)
    if (isGameCleared(newGame)) {
      setGamePhase('cleared')
    }
  }

  const handleDragDropMove = (from: Rod, to: Rod) => {
    if (!game || isAutoPlaying) return

    if (!canMoveDisk(game, from, to)) {
      return
    }

    try {
      const newGame = moveDisk(game, from, to)
      handleGameUpdate(newGame)
    } catch (error) {
      console.error('Move error:', error)
    }
  }

  const handleReset = useCallback(() => {
    if (!game) return
    const newGame = initializeGame(game.difficulty)
    setGame(newGame)
  }, [game])

  const handleShowAnswer = useCallback(async () => {
    if (!game) return

    setIsAutoPlaying(true)
    const moves = generateOptimalMoves(
      game.difficulty,
      'A',
      'C',
      'B',
    )

    try {
      await autoExecuteMoves(
        moves,
        autoPlaySpeed,
        (move) => {
          // 各手順を実行
          setGame((prevGame) => {
            if (!prevGame) return prevGame
            // 簡略版：手順の有効性チェックなしで実行
            const newGame = { ...prevGame }
            const disk = newGame.rods[move.from].pop()
            if (disk) {
              newGame.rods[move.to].push(disk)
            }
            return newGame
          })
        },
        () => {
          setIsAutoPlaying(false)
        },
      )
    } catch (error) {
      console.error('Auto play error:', error)
      setIsAutoPlaying(false)
    }
  }, [game, autoPlaySpeed])

  const handleReplay = () => {
    if (!game) return
    const newGame = initializeGame(game.difficulty)
    setGame(newGame)
    setGamePhase('playing')
  }

  const handleBackToDifficulty = () => {
    setGamePhase('difficulty')
    setGame(null)
  }

  const handleShowAnswerFromClear = async () => {
    if (!game) return

    setIsAutoPlaying(true)
    const moves = generateOptimalMoves(
      game.difficulty,
      'A',
      'C',
      'B',
    )

    try {
      await autoExecuteMoves(
        moves,
        autoPlaySpeed,
        (move) => {
          setGame((prevGame) => {
            if (!prevGame) return prevGame
            const newGame = { ...prevGame }
            const disk = newGame.rods[move.from].pop()
            if (disk) {
              newGame.rods[move.to].push(disk)
            }
            return newGame
          })
        },
        () => {
          setIsAutoPlaying(false)
        },
      )
    } catch (error) {
      console.error('Auto play error:', error)
      setIsAutoPlaying(false)
    }
  }

  // キーボードショートカット (S: 答えを見る, R: リセット)
  useEffect(() => {
    if (gamePhase !== 'playing' || isAutoPlaying) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault()
        handleShowAnswer()
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        handleReset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gamePhase, isAutoPlaying, handleShowAnswer, handleReset])

  if (gamePhase === 'difficulty') {
    return <DifficultySelect onSelect={handleDifficultySelect} />
  }

  if (gamePhase === 'playing' && game) {
    return (
      <div className="game-flow">
        <h1>ハノイの塔♪</h1>
        <TowerBoard game={game} onDragDropMove={handleDragDropMove} />
        <DiskSelector
          game={game}
          onGameUpdate={handleGameUpdate}
          onShowAnswer={handleShowAnswer}
          onReset={handleReset}
          isAutoPlaying={isAutoPlaying}
        />
        <AutoPlayer
          isPlaying={isAutoPlaying}
          speed={autoPlaySpeed}
          onSpeedChange={setAutoPlaySpeed}
        />
      </div>
    )
  }

  if (gamePhase === 'cleared' && game) {
    return (
      <ClearScreen
        game={game}
        onReplay={handleReplay}
        onBackToDifficulty={handleBackToDifficulty}
        onShowAnswer={handleShowAnswerFromClear}
        isAutoPlaying={isAutoPlaying}
      />
    )
  }

  return null
}
