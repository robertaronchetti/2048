export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Tile {
  id: string;
  value: number;
  row: number; // 0 to size-1
  col: number; // 0 to size-1
  isMerged?: boolean;
  isNew?: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
  size: number;
}