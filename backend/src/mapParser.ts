import { readFileSync } from 'fs';

export type CellType = 'empty' | 'cabana' | 'pool' | 'path' | 'chalet';

export interface Cell {
  type: CellType;
  id?: string;
}

export interface MapGrid {
  rows: number;
  cols: number;
  grid: Cell[][];
}

const CHAR_MAP: Record<string, CellType> = {
  '.': 'empty',
  W: 'cabana',
  p: 'pool',
  '#': 'path',
  c: 'chalet',
};

export function parseMap(filePath: string): MapGrid {
  // converts map.ascii to string
  const content = readFileSync(filePath, 'utf-8');
  // converts string to array of rows
  const lines = content.split('\n').filter((line) => line.length > 0);
  // builds 2D grid + converts each char to Cell
  const grid: Cell[][] = lines.map((line, row) =>
    line.split('').map((char, col) => {
      const type = CHAR_MAP[char] ?? 'empty';
      const cell: Cell = { type };
      if (type === 'cabana') {
        cell.id = `W_${row}_${col}`;
      }
      return cell;
    }),
  );

  return {
    rows: grid.length,
    cols: grid[0]?.length ?? 0,
    grid,
  };
}
