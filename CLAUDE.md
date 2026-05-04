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
| `arrowStraight/Corner/Crossing/Split/End.png` | Path direction tiles (see selection rules below) |

### Path tile selection

Each `#` cell picks its asset and a CSS clockwise rotation by inspecting its four cardinal neighbours. A neighbour is **connected** when it is `#`, `W`, or `c`; it is **empty** when it is `.`, `p`, or out-of-bounds.

| Connected count | Extra condition | Asset | Rotation |
|---|---|---|---|
| 4 | — | `arrowCrossing.png` | 0° |
| 3 | 1 empty side | `arrowSplit.png` | empty side → top: 90° · right: 180° · bottom: 270° · left: 0° |
| 2 | top + down (opposite) | `arrowStraight.png` | 0° (vertical) |
| 2 | left + right (opposite) | `arrowStraight.png` | 90° (horizontal) |
| 2 | adjacent pair | `arrowCornerSquare.png` | N+E: 0° · E+S: 90° · S+W: 180° · W+N: 270° |
| 1 | dead end | `arrowEnd.png` | connected side → bottom: 0° · left: 90° · top: 180° · right: 270° |

Base image orientations (0°): `arrowStraight` is vertical; `arrowCornerSquare` connects top+right (bend at tile's bottom-left); `arrowSplit` is ├ (left side open); `arrowEnd` tip points up with connection at bottom.

## Required Deliverables

- Single start command from project root accepting `--map` and `--bookings` args
- `README.md` with run instructions and a short design decisions paragraph
- `AI.md` documenting AI tools, prompts, and steps used
- `screenshot.png` of the running map view
- Automated tests covering: API endpoints, booking validation, map rendering, UI interactions
