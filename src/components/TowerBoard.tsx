import { useState } from 'react'
import type { GameState, Rod } from '../types/tower'

interface TowerBoardProps {
  game: GameState
  onDragDropMove?: (from: Rod, to: Rod) => void
}

/**
 * ディスクのサイズから幅を計算（相対値）
 * ディスク1（最小）: 60%, 5（最大）: 100%
 */
function getDiskWidth(diskId: number, maxDiskId: number): number {
  return 60 + ((diskId - 1) / (maxDiskId - 1)) * 40
}

/**
 * ディスクの色を取得♪
 */
function getDiskColor(diskId: number): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  return colors[diskId - 1] || '#999'
}

export default function TowerBoard({ game, onDragDropMove }: TowerBoardProps) {
  const maxDiskId = game.difficulty
  const [draggedDiskId, setDraggedDiskId] = useState<number | null>(null)
  const [draggedFromRod, setDraggedFromRod] = useState<Rod | null>(null)
  const [dragOverRod, setDragOverRod] = useState<Rod | null>(null)

  const handleDiskDragStart = (diskId: number, fromRod: Rod) => {
    setDraggedDiskId(diskId)
    setDraggedFromRod(fromRod)
  }

  const handleRodDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleRodDrop = (toRod: Rod) => {
    if (draggedFromRod && draggedDiskId !== null && draggedFromRod !== toRod) {
      onDragDropMove?.(draggedFromRod, toRod)
    }
    setDraggedDiskId(null)
    setDraggedFromRod(null)
    setDragOverRod(null)
  }

  const handleRodDragEnter = (rod: Rod) => {
    setDragOverRod(rod)
  }

  const handleRodDragLeave = () => {
    setDragOverRod(null)
  }

  return (
    <div className="tower-board">
      <div className="tower-container">
        {/* ロッドA */}
        <div className="rod-slot">
          <div className="rod-label">A</div>
          <div
            className={`rod ${dragOverRod === 'A' && draggedFromRod !== 'A' ? 'drag-over' : ''}`}
            onDragOver={handleRodDragOver}
            onDrop={() => handleRodDrop('A')}
            onDragEnter={() => handleRodDragEnter('A')}
            onDragLeave={handleRodDragLeave}
          >
            {game.rods.A.map((disk) => (
              <div
                key={disk.id}
                className={`disk ${draggedDiskId === disk.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDiskDragStart(disk.id, 'A')}
                onDragEnd={() => {
                  setDraggedDiskId(null)
                  setDraggedFromRod(null)
                  setDragOverRod(null)
                }}
                style={{
                  width: `${getDiskWidth(disk.id, maxDiskId)}%`,
                  backgroundColor: getDiskColor(disk.id),
                }}
                title={`ディスク ${disk.id}`}
              >
                <span className="disk-label">{disk.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ロッドB */}
        <div className="rod-slot">
          <div className="rod-label">B</div>
          <div
            className={`rod ${dragOverRod === 'B' && draggedFromRod !== 'B' ? 'drag-over' : ''}`}
            onDragOver={handleRodDragOver}
            onDrop={() => handleRodDrop('B')}
            onDragEnter={() => handleRodDragEnter('B')}
            onDragLeave={handleRodDragLeave}
          >
            {game.rods.B.map((disk) => (
              <div
                key={disk.id}
                className={`disk ${draggedDiskId === disk.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDiskDragStart(disk.id, 'B')}
                onDragEnd={() => {
                  setDraggedDiskId(null)
                  setDraggedFromRod(null)
                  setDragOverRod(null)
                }}
                style={{
                  width: `${getDiskWidth(disk.id, maxDiskId)}%`,
                  backgroundColor: getDiskColor(disk.id),
                }}
                title={`ディスク ${disk.id}`}
              >
                <span className="disk-label">{disk.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ロッドC */}
        <div className="rod-slot">
          <div className="rod-label">C</div>
          <div
            className={`rod ${dragOverRod === 'C' && draggedFromRod !== 'C' ? 'drag-over' : ''}`}
            onDragOver={handleRodDragOver}
            onDrop={() => handleRodDrop('C')}
            onDragEnter={() => handleRodDragEnter('C')}
            onDragLeave={handleRodDragLeave}
          >
            {game.rods.C.map((disk) => (
              <div
                key={disk.id}
                className={`disk ${draggedDiskId === disk.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDiskDragStart(disk.id, 'C')}
                onDragEnd={() => {
                  setDraggedDiskId(null)
                  setDraggedFromRod(null)
                  setDragOverRod(null)
                }}
                style={{
                  width: `${getDiskWidth(disk.id, maxDiskId)}%`,
                  backgroundColor: getDiskColor(disk.id),
                }}
                title={`ディスク ${disk.id}`}
              >
                <span className="disk-label">{disk.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 移動回数表示 */}
      <div className="move-counter">
        <p>移動回数: <strong>{game.moveCount}</strong></p>
      </div>
    </div>
  )
}
