import '../App.css';
import type { Cell } from '../types/map';

const STATIC_TILES: Record<string, string> = {
  empty: '/assets/parchmentBasic.png',
  cabana: '/assets/cabana.png',
  pool: '/assets/pool.png',
  chalet: '/assets/houseChimney.png',
};

function getPathTile(
  grid: Cell[][],
  row: number,
  col: number,
): { src: string; rotation: number } {
  const numRows = grid.length;
  const numCols = grid[0]?.length ?? 0;

  const getType = (r: number, c: number): string => {
    if (r < 0 || r >= numRows || c < 0 || c >= numCols) return 'empty';
    return grid[r][c].type;
  };

  const top = getType(row - 1, col);
  const right = getType(row, col + 1);
  const down = getType(row + 1, col);
  const left = getType(row, col - 1);

  const isConnected = (t: string) => t === 'path' || t === 'chalet' || t === 'cabana';
  const topC = isConnected(top);
  const rightC = isConnected(right);
  const downC = isConnected(down);
  const leftC = isConnected(left);
  const n = [topC, rightC, downC, leftC].filter(Boolean).length;

  // 4 connected → crossing
  if (n === 4) {
    return { src: '/assets/arrowCrossing.png', rotation: 0 };
  }

  // 3 connected + 1 empty → T-split; rotate so the empty side aligns with base (left)
  if (n === 3) {
    const rotation = !topC ? 90 : !rightC ? 180 : !downC ? 270 : 0;
    return { src: '/assets/arrowSplit.png', rotation };
  }

  if (n === 2) {
    // Opposite sides → straight path
    if (topC && downC) return { src: '/assets/arrowStraight.png', rotation: 0 };
    if (leftC && rightC) return { src: '/assets/arrowStraight.png', rotation: 90 };

    // Adjacent sides → corner; rotate so the connected pair aligns with base (N+E)
    const rotation =
      topC && rightC ? 0 :
      rightC && downC ? 90 :
      downC && leftC ? 180 : 270;
    return { src: '/assets/arrowCornerSquare.png', rotation };
  }

  // 1 connected + 3 empty → dead-end; rotate so connected side aligns with base (bottom)
  if (n === 1) {
    const rotation = downC ? 0 : leftC ? 90 : topC ? 180 : 270;
    return { src: '/assets/arrowEnd.png', rotation };
  }

  return { src: '/assets/arrowStraight.png', rotation: 0 };
}

const TILE_SIZE = 48;

function getPoolBounds(
  grid: Cell[][],
): { row: number; col: number; width: number; height: number } | null {
  let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
  let found = false;

  grid.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      if (cell.type === 'pool') {
        found = true;
        if (rowIndex < minRow) minRow = rowIndex;
        if (rowIndex > maxRow) maxRow = rowIndex;
        if (colIndex < minCol) minCol = colIndex;
        if (colIndex > maxCol) maxCol = colIndex;
      }
    }),
  );

  if (!found) return null;
  return { row: minRow, col: minCol, width: maxCol - minCol + 1, height: maxRow - minRow + 1 };
}

interface MapGridProps {
  grid: Cell[][];
  bookedCabanas: Set<string>;
  onCabanaClick: (cell: Cell) => void;
}

export function MapGrid({ grid, bookedCabanas, onCabanaClick }: MapGridProps) {
  const cols = grid[0]?.length ?? 0;
  const poolBounds = getPoolBounds(grid);

  return (
    <div
      className="map-grid"
      style={{ '--cols': cols } as React.CSSProperties}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isCabana = cell.type === 'cabana';
          const isBooked =
            isCabana && cell.id !== undefined && bookedCabanas.has(cell.id);

          if (cell.type === 'pool') {
            return <div key={`${rowIndex}-${colIndex}`} className="map-cell" />;
          }

          let src: string;
          let rotation = 0;

          if (cell.type === 'path') {
            ({ src, rotation } = getPathTile(grid, rowIndex, colIndex));
          } else {
            src = STATIC_TILES[cell.type] ?? STATIC_TILES.empty;
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="map-cell"
              onClick={isCabana ? () => onCabanaClick(cell) : undefined}
            >
              <img
                src={src}
                width={48}
                height={48}
                alt={cell.type}
                className={`map-tile${isCabana ? ' map-tile--cabana' : ''}`}
                style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
              />
              {isBooked && (
                <div className="booked-overlay" data-testid="booked-overlay" />
              )}
            </div>
          );
        })
      )}
      {poolBounds && (
        <img
          src="/assets/pool.png"
          alt="pool"
          className="pool-overlay"
          style={{
            '--pool-left': `${poolBounds.col * TILE_SIZE}px`,
            '--pool-top': `${poolBounds.row * TILE_SIZE}px`,
            '--pool-width': `${poolBounds.width * TILE_SIZE}px`,
            '--pool-height': `${poolBounds.height * TILE_SIZE}px`,
          } as React.CSSProperties}
        />
      )}
    </div>
  );
}
