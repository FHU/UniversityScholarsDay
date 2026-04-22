type Props = {
  rooms: string[];
  selected: Set<string>;
  onToggle: (room: string) => void;
  onClear: () => void;
};

export function RoomFilter({ rooms, selected, onToggle, onClear }: Props) {
  const count = selected.size;
  const label =
    count === 0
      ? "Filter by room(s)"
      : count === 1
      ? `Filtering: 1 room`
      : `Filtering: ${count} rooms`;

  return (
    <div className="room-filter">
      <details >
        <summary>{label}</summary>
        <div className="room-filter-chips">
          {rooms.map((room) => {
            const active = selected.has(room);
            return (
              <button
                type="button"
                key={room}
                className="chip"
                aria-pressed={active}
                onClick={() => onToggle(room)}
              >
                {room}
              </button>
            );
          })}
          {count > 0 && (
            <button type="button" className="chip-clear" onClick={onClear}>
              Clear filters
            </button>
          )}
        </div>
      </details>
    </div>
  );
}
