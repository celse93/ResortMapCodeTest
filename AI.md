# AI.md — AI-Assisted Workflow Documentation

## Tools Used

- **Claude Code** (CLI) with model **Claude Sonnet 4.6** (claude-sonnet-4-6)

---

## Key Prompts & Steps

1. `/init`
   Initialised the project and generated `CLAUDE.md` with codebase context and architecture guidelines.

2. *"What is needed in this project before starting the coding of the backend and frontend? The question relates to packages and tools like npm, vite, react, typescript, etc."*
   Identified required tooling: Node.js, npm, Vite, React, TypeScript, Express, and relevant testing libraries (Vitest, Testing Library).

3. *"This project mainly requires endpoints GET map, GET bookings and POST booking?"*
   Confirmed the three API endpoints needed and outlined their responsibilities.

4. *"Build the endpoint GET map"*
   Implemented `GET /api/map` — reads and parses `map.ascii`, returns a typed grid of cells to the frontend.

5. *"Write the tests related to the endpoint GET map and run to check if it passes"*
   Wrote and ran integration tests for `GET /api/map`, verifying grid shape, cell types, and cabana IDs.

6. *"Build the endpoint GET bookings"*
   Implemented `GET /api/bookings` — reads `bookings.json` and returns the guest list.

7. *"Write the tests related to the endpoint GET bookings and run to check if it passes"*
   Wrote and ran tests for `GET /api/bookings`, covering response structure and data integrity.

8. *"Build the endpoint POST booking"*
   Implemented `POST /api/bookings` — validates room + guest name against `bookings.json`, records in-memory booking state, and returns success or error.

9. *"Write the tests related to the endpoint POST booking and run to check if it passes"*
   Wrote and ran tests for `POST /api/bookings`, covering valid bookings, duplicate attempts, and invalid credentials.

10. *"On the frontend what is needed to do?"*
    Scoped frontend work: map tile rendering, cabana click interaction, booking form, and cabana status display.

11. *"The code for map rendering, cabana click interaction and booking form should be done as separate components in different files to keep the codebase cleaner, easier to read, maintain and scale, if needed"*
    Split into separate component files (`MapGrid`, `BookingForm`, `CabanaStatus`) with `App.tsx` as the orchestrator.

12. *"Build the component for the map grid"*
    Created `MapGrid.tsx` — renders the 19×19 tile grid with static asset mapping per cell type.

13. *"Build the booking form component"*
    Created `BookingForm.tsx` — collects room number and guest name, calls `POST /api/bookings`, and reports success or error.

14. *"Build the cabana status component"*
    Created `CabanaStatus.tsx` — displays the current booking details for an already-booked cabana.

15. *"Wire up `App.tsx` based on the created components"*
    Connected state management, API fetch on mount, cabana selection, booking success handler, and overlay rendering in `App.tsx`.

16. *"Write the frontend tests covering core functionality of user interactions"*
    Wrote Vitest + Testing Library tests for map rendering, cabana click, booking form submission, and booked overlay display.

17. *"While running backend & frontend an error occurred due to wrong file path. This script fix to pass absolute paths in line with the requirements in `CLAUDE.md`?"*
    Fixed `run.sh` to resolve `--map` and `--bookings` paths to absolute paths relative to the project root.

18. *"On `MapGrid.tsx` the mapper for the tile images has the key 'path' which is referencing only `arrowStraight.png`. However, the path consists of not only one asset file, but it can reference one out of five asset files depending on the position of the char '#' on `map.ascii`. Implement a function that uses neighbour connectivity logic (covering all 6 scenarios), plus apply CSS rotation for different orientations of the same image. Update `CLAUDE.md` if needed."*
    Implemented `getPathTile()` — inspects the four cardinal neighbours of each `#` cell and returns the correct asset (`arrowCrossing`, `arrowSplit`, `arrowStraight`, `arrowCornerSquare`, `arrowEnd`) plus the CSS clockwise rotation angle. Updated `CLAUDE.md` with the full path-tile selection table.

19. *"For the booking of a cabana make the input of the guest name case-insensitive. Apply a red colour or background to a cabana when it's booked. After completing the above, review if any frontend tests need updating."*
    Made guest-name comparison case-insensitive in the backend validator, added a `booked-overlay` div rendered over booked cabana tiles, and updated frontend tests to assert the overlay's presence.

20. *"The inline styles in all frontend files should be included in the CSS files instead, and only the classes, ids, etc. should be transferred to the elements. For future reference remember about this coding pattern."*
    Moved all `style={{}}` props to `App.css` as utility/modifier classes (`--rotation` CSS custom property via `rotate()`, `--cols` via `grid-template-columns`, etc.), keeping components free of inline styles.
