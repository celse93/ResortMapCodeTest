import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import type { MapData } from '../types/map';

const singleCabanaMap: MapData = {
  rows: 1,
  cols: 1,
  grid: [[{ type: 'cabana', id: 'W-0-0' }]],
};

function stubFetch(mapData: MapData, bookingOk = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (url === '/api/map') {
        return Promise.resolve({ json: () => Promise.resolve(mapData) });
      }
      if (bookingOk) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Guest not found' }),
      });
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('App loading and error states', () => {
  it('shows loading message while map is fetching', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    render(<App />);
    expect(screen.getByText('Loading map…')).toBeInTheDocument();
  });

  it('shows error alert when map fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network'))));
    render(<App />);
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load resort map'),
    );
  });

  it('renders title and grid tiles after successful fetch', async () => {
    stubFetch(singleCabanaMap);
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText('Resort Cabana Map')).toBeInTheDocument(),
    );
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
});

describe('App overlay: open and close', () => {
  beforeEach(() => stubFetch(singleCabanaMap));

  it('opens booking form when an available cabana is clicked', async () => {
    render(<App />);
    await waitFor(() => screen.getByAltText('cabana'));
    fireEvent.click(screen.getByAltText('cabana'));
    expect(screen.getByText('Book Cabana')).toBeInTheDocument();
  });

  it('closes overlay when the backdrop is clicked', async () => {
    render(<App />);
    await waitFor(() => screen.getByAltText('cabana'));
    fireEvent.click(screen.getByAltText('cabana'));
    fireEvent.click(document.querySelector('.overlay')!);
    expect(screen.queryByText('Book Cabana')).not.toBeInTheDocument();
  });

  it('does not close overlay when the panel itself is clicked', async () => {
    render(<App />);
    await waitFor(() => screen.getByAltText('cabana'));
    fireEvent.click(screen.getByAltText('cabana'));
    fireEvent.click(document.querySelector('.panel')!);
    expect(screen.getByText('Book Cabana')).toBeInTheDocument();
  });
});

describe('App booking flow', () => {
  beforeEach(() => stubFetch(singleCabanaMap));

  it('closes panel and turns cabana red after successful booking', async () => {
    render(<App />);
    await waitFor(() => screen.getByAltText('cabana'));
    fireEvent.click(screen.getByAltText('cabana'));
    fireEvent.change(screen.getByLabelText(/room number/i), { target: { value: '101' } });
    fireEvent.change(
      screen.getByLabelText(/guest name/i),
      { target: { value: 'Alice Smith' } },
    );
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() =>
      expect(screen.queryByText('Book Cabana')).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId('booked-overlay')).toBeInTheDocument();
  });

  it('shows CabanaStatus with booking details on booked cabana click', async () => {
    render(<App />);
    await waitFor(() => screen.getByAltText('cabana'));

    fireEvent.click(screen.getByAltText('cabana'));
    fireEvent.change(screen.getByLabelText(/room number/i), { target: { value: '101' } });
    fireEvent.change(
      screen.getByLabelText(/guest name/i),
      { target: { value: 'Alice Smith' } },
    );
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() =>
      expect(screen.queryByText('Book Cabana')).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByAltText('cabana'));
    expect(screen.getByText('Cabana Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Room: 101')).toBeInTheDocument();
    expect(screen.getByText('Guest: Alice Smith')).toBeInTheDocument();
  });
});
