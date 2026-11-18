# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Use a clear color break between the page title and the body on interior pages. Show the shared boiler control board repair photo on both the homepage and the repair service page.

Keep the React administrator login available by direct URL only. Keep it out of public navigation and the sitemap.
Show the custom React administrator page link in desktop and mobile navigation only after the server confirms a signed-in administrator. Send successful sign-ins to that page.
Keep the sign-out action inside the administrator page. Do not show or edit stock quantities in the catalog manager. Let administrators enlarge category and product thumbnails from the lists.

Render the public catalog and sitemap from the Django API. Keep category and product slugs stable across edits.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
