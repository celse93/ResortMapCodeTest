import { render, screen, fireEvent } from '@testing-library/react';
import { MapGrid } from '../components/MapGrid';
import type { Cell } from '../types/map';

const noBookings = new Map();
const noop = vi.fn();

function makeGrid(types: string[][]): Cell[][] {
  return types.map((row, r) =>
    row.map((t, c) =>
      t === 'cabana'
        ? { type: 'cabana' as const, id: `cabana-${r}-${c}` }
        : { type: t as Cell['type'] },
    ),
  );
}

describe('MapGrid cabana interactions', () => {
  it('calls onCabanaClick with the cell when a cabana is clicked', () => {
    const grid = makeGrid([['cabana']]);
    const handler = vi.fn();
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={handler} />);
    fireEvent.click(screen.getByAltText('cabana'));
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(grid[0][0]);
  });

  it('does not call onCabanaClick when a non-cabana tile is clicked', () => {
    const grid = makeGrid([['empty', 'pool', 'chalet']]);
    const handler = vi.fn();
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={handler} />);
    screen.getAllByRole('img').forEach(img => fireEvent.click(img));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('MapGrid booked cabana appearance', () => {
  it('renders a red overlay on a booked cabana', () => {
    const grid: Cell[][] = [[{ type: 'cabana', id: 'C1' }]];
    const booked = new Map([['C1', { room: '101', guestName: 'Alice' }]]);
    render(<MapGrid grid={grid} bookedCabanas={booked} onCabanaClick={noop} />);
    expect(screen.getByTestId('booked-overlay')).toBeInTheDocument();
  });

  it('renders no overlay on an unbooked cabana', () => {
    const grid: Cell[][] = [[{ type: 'cabana', id: 'C1' }]];
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={noop} />);
    expect(screen.queryByTestId('booked-overlay')).not.toBeInTheDocument();
  });
});
