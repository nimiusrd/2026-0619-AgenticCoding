import type { GameState, Disk, Difficulty, Rod } from '../types/tower'

/**
 * ゲーム初期化♪
 * @param difficulty ディスク枚数（3, 4, 5）
 */
export function initializeGame(difficulty: Difficulty): GameState {
  // ディスク配列を作成（大きい順）
  const disks: Disk[] = Array.from({ length: difficulty }, (_, i) => ({
    id: (difficulty - i) as 1 | 2 | 3 | 4 | 5,
  }))

  return {
    rods: {
      A: disks,
      B: [],
      C: [],
    },
    moveCount: 0,
    difficulty,
    startTime: Date.now(),
  }
}

/**
 * ロッドの一番上のディスクを取得♪
 */
export function getTopDisk(game: GameState, rod: Rod): Disk | undefined {
  const disks = game.rods[rod]
  return disks.length > 0 ? disks[disks.length - 1] : undefined
}

/**
 * ディスク移動が有効かチェック♪
 * - fromロッドが空でない
 * - toロッドが空 OR 移動元のディスクがtoロッドの上のディスクより小さい
 */
export function canMoveDisk(game: GameState, from: Rod, to: Rod): boolean {
  const sourceTop = getTopDisk(game, from)
  if (!sourceTop) return false

  const targetTop = getTopDisk(game, to)
  if (!targetTop) return true // 空のロッドなら常に移動可能

  // 移動元のディスクが移動先のディスクより小さい必要がある
  return sourceTop.id < targetTop.id
}

/**
 * ディスク移動を実行♪
 * @throws 無効な移動の場合
 */
export function moveDisk(game: GameState, from: Rod, to: Rod): GameState {
  if (!canMoveDisk(game, from, to)) {
    throw new Error(`Cannot move disk from rod ${from} to rod ${to}`)
  }

  // 新しいゲーム状態を作成
  const newGame: GameState = {
    ...game,
    rods: {
      A: [...game.rods.A],
      B: [...game.rods.B],
      C: [...game.rods.C],
    },
    moveCount: game.moveCount + 1,
  }

  // ディスクを移動
  const disk = newGame.rods[from].pop()
  if (disk) {
    newGame.rods[to].push(disk)
  }

  return newGame
}

/**
 * ゲームクリアをチェック♪
 * ロッドCにすべてのディスクが移動しているか
 */
export function isGameCleared(game: GameState): boolean {
  return (
    game.rods.C.length === game.difficulty &&
    game.rods.A.length === 0 &&
    game.rods.B.length === 0
  )
}

/**
 * 最小移動回数を計算♪
 * ハノイの塔は 2^n - 1 手が最小
 */
export function getMinimumMoves(difficulty: Difficulty): number {
  return 2 ** difficulty - 1
}
