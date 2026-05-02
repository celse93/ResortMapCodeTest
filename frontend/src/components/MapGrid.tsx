import type { Cell, CabanaBooking } from '../types/map';

const TILE_SIZE = 48;

const TILE_IMAGES: Record<string, string> = {
  empty: '/assets/parchmentBasic.png',
  cabana: '/assets/cabana.png',
  pool: '/assets/pool.png',
  path: '/assets/arrowStraight.png',
  chalet: '/assets/houseChimney.png',
};

interface MapGridProps {
  grid: Cell[][];
  bookedCabanas: Map<string, CabanaBooking>;
  onCabanaClick: (cell: Cell) => void;
}

export function MapGrid({ grid, bookedCabanas, onCabanaClick }: MapGridProps) {
  const cols = grid[0]?.length ?? 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${TILE_SIZE}px)`,
        width: 'fit-content',
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isCabana = cell.type === 'cabana';
          const isBooked = isCabana && cell.id !== undefined && bookedCabanas.has(cell.id);

          return (
            <img
              key={`${rowIndex}-${colIndex}`}
              src={TILE_IMAGES[cell.type]}
              width={TILE_SIZE}
              height={TILE_SIZE}
              alt={cell.type}
              style={{
                display: 'block',
                cursor: isCabana ? 'pointer' : 'default',
                opacity: isBooked ? 0.5 : 1,
              }}
              onClick={isCabana ? () => onCabanaClick(cell) : undefined}
            />
          );
        })
      )}
    </div>
  );
}
