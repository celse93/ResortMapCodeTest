import { render, screen, fireEvent } from '@testing-library/react';
import { CabanaStatus } from '../components/CabanaStatus';
import type { CabanaBooking } from '../types/map';

const booking: CabanaBooking = { room: '205', guestName: 'Bob Jones' };

describe('CabanaStatus display', () => {
  it('shows the unavailable heading', () => {
    render(<CabanaStatus booking={booking} onClose={vi.fn()} />);
    expect(screen.getByText('Cabana Unavailable')).toBeInTheDocument();
  });

  it('shows the room number', () => {
    render(<CabanaStatus booking={booking} onClose={vi.fn()} />);
    expect(screen.getByText('Room: 205')).toBeInTheDocument();
  });

  it('shows the guest name', () => {
    render(<CabanaStatus booking={booking} onClose={vi.fn()} />);
    expect(screen.getByText('Guest: Bob Jones')).toBeInTheDocument();
  });
});

describe('CabanaStatus close', () => {
  it('calls onClose when the Close button is clicked', () => {
    const onClose = vi.fn();
    render(<CabanaStatus booking={booking} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
