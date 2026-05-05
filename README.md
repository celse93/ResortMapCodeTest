# Resort Cabana Booking App

Interactive web app for browsing a resort map and booking poolside cabanas in real time.

---

## Requirements

- Node.js 18+
- npm 9+

Install all dependencies from the project root before the first run:

```bash
npm install --workspaces
```

---

## Running the App

A single script starts both backend and frontend together:

```bash
./run.sh
```

Then open **http://localhost:5173** in your browser.

By default the backend reads `map.ascii` and `bookings.json` from the project root. To point it at alternative files pass `--map` and/or `--bookings` with an absolute or relative path:

```bash
./run.sh --map /path/to/custom-map.ascii --bookings /path/to/custom-bookings.json
```

Paths are resolved relative to the directory you call the script from, so relative paths work as expected:

```bash
./run.sh --map ./data/other-map.ascii --bookings ./data/other-bookings.json
```

Press `Ctrl+C` to stop both processes.

---

## How to Use

1. The map loads automatically showing all cabanas, pool areas, paths and chalets.
2. Click any **available cabana** to open the booking form.
3. Enter the **room number** and **guest name** — both must match a record in the bookings file.
4. Click **Confirm**. On success the cabana turns red on the map and the panel closes.
5. Clicking a **booked cabana** shows an unavailability notice instead of the form.

---

## Running the Tests

Run backend and frontend tests independently:

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

Or run both from the project root:

```bash
npm test --workspaces
```

---

## Design Decisions

The backend keeps a dedicated `routes/` directory so each API lives in its own file. This keeps `index.ts` thin and makes it straightforward to add or change routes without touching unrelated code.

On the frontend, React components live in their own `components/` directory so they stay reusable and the top-level `App.tsx` stays readable. Shared TypeScript types are in a `types/` directory to avoid circular dependencies and make refactoring isolated, if a type needs to be changed/added. Both backend and frontend tests are split across multiple files by feature or category, which makes failures easier to trace and reviews easier to follow.

A single ESLint config at the project root covers both stacks with a 90-character line limit enforced across all TypeScript and TSX files. The limit was chosen to keep lines readable when working with two files side by side.

Overall I tried to keep the codebase as simple as possible with the core focus on solving the problem as instructed. I skipped some tests to keep them narrowed to the essential backend and frontend functionalities as per the instructions: API endpoints, booking validation, map rendering, and UI interactions.

---

## Libraries and Frameworks

### Backend

| Package | Role |
|---|---|
| **Express** | HTTP server and routing |
| **cors** | Cross-origin request headers so the Vite dev server can reach the API |
| **tsx** | Runs TypeScript source directly without a build step |
| **TypeScript** | Static typing |
| **Vitest** | Unit and integration test runner |

### Frontend

| Package | Role |
|---|---|
| **React 19** | UI component model |
| **React DOM** | Browser rendering |
| **Vite** | Dev server and production bundler |
| **TypeScript** | Static typing |
| **Vitest** | Test runner |
| **@testing-library/react** | Component rendering utilities for tests |
| **@testing-library/jest-dom** | Custom DOM matchers (`toBeInTheDocument`, etc.) |
| **jsdom** | Browser-like DOM environment for tests |
| **ESLint + typescript-eslint** | Linting |
