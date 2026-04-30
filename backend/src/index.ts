import express from 'express';
import cors from 'cors';
import { parseArgs } from 'util';
import path from 'path';
import { createMapRouter } from './routes/map.js';

const { values } = parseArgs({
  options: {
    map: { type: 'string', default: 'map.ascii' },
    bookings: { type: 'string', default: 'bookings.json' },
  },
});

const mapPath = path.resolve(values.map!);
const bookingsPath = path.resolve(values.bookings!);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', createMapRouter(mapPath));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Map: ${mapPath}`);
  console.log(`Bookings: ${bookingsPath}`);
});
