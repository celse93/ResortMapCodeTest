import { useEffect, useState } from 'react';
import { MapGrid } from './components/MapGrid';
import { BookingForm } from './components/BookingForm';
import { CabanaStatus } from './components/CabanaStatus';
import type { Cell, MapData } from './types/map';
import './App.css';

export default function App() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookedCabanas, setBookedCabanas] = useState<Set<string>>(new Set());
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    fetch('/api/map')
      .then((res) => res.json())
      .then((data: MapData) => setMapData(data))
      .catch(() => setLoadError('Failed to load resort map'));
  }, []);

  function handleCabanaClick(cell: Cell) {
    setSelectedCell(cell);
  }

  function handleBookingSuccess(cabanaId: string) {
    setBookedCabanas((prev) => new Set(prev).add(cabanaId));
    setSelectedCell(null);
  }

  function handleClose() {
    setSelectedCell(null);
  }

  if (loadError) {
    return <p role="alert">{loadError}</p>;
  }

  if (!mapData) {
    return <p>Loading map…</p>;
  }

  const isBooked = selectedCell?.id !== undefined && bookedCabanas.has(selectedCell.id);

  return (
    <div className="app">
      <h1>Resort Cabana Map</h1>
      <MapGrid
        grid={mapData.grid}
        bookedCabanas={bookedCabanas}
        onCabanaClick={handleCabanaClick}
      />
      {selectedCell && (
        <div className="overlay" onClick={handleClose}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            {isBooked ? (
              <CabanaStatus onClose={handleClose} />
            ) : (
              <BookingForm
                cell={selectedCell}
                onSuccess={handleBookingSuccess}
                onCancel={handleClose}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
