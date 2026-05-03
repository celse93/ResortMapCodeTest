#!/bin/bash
# Usage: ./run.sh [--map <path>] [--bookings <path>]
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

cleanup() { kill 0; }
trap cleanup SIGINT SIGTERM

# Resolve --map and --bookings to absolute paths (relative to CWD at call time,
# i.e. the project root) so the backend — which runs from backend/ — finds them.
MAP="$DIR/map.ascii"
BOOKINGS="$DIR/bookings.json"
args=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --map)      MAP="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; shift 2 ;;
    --bookings) BOOKINGS="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; shift 2 ;;
    *)          args+=("$1"); shift ;;
  esac
done

npm run start --workspace=backend -- "${args[@]}" --map "$MAP" --bookings "$BOOKINGS" &
npm run dev --workspace=frontend &
wait
