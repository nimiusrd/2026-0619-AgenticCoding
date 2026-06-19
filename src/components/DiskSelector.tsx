import { useState, useEffect, useCallback } from 'react'
import type { GameState, Rod } from '../types/tower'
import { canMoveDisk, moveDisk, isGameCleared } from '../utils/hanoi'

interface DiskSelectorProps {
  game: GameState
  onGameUpdate: (newGame: GameState) => void
  onShowAnswer: () => void
  onReset: () => void
  isAutoPlaying?: boolean
}

export default function DiskSelector({
  game,
  onGameUpdate,
  onShowAnswer,
  onReset,
  isAutoPlaying = false,
}: DiskSelectorProps) {
  const [selectedRod, setSelectedRod] = useState<Rod | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleRodClick = useCallback((rod: Rod) => {
    if (isAutoPlaying) return

    if (selectedRod === null) {
      // 移動元を選択
      if (game.rods[rod].length === 0) {
        setErrorMessage('ここにはリングがありません！')
        setTimeout(() => setErrorMessage(''), 2000)
        return
      }
      setSelectedRod(rod)
      setErrorMessage('')
    } else if (selectedRod === rod) {
      // 同じロッドを再度クリック → キャンセル
      setSelectedRod(null)
      setErrorMessage('')
    } else {
      // 移動先を選択して実行
      const targetRod = rod
      if (!canMoveDisk(game, selectedRod, targetRod)) {
        setErrorMessage('そこには置けません！')
        setTimeout(() => setErrorMessage(''), 2000)
        setSelectedRod(null)
        return
      }

      try {
        const newGame = moveDisk(game, selectedRod, targetRod)
        onGameUpdate(newGame)
        setSelectedRod(null)
        setErrorMessage('')

        // クリア判定
        if (isGameCleared(newGame)) {
          // クリアはGameFlowで処理
        }
      } catch (error) {
        setErrorMessage('エラーが発生しました')
        setTimeout(() => setErrorMessage(''), 2000)
        setSelectedRod(null)
      }
    }
  }, [game, selectedRod, isAutoPlaying, onGameUpdate])

  const rodNames: Rod[] = ['A', 'B', 'C']

  // キーボードショートカット (A/1: ロッドA, B/2: ロッドB, C/3: ロッドC)
  useEffect(() => {
    if (isAutoPlaying) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: { [key: string]: Rod } = {
        'a': 'A', 'A': 'A', '1': 'A',
        'b': 'B', 'B': 'B', '2': 'B',
        'c': 'C', 'C': 'C', '3': 'C',
      }

      const rod = keyMap[event.key]
      if (rod) {
        event.preventDefault()
        handleRodClick(rod)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAutoPlaying, handleRodClick])

  return (
    <div className="disk-selector">
      <div className="rod-buttons">
        {rodNames.map((rod) => (
          <button
            key={rod}
            type="button"
            className={`rod-button ${selectedRod === rod ? 'selected' : ''}`}
            onClick={() => handleRodClick(rod)}
            disabled={isAutoPlaying}
          >
            ロッド {rod}
            {game.rods[rod].length > 0 && (
              <span className="disk-count">({game.rods[rod].length})</span>
            )}
          </button>
        ))}
      </div>

      {selectedRod && (
        <div className="selection-info">
          ロッド <strong>{selectedRod}</strong> から移動します
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="game-controls">
        <button
          type="button"
          className="answer-button"
          onClick={onShowAnswer}
          disabled={isAutoPlaying}
        >
          答えを見る ✨
        </button>
        <button
          type="button"
          className="reset-button"
          onClick={onReset}
          disabled={isAutoPlaying}
        >
          リセット 🔄
        </button>
      </div>
    </div>
  )
}
