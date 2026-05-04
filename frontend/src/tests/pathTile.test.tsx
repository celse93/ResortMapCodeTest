import { render, screen } from '@testing-library/react';
import { MapGrid } from '../components/MapGrid';
import type { Cell } from '../types/map';

// Builds a 3×3 grid with a path tile at (1,1).
// Cardinal neighbours of center: top=(0,1), right=(1,2), bottom=(2,1), left=(1,0).
function makePathGrid(top: string, right: string, bottom: string, left: string): Cell[][] {
  const e = (): Cell => ({ type: 'empty' });
  const p = (): Cell => ({ type: 'path' });
  const n = (t: string): Cell => ({ type: t as Cell['type'] });
  return [
    [e(), n(top), e()],
    [n(left), p(), n(right)],
    [e(), n(bottom), e()],
  ];
}

// In a 3×3 grid rendered row-major, the center tile is at flat index 4.
function centerImg() {
  return screen.getAllByRole('img')[4];
}

const noBookings = new Map();
const noop = vi.fn();

describe('Path tile: 4 connected → crossing', () => {
  it('renders arrowCrossing with no rotation', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'path', 'path', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowCrossing.png');
    expect(centerImg().style.transform).toBe('');
  });
});

describe('Path tile: 3 connected → T-split', () => {
  it('missing top → arrowSplit rotated 90°', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'path', 'path', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowSplit.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('90deg');
  });

  it('missing right → arrowSplit rotated 180°', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'empty', 'path', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowSplit.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('180deg');
  });

  it('missing bottom → arrowSplit rotated 270°', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'path', 'empty', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowSplit.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('270deg');
  });

  it('missing left → arrowSplit at 0° (base orientation)', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'path', 'path', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowSplit.png');
    expect(centerImg().style.transform).toBe('');
  });
});

describe('Path tile: 2 connected opposite → straight', () => {
  it('top + bottom → arrowStraight vertical (0°)', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'empty', 'path', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowStraight.png');
    expect(centerImg().style.transform).toBe('');
  });

  it('left + right → arrowStraight horizontal (90°)', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'path', 'empty', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowStraight.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('90deg');
  });
});

describe('Path tile: 2 connected adjacent → corner', () => {
  it('N+E → arrowCornerSquare at 0°', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'path', 'empty', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowCornerSquare.png');
    expect(centerImg().style.transform).toBe('');
  });

  it('E+S → arrowCornerSquare rotated 90°', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'path', 'path', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowCornerSquare.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('90deg');
  });

  it('S+W → arrowCornerSquare rotated 180°', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'empty', 'path', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowCornerSquare.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('180deg');
  });

  it('W+N → arrowCornerSquare rotated 270°', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'empty', 'empty', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowCornerSquare.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('270deg');
  });
});

describe('Path tile: 1 connected → dead end', () => {
  it('bottom connected → arrowEnd at 0°', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'empty', 'path', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowEnd.png');
    expect(centerImg().style.transform).toBe('');
  });

  it('left connected → arrowEnd rotated 90°', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'empty', 'empty', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowEnd.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('90deg');
  });

  it('top connected → arrowEnd rotated 180°', () => {
    render(
      <MapGrid grid={makePathGrid('path', 'empty', 'empty', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowEnd.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('180deg');
  });

  it('right connected → arrowEnd rotated 270°', () => {
    render(
      <MapGrid grid={makePathGrid('empty', 'path', 'empty', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowEnd.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('270deg');
  });
});

describe('Path tile: connectivity with non-path connected types', () => {
  it('treats chalet as a connected neighbour', () => {
    // chalet above + path below → straight vertical
    render(
      <MapGrid grid={makePathGrid('chalet', 'empty', 'path', 'empty')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowStraight.png');
    expect(centerImg().style.transform).toBe('');
  });

  it('treats cabana as a connected neighbour', () => {
    // cabana to the right + path to the left → straight horizontal
    render(
      <MapGrid grid={makePathGrid('empty', 'cabana', 'empty', 'path')} bookedCabanas={noBookings} onCabanaClick={noop} />,
    );
    expect(centerImg()).toHaveAttribute('src', '/assets/arrowStraight.png');
    expect(centerImg().style.getPropertyValue('--rotation')).toBe('90deg');
  });
});
