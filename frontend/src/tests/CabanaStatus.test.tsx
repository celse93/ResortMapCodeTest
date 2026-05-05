import { render, screen, fireEvent } from '@testing-library/react';
import { CabanaStatus } from '../components/CabanaStatus';

describe('CabanaStatus display', () => {
  it('shows the unavailable heading', () => {
    render(<CabanaStatus onClose={vi.fn()} />);
    expect(screen.getByText('Cabana Unavailable')).toBeInTheDocument();
  });

  it('shows the unavailability message', () => {
    render(<CabanaStatus onClose={vi.fn()} />);
    expect(screen.getByText('This cabana is already booked.')).toBeInTheDocument();
  });
});

describe('CabanaStatus close', () => {
  it('calls onClose when the Close button is clicked', () => {
    const onClose = vi.fn();
    render(<CabanaStatus onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
