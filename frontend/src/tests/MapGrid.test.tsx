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

describe('MapGrid tile count and assets', () => {
  it('renders one img per cell', () => {
    const grid = makeGrid([['empty', 'cabana', 'pool'], ['chalet', 'path', 'empty']]);
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={noop} />);
    expect(screen.getAllByRole('img')).toHaveLength(6);
  });

  it('uses correct asset for each static tile type', () => {
    const grid = makeGrid([['empty', 'pool', 'chalet', 'cabana']]);
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={noop} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs[0]).toHaveAttribute('src', '/assets/parchmentBasic.png');
    expect(imgs[1]).toHaveAttribute('src', '/assets/pool.png');
    expect(imgs[2]).toHaveAttribute('src', '/assets/houseChimney.png');
    expect(imgs[3]).toHaveAttribute('src', '/assets/cabana.png');
  });
});

describe('MapGrid cabana interactions', () => {
  it('cabana tiles have the cabana class', () => {
    const grid = makeGrid([['cabana']]);
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={noop} />);
    expect(screen.getByAltText('cabana')).toHaveClass('map-tile--cabana');
  });

  it('non-cabana tiles do not have the cabana class', () => {
    const grid = makeGrid([['empty', 'pool', 'chalet']]);
    render(<MapGrid grid={grid} bookedCabanas={noBookings} onCabanaClick={noop} />);
    screen.getAllByRole('img').forEach(img => expect(img).not.toHaveClass('map-tile--cabana'));
  });

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
