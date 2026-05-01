import { Router } from 'express';
import { isValidGuest } from '../validation.js';

interface Guest {
  room: string;
  guestName: string;
}

interface CabanaBooking {
  room: string;
  guestName: string;
}

export function createBookingRouter(
  guests: Guest[],
  cabanaBookings: Map<string, CabanaBooking>,
): Router {
  const router = Router();

  router.post('/bookings', (req, res) => {
    const { cabanaId, room, guestName } = req.body as {
      cabanaId: string;
      room: string;
      guestName: string;
    };

    if (!isValidGuest(guests, room, guestName)) {
      res.status(400).json({ error: 'Invalid guest' });
      return;
    }

    if (cabanaBookings.has(cabanaId)) {
      res.status(409).json({ error: 'Cabana already booked' });
      return;
    }

    cabanaBookings.set(cabanaId, { room, guestName });
    res.status(201).json({ success: true });
  });

  return router;
}
