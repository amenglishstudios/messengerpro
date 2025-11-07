Place these two files in this folder (same names):

- gif.min.js
- gif.worker.js

Suggested sources (choose one and download the exact files):
- https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.min.js
- https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.worker.js

OR from unpkg:
- https://unpkg.com/gif.js.optimized/dist/gif.min.js
- https://unpkg.com/gif.js.optimized/dist/gif.worker.js

Then make sure your HTML references:
  <script src="./vendor/gif.min.js"></script>

And your JS uses:
  workerScript: './vendor/gif.worker.js'

Tip: If serving from file://, some browsers block workers. Use a local server (e.g., `npx serve` or VS Code Live Server).
