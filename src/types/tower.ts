/**
 * ハノイの塔ゲーム型定義♪
 */

/** ディスク ID（1が最小、数字が大きいほど大きいディスク） */
export type DiskId = 1 | 2 | 3 | 4 | 5

/** ディスク */
export interface Disk {
  id: DiskId
}

/** ロッド（A, B, C） */
export type Rod = 'A' | 'B' | 'C'

/** ゲーム難度 */
export type Difficulty = 3 | 4 | 5

/** ゲーム状態 */
export interface GameState {
  /** 各ロッド上のディスク配列（下から上へ） */
  rods: {
    A: Disk[]
    B: Disk[]
    C: Disk[]
  }
  /** 移動回数 */
  moveCount: number
  /** 現在の難度（ディスク枚数） */
  difficulty: Difficulty
  /** ゲーム開始時刻（秒） */
  startTime: number
}

/** ディスク移動操作♪ */
export interface Move {
  from: Rod
  to: Rod
}

/** 自動実行速度 */
export type AutoPlaySpeed = 'slow' | 'normal' | 'fast'
