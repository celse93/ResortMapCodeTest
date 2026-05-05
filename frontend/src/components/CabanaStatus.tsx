interface CabanaStatusProps {
  onClose: () => void;
}

export function CabanaStatus({ onClose }: CabanaStatusProps) {
  return (
    <div>
      <h2>Cabana Unavailable</h2>
      <p>This cabana is already booked.</p>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
