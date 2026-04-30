#!/bin/bash
# Usage: ./run.sh [--map <path>] [--bookings <path>]
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

cleanup() { kill 0; }
trap cleanup SIGINT SIGTERM

npm run start --workspace=backend -- "$@" &
npm run dev --workspace=frontend &
wait
