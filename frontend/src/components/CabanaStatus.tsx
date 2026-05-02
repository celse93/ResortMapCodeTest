import type { CabanaBooking } from '../types/map';

interface CabanaStatusProps {
  booking: CabanaBooking;
  onClose: () => void;
}

export function CabanaStatus({ booking, onClose }: CabanaStatusProps) {
  return (
    <div>
      <h2>Cabana Unavailable</h2>
      <p>This cabana is already booked.</p>
      <p>Room: {booking.room}</p>
      <p>Guest: {booking.guestName}</p>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
