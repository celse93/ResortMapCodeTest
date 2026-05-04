import '../App.css';
import type { Cell, CabanaBooking } from '../types/map';

const STATIC_TILES: Record<string, string> = {
  empty: '/assets/parchmentBasic.png',
  cabana: '/assets/cabana.png',
  pool: '/assets/pool.png',
  chalet: '/assets/houseChimney.png',
};

// Selects the correct path asset and CSS clockwise rotation for a '#' tile by examining
// its four cardinal neighbours. A neighbour counts as "connected" when it is path, chalet,
// or cabana; anything else (.  p  or out-of-bounds) counts as empty.
//
// Base image orientations (0 °):
//   arrowStraight    – vertical (top ↔ bottom)
//   arrowCornerSquare – L-corner connecting top + right (N+E bend at bottom-left of tile)
//   arrowSplit       – ├  (top + bottom + right connected; left is the open/empty side)
//   arrowEnd         – tip pointing up, connection at bottom
//   arrowCrossing    – symmetric ✛, no rotation needed
//
// Rotation rules (degrees CW):
//   arrowStraight:     0° vertical | 90° horizontal
//   arrowCornerSquare: N+E→0°  E+S→90°  S+W→180°  W+N→270°
//   arrowSplit:        missing-left→0°  missing-top→90°  missing-right→180°  missing-bottom→270°
//   arrowEnd:          bottom-conn→0°  left-conn→90°  top-conn→180°  right-conn→270°
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

  // 1 connected + 3 empty → dead-end; rotate so the connected side aligns with base (bottom)
  if (n === 1) {
    const rotation = downC ? 0 : leftC ? 90 : topC ? 180 : 270;
    return { src: '/assets/arrowEnd.png', rotation };
  }

  return { src: '/assets/arrowStraight.png', rotation: 0 };
}

interface MapGridProps {
  grid: Cell[][];
  bookedCabanas: Map<string, CabanaBooking>;
  onCabanaClick: (cell: Cell) => void;
}

export function MapGrid({ grid, bookedCabanas, onCabanaClick }: MapGridProps) {
  const cols = grid[0]?.length ?? 0;

  return (
    <div
      className="map-grid"
      style={{ '--cols': cols } as React.CSSProperties}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isCabana = cell.type === 'cabana';
          const isBooked = isCabana && cell.id !== undefined && bookedCabanas.has(cell.id);

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
    </div>
  );
}
