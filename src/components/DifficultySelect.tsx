import type { Difficulty } from '../types/tower'

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void
}

const DIFFICULTIES: Array<{ value: Difficulty; label: string; emoji: string }> = [
  { value: 3, label: '3つのリング（簡単 🟡）', emoji: '🟡' },
  { value: 4, label: '4つのリング（ふつう 🟠）', emoji: '🟠' },
  { value: 5, label: '5つのリング（むずかしい 🔴）', emoji: '🔴' },
]

export default function DifficultySelect({ onSelect }: DifficultySelectProps) {
  return (
    <div className="difficulty-select">
      <h1>ハノイの塔にちょうせんしよう！♪</h1>
      <p>難度をえらんでください。</p>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.value}
            type="button"
            className="difficulty-button"
            onClick={() => onSelect(diff.value)}
          >
            <span className="difficulty-emoji">{diff.emoji}</span>
            <span className="difficulty-label">{diff.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
