# AI.md — AI-Assisted Workflow Documentation

## Tools Used

- **Claude Code** (CLI) with model **Claude Sonnet 4.6** (claude-sonnet-4-6). 
Below is a list of key prompts used to build the solution. Beyond these, there were additional prompts for follow-up questions and bug fixes. The AI workflow relied on short & concise prompts to ensure coding patterns were followed, the architecture remained well structured, bugs prevented, complex code avoided, and above all the final solution to mirror the provided instructions.

---

## Key Prompts & Steps

1. `/init`

2. *"What is needed in this project before starting the coding of the backend and frontend? The question relates to packages and tools like npm, vite, react, typescript, etc."*

3. *"This project mainly requires endpoints GET map, GET bookings and POST booking?"*

4. *"Build the endpoint GET map"*

5. *"Write the tests related to the endpoint GET map and run to check if it passes"*

6. *"Build the endpoint GET bookings"*

7. *"Write the tests related to the endpoint GET bookings and run to check if it passes"*

8. *"Build the endpoint POST booking"*

9. *"Write the tests related to the endpoint POST booking and run to check if it passes"*

10. *"On the frontend what is needed to do?"*

11. *"The code for map rendering, cabana click interaction and booking form should be done as separate components in different files to keep the codebase cleaner, easier to read, maintain and scale, if needed"*

12. *"Build the component for the map grid"*

13. *"Build the booking form component"*

14. *"Build the cabana status component"*

15. *"Wire up `App.tsx` based on the created components"*

16. *"Write the frontend tests covering core functionality of user interactions"*

17. *"While running backend & frontend an error occurred due to wrong file path. This script fix to pass absolute paths in line with the requirements in `CLAUDE.md`?"*

18. *"On `MapGrid.tsx` the mapper for the tile images has the key 'path' which is referencing only `arrowStraight.png`. However, the path consists of not only one asset file, but it can reference one out of five asset files depending on the position of the char '#' on `map.ascii`. Implement a function that uses neighbour connectivity logic (covering all 6 scenarios), plus apply CSS rotation for different orientations of the same image. Update `CLAUDE.md` if needed."*

19. *"For the booking of a cabana make the input of the guest name case-insensitive. Apply a red colour or background to a cabana when it's booked. After completing the above, review if any frontend tests need updating."*

20. *"The inline styles in all frontend files should be included in the CSS files instead, and only the classes, ids, etc. should be transferred to the elements. For future reference remember about this coding pattern."*

21. *"Make the necessary changes on both backend and frontend to display only one `pool.png` across the whole section of `map.ascii` where the letter 'p' is present, instead of showing multiple `pool.png` per char 'p' in the `map.ascii`."*

22. *"Regarding the last prompt update `CLAUDE.md` if needed so the same approach for the pool tile may be applied to other `map.ascii` configurations."*
