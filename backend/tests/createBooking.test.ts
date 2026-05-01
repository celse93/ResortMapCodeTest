import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import path from 'path';
import { createBookingRouter } from '../src/routes/createBooking.js';
import { loadGuests } from '../src/validation.js';

const BOOKINGS_PATH = path.resolve(__dirname, '../../bookings.json');

describe('POST /api/bookings', () => {
  const app = express();
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;

  const cabanaBookings = new Map<string, { room: string; guestName: string }>();

  beforeAll(() => {
    const guests = loadGuests(BOOKINGS_PATH);
    app.use(express.json());
    app.use('/api', createBookingRouter(guests, cabanaBookings));
    server = app.listen(0);
    const addr = server.address() as { port: number };
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(() => {
    server.close();
  });

  it('returns 201 for a valid guest booking a free cabana', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cabanaId: 'W-1', room: '101', guestName: 'Alice Smith' }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ success: true });
  });

  it('returns 409 when the same cabana is booked again', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cabanaId: 'W-1', room: '102', guestName: 'Bob Jones' }),
    });
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body).toEqual({ error: 'Cabana already booked' });
  });

  it('returns 400 for an unknown guest', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cabanaId: 'W-2', room: '101', guestName: 'Wrong Name' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: 'Invalid guest' });
  });

  it('returns 400 when room does not match the guest name', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cabanaId: 'W-2', room: '102', guestName: 'Alice Smith' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: 'Invalid guest' });
  });

  it('allows different cabanas to be booked by different valid guests', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cabanaId: 'W-3', room: '103', guestName: 'Carol White' }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ success: true });
  });
});
