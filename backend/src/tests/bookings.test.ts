import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import path from 'path';
import { getBookingsRouter } from '../routes/bookings.js';

const BOOKINGS_PATH = path.resolve(__dirname, '../../../bookings.json');

describe('GET /api/bookings', () => {
  const app = express();
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;

  beforeAll(() => {
    app.use('/api', getBookingsRouter(BOOKINGS_PATH));
    server = app.listen(0);
    const addr = server.address() as { port: number };
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(() => {
    server.close();
  });

  it('responds with 200', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`);
    expect(res.status).toBe(200);
  });

  it('returns a JSON array', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it('every entry has room and guestName string fields', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`);
    const body = await res.json() as { room: string; guestName: string }[];
    expect(body.length).toBeGreaterThan(0);
    body.forEach((entry) => {
      expect(typeof entry.room).toBe('string');
      expect(typeof entry.guestName).toBe('string');
    });
  });

  it('contains the expected number of guests', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`);
    const body = await res.json() as unknown[];
    expect(body).toHaveLength(100);
  });
});
