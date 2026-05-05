import { useState } from 'react';
import type { Cell } from '../types/map';

interface BookingFormProps {
  cell: Cell;
  onSuccess: (cabanaId: string) => void;
  onCancel: () => void;
}

export function BookingForm({ cell, onSuccess, onCancel }: BookingFormProps) {
  const [room, setRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cabanaId: cell.id, room, guestName }),
      });

      if (res.ok) {
        onSuccess(cell.id!);
      } else {
        const data = await res.json();
        setError(data.error ?? 'Booking failed');
      }
    } catch {
      setError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book Cabana</h2>
      <label>
        Room number
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
      </label>
      <label>
        Guest name
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Booking…' : 'Confirm'}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
