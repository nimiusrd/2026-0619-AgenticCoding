import type { GameState } from '../types/tower'
import { getMinimumMoves } from '../utils/hanoi'
import TowerBoard from './TowerBoard'
import AutoPlayer from './AutoPlayer'

interface ClearScreenProps {
  game: GameState
  onReplay: () => void
  onBackToDifficulty: () => void
  onShowAnswer: () => void
  isAutoPlaying: boolean
}

export default function ClearScreen({
  game,
  onReplay,
  onBackToDifficulty,
  onShowAnswer,
  isAutoPlaying,
}: ClearScreenProps) {
  const minimumMoves = getMinimumMoves(game.difficulty)
  const isOptimal = game.moveCount === minimumMoves

  return (
    <div className="clear-screen">
      <div className="clear-celebration">
        <h1>🎉 おめでとう！ 🎉</h1>
        <p className="clear-message">ハノイの塔をクリアしました！</p>
      </div>

      <TowerBoard game={game} />

      <div className="clear-stats">
        <div className="stat-item">
          <span className="stat-label">移動回数:</span>
          <span className="stat-value">{game.moveCount} 回</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最小回数:</span>
          <span className="stat-value">{minimumMoves} 回</span>
        </div>
        {isOptimal ? (
          <p className="optimal-message">✨ パーフェクト！最短で達成しました！</p>
        ) : (
          <p className="progress-message">
            あと {game.moveCount - minimumMoves} 回短縮できるかな？
          </p>
        )}
      </div>

      <AutoPlayer
        isPlaying={isAutoPlaying}
        speed="normal"
        onSpeedChange={() => {}}
      />

      <div className="clear-buttons">
        <button type="button" className="button-primary" onClick={onReplay}>
          もう一度
        </button>
        <button type="button" className="button-secondary" onClick={onShowAnswer}>
          答え合わせを見る 🎬
        </button>
        <button type="button" className="button-tertiary" onClick={onBackToDifficulty}>
          難度選択に戻る
        </button>
      </div>
    </div>
  )
}
