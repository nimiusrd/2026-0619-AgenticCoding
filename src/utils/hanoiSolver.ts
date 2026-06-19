import type { Move, Rod, GameState } from '../types/tower'
import { canMoveDisk, moveDisk } from './hanoi'

/**
 * ハノイの塔の最適な手順を生成♪
 * 再帰的アルゴリズム：2^n - 1 手が最小手数
 *
 * @param n ディスク枚数
 * @param from 移動元ロッド
 * @param to 移動先ロッド
 * @param auxiliary 補助ロッド
 * @returns Move配列（手順）
 */
export function generateOptimalMoves(
  n: number,
  from: Rod,
  to: Rod,
  auxiliary: Rod,
): Move[] {
  if (n === 1) {
    return [{ from, to }]
  }

  // n-1個のディスクを補助ロッドに移動（目的地は from ロッド）
  const part1 = generateOptimalMoves(n - 1, from, auxiliary, to)

  // 一番大きいディスクを目的地に移動
  const part2: Move[] = [{ from, to }]

  // 補助ロッドの n-1 個を目的地に移動（from ロッドを補助として使う）
  const part3 = generateOptimalMoves(n - 1, auxiliary, to, from)

  return [...part1, ...part2, ...part3]
}

/**
 * 手順がゲーム状態で有効か検証♪
 * （すべての移動が規則に従っているか）
 */
export function isValidMoveSequence(game: GameState, moves: Move[]): boolean {
  let currentGame = game
  for (const move of moves) {
    if (!canMoveDisk(currentGame, move.from, move.to)) {
      return false
    }
    try {
      currentGame = moveDisk(currentGame, move.from, move.to)
    } catch {
      return false
    }
  }
  return true
}

/**
 * 手順を文字列形式で表現（デバッグ用）♪
 */
export function formatMoveSequence(moves: Move[]): string {
  return moves.map((move) => `${move.from}→${move.to}`).join(', ')
}
