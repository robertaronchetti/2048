import type { Tile, Direction, GameState } from '../types/game';

export const BOARD_SIZE = 4;
const BEST_SCORE_KEY = 'bestScore';

export function getStoredBestScore(): number {
    try{
        const stored = localStorage.getItem(BEST_SCORE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    }catch {
        return 0;
    }
}

export function saveBestScore(score: number): void {
    try{
        localStorage.setItem(BEST_SCORE_KEY, score.toString());
    }catch {
        // Ignore storage errors
    }
}

export function getEmptyPositions(tiles: Tile[], size = BOARD_SIZE): { row: number; col: number }[] {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
}

export function spawnRandomTile(tiles: Tile[], size = BOARD_SIZE): Tile | null {
  const empty = getEmptyPositions(tiles, size);
  if (empty.length === 0) return null;
  const { row, col } = empty[Math.floor(Math.random() * empty.length)];
  return {
    id: crypto.randomUUID(),
    value: Math.random() < 0.9 ? 2 : 4,
    row,
    col,
    isNew: true,
  };
}

export function initGame(size = BOARD_SIZE, currentBest = getStoredBestScore()): GameState {
  const first = spawnRandomTile([], size)!;
  const second = spawnRandomTile([first], size)!;
  return {
    tiles: [first, second],
    score: 0,
    bestScore: currentBest,
    over: false,
    won: false,
    size,
  };
}

// Line slide/merge helper
export function slideLine(line: Tile[]): { moved: boolean; scoreGained: number; result: Tile[] } {
  const nonNull = line.filter(t => t !== undefined);
  const result: Tile[] = [];
  let scoreGained = 0;
  let moved = false;
  let skipNext = false;

  for (let i = 0; i < nonNull.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    const current = nonNull[i];
    const next = nonNull[i + 1];

    if (next && current.value === next.value) {
      // Merge
      const mergedValue = current.value * 2;
      scoreGained += mergedValue;
      result.push({
        id: crypto.randomUUID(),
        value: mergedValue,
        row: current.row,
        col: current.col,
        isMerged: true,
      });
      skipNext = true;
      moved = true;
    } else {
      result.push({ ...current, isNew: false, isMerged: false });
    }
  }

  return { moved, scoreGained, result };
}

export function move(state: GameState, direction: Direction): GameState {
  const { tiles, size, score, bestScore } = state;
  const grid: (Tile | undefined)[][] = Array.from({ length: size }, () => Array(size).fill(undefined));

  tiles.forEach(t => {
    grid[t.row][t.col] = t;
  });

  let totalScoreGained = 0;
  let hasChanged = false;
  const nextTiles: Tile[] = [];

  for (let i = 0; i < size; i++) {
    const line: (Tile | undefined)[] = [];
    for (let j = 0; j < size; j++) {
      if (direction === 'LEFT') line.push(grid[i][j]);
      if (direction === 'RIGHT') line.push(grid[i][size - 1 - j]);
      if (direction === 'UP') line.push(grid[j][i]);
      if (direction === 'DOWN') line.push(grid[size - 1 - j][i]);
    }

    const { scoreGained, result } = slideLine(line.filter((t): t is Tile => Boolean(t)));
    totalScoreGained += scoreGained;

    result.forEach((tile, targetIndex) => {
      let newRow = i;
      let newCol = targetIndex;
      if (direction === 'RIGHT') newCol = size - 1 - targetIndex;
      if (direction === 'UP') { newRow = targetIndex; newCol = i; }
      if (direction === 'DOWN') { newRow = size - 1 - targetIndex; newCol = i; }

      if (tile.row !== newRow || tile.col !== newCol) {
        hasChanged = true;
      }
      nextTiles.push({ ...tile, row: newRow, col: newCol });
    });
  }

  // Check if tile count changed (from merges)
  if (nextTiles.length !== tiles.length) {
    hasChanged = true;
  }

  if (!hasChanged) return state;

  const newTile = spawnRandomTile(nextTiles, size);
  if (newTile) nextTiles.push(newTile);

  const newScore = score + totalScoreGained;
  const newBest = Math.max(bestScore, newScore);
  const won = nextTiles.some(t => t.value === 2048);
  const over = isGameOver(nextTiles, size);

  if(newBest > bestScore) {
    saveBestScore(newBest);
  }

  return {
    ...state,
    tiles: nextTiles,
    score: newScore,
    bestScore: newBest,
    won,
    over,
  };
}

export function isGameOver(tiles: Tile[], size = BOARD_SIZE): boolean {
  if (tiles.length < size * size) return false;

  const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  tiles.forEach(t => { grid[t.row][t.col] = t.value; });

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = grid[r][c];
      if (r + 1 < size && grid[r + 1][c] === val) return false;
      if (c + 1 < size && grid[r][c + 1] === val) return false;
    }
  }
  return true;
}