# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive cabana booking webapp for a resort. **No implementation exists yet — this is a specification + assets repo.** Languages allowed: **TypeScript** only. This project must be kept simple by avoiding over-engineering.

## Architecture

Two-tier webapp:

**Backend** — RESTful API server
- Reads `map.ascii` and `bookings.json` from paths given via `--map <path>` and `--bookings <path>` CLI args (defaults to those filenames in the working directory)
- Maintains in-memory cabana booking state (no persistence needed)
- Validates bookings by matching room number + guest name against bookings.json

**Frontend** — Interactive web UI
- Renders the resort map as a tile grid using PNGs from `assets/`
- Fetches all data from the backend API (no direct file access)
- Cabana click flow: if available → show booking form (room + name) → validate via API → confirm and update map; if unavailable → show status

## Map Format (`map.ascii`)

19×19 character grid. Legend:
- `W` = cabana (clickable, bookable)
- `p` = pool
- `#` = path
- `c` = chalet
- `.` = empty space

Pool area occupies the bottom-right quadrant (rows 12–16). The `W` tiles form a border around the `p` pool block; count positions from the ASCII file when mapping grid coordinates to tile renders.

## Guest Data (`bookings.json`)

JSON array of `{ "room": "101", "guestName": "Alice Smith" }`. 100 guests across rooms 101–520 (floors 1–5, 20 rooms each). Booking validation requires exact match on both fields.

## Tile Assets (`assets/`)

| File | Usage |
|---|---|
| `parchmentBasic.png` | Base background tile |
| `cabana.png` | Available cabana tile |
| `pool.png` | Pool tile |
| `houseChimney.png` | Chalet tile |
| `textureWater.png` | Water/overlay |
| `arrowStraight/Corner/Crossing/Split/End.png` | Path direction tiles |

## Required Deliverables

- Single start command from project root accepting `--map` and `--bookings` args
- `README.md` with run instructions and a short design decisions paragraph
- `AI.md` documenting AI tools, prompts, and steps used
- `screenshot.png` of the running map view
- Automated tests covering: API endpoints, booking validation, map rendering, UI interactions
