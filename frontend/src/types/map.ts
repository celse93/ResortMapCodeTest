export type CellType = 'empty' | 'cabana' | 'pool' | 'path' | 'chalet';

export interface Cell {
  type: CellType;
  id?: string;
}

export interface MapData {
  rows: number;
  cols: number;
  grid: Cell[][];
}
