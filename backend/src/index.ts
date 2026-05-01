import express from 'express';
import cors from 'cors';
import { parseArgs } from 'util';
import path from 'path';
import { getMapRouter } from './routes/map.js';
import { getBookingsRouter } from './routes/bookings.js';
import { createBookingRouter } from './routes/createBooking.js';
import { loadGuests } from './validation.js';

const { values } = parseArgs({
  options: {
    map: { type: 'string', default: 'map.ascii' },
    bookings: { type: 'string', default: 'bookings.json' },
  },
});

const mapPath = path.resolve(values.map!);
const bookingsPath = path.resolve(values.bookings!);

const guests = loadGuests(bookingsPath);
const cabanaBookings = new Map<string, { room: string; guestName: string }>();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', getMapRouter(mapPath));
app.use('/api', getBookingsRouter(bookingsPath));
app.use('/api', createBookingRouter(guests, cabanaBookings));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Map: ${mapPath}`);
  console.log(`Bookings: ${bookingsPath}`);
});
