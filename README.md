# EventCulture AI: interactive demo

A presentation-style demo of the EventCulture AI platform. Everything is dummy data and runs in the browser.
There is no backend, no real payment and nothing is uploaded anywhere.

## Open it
- Double-click `index.html`, or
- run `python3 -m http.server 5173` in this folder and open http://localhost:5173

## Host it on GitHub Pages
1. Push this folder to a GitHub repository.
2. Settings, then Pages, then deploy from the `main` branch, root folder.
3. Share the Pages link with the client.

## Walkthrough
Use the "Walkthrough" button (bottom right) in the demo. In short:
1. Create a design: pick a sample venue or upload your own photo.
2. Generate four designs. A free first preview is included.
3. The vendor list appears greyed out behind a paywall.
4. Subscribe (test mode) to get a subscription key. `EC-DEMO-2026` also always works.
5. Request quotes, negotiate (up to three rounds), book and pay.
6. Mark the job complete, then switch to Vendor and Admin (top bar) to see the other sides.

## Editing
Source lives in `src/`. After editing, run `./build.sh` to rebuild the single-file `index.html`.
