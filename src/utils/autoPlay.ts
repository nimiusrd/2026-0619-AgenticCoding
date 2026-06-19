import type { Move, AutoPlaySpeed } from '../types/tower'

/**
 * 速度に基づいて遅延時間を取得♪
 */
export function getDelayForSpeed(speed: AutoPlaySpeed): number {
  switch (speed) {
    case 'slow':
      return 1000
    case 'normal':
      return 500
    case 'fast':
      return 200
  }
}

/**
 * 手順を自動実行♪
 * @param moves 移動手順の配列
 * @param speed 実行速度
 * @param onMove 各手順実行時のコールバック
 * @param onComplete すべて完了時のコールバック
 */
export async function autoExecuteMoves(
  moves: Move[],
  speed: AutoPlaySpeed,
  onMove: (move: Move) => void,
  onComplete: () => void,
): Promise<void> {
  const delay = getDelayForSpeed(speed)

  for (const move of moves) {
    // 遅延後に手順を実行
    await new Promise((resolve) => setTimeout(resolve, delay))
    onMove(move)
  }

  // すべての手順が完了
  onComplete()
}
