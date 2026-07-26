# Reporter Generator

Vue 3 app generates after-shift DOCX reports from `example.docx`.

## Run locally

```bash
npm install
npm run dev
```

Open URL printed by Vite. Check types and create production bundle:

```bash
npm run build
```

## Defaults

Edit `config/config.yml`. It controls hospital, doctor, shift day offsets/times, and initial patient cards. `dayOffset: -1` means yesterday; `0` means today. App fetches this file at startup. Missing or invalid YAML falls back to built-in defaults and shows warning.

## Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`. Compose mounts `./config/config.yml` read-only into container, so deployment defaults can change without rebuilding image.

## Document output

The app reads `src/assets/example.docx`, fills placeholders `{0}` through `{6}`, then downloads DOCX. Patient blocks use Russian labels and blank line between patients, matching `example_with_patients.docx`.
