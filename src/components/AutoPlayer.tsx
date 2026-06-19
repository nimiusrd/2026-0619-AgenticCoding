import type { AutoPlaySpeed } from '../types/tower'

interface AutoPlayerProps {
  isPlaying: boolean
  speed: AutoPlaySpeed
  onSpeedChange: (speed: AutoPlaySpeed) => void
}

export default function AutoPlayer({
  isPlaying,
  speed,
  onSpeedChange,
}: AutoPlayerProps) {
  if (!isPlaying) {
    return (
      <div className="auto-player-settings">
        <label htmlFor="speed-select">実行速度:</label>
        <div className="speed-buttons" id="speed-select">
          <button
            type="button"
            className={`speed-button ${speed === 'slow' ? 'active' : ''}`}
            onClick={() => onSpeedChange('slow')}
          >
            🐢 遅い
          </button>
          <button
            type="button"
            className={`speed-button ${speed === 'normal' ? 'active' : ''}`}
            onClick={() => onSpeedChange('normal')}
          >
            ⭐ ふつう
          </button>
          <button
            type="button"
            className={`speed-button ${speed === 'fast' ? 'active' : ''}`}
            onClick={() => onSpeedChange('fast')}
          >
            🚀 速い
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auto-player-playing">
      <p>自動実行中... ⏳</p>
      <div className="spinner" />
    </div>
  )
}
