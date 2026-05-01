import { Router } from 'express';
import { readFileSync } from 'fs';

export function getBookingsRouter(bookingsPath: string): Router {
  const router = Router();
  const bookings = JSON.parse(readFileSync(bookingsPath, 'utf-8'));

  router.get('/bookings', (_req, res) => {
    res.json(bookings);
  });

  return router;
}
