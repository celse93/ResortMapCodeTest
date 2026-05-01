import { readFileSync } from 'fs';

interface Guest {
  room: string;
  guestName: string;
}

export function loadGuests(bookingsPath: string): Guest[] {
  return JSON.parse(readFileSync(bookingsPath, 'utf-8')) as Guest[];
}

export function isValidGuest(
  guests: Guest[],
  room: string,
  guestName: string,
): boolean {
  return guests.some((g) => g.room === room && g.guestName === guestName);
}
