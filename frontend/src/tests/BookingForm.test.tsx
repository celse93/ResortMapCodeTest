import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingForm } from '../components/BookingForm';
import type { Cell } from '../types/map';

const cabanaCell: Cell = { type: 'cabana', id: 'W-0-0' };

afterEach(() => vi.unstubAllGlobals());

describe('BookingForm rendering', () => {
  it('renders room number and guest name inputs', () => {
    render(<BookingForm cell={cabanaCell} onSuccess={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/room number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
  });

  it('renders Confirm and Cancel buttons', () => {
    render(<BookingForm cell={cabanaCell} onSuccess={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});

describe('BookingForm cancel', () => {
  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(<BookingForm cell={cabanaCell} onSuccess={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});

describe('BookingForm successful submission', () => {
  it('calls onSuccess with cabanaId, room, and guest name', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
    ));
    const onSuccess = vi.fn();
    render(<BookingForm cell={cabanaCell} onSuccess={onSuccess} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/room number/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/guest name/i), { target: { value: 'Alice Smith' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(onSuccess).toHaveBeenCalledWith('W-0-0', '101', 'Alice Smith');
  });
});

describe('BookingForm failed submission', () => {
  it('shows the error message returned by the server', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Guest not found' }),
      }),
    ));
    render(<BookingForm cell={cabanaCell} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/room number/i), { target: { value: '999' } });
    fireEvent.change(screen.getByLabelText(/guest name/i), { target: { value: 'Unknown' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Guest not found'),
    );
  });

  it('shows a generic error when the server is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network'))));
    render(<BookingForm cell={cabanaCell} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/room number/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/guest name/i), { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Could not reach the server'),
    );
  });
});

describe('BookingForm loading state', () => {
  it('disables the submit button and shows "Booking…" while the request is in-flight', async () => {
    const onSuccess = vi.fn();
    let settle!: () => void;
    vi.stubGlobal('fetch', vi.fn(() =>
      new Promise(resolve => {
        settle = () => resolve({ ok: true, json: () => Promise.resolve({}) });
      }),
    ));
    render(<BookingForm cell={cabanaCell} onSuccess={onSuccess} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/room number/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/guest name/i), { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /booking/i })).toBeDisabled(),
    );

    settle();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });
});
