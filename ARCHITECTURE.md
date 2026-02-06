# Architecture

## Overview
PROMPT-FORGE is an offline-first prompt library that serves static assets from `app/` and a curated prompt corpus from `prompts/`. The UI loads the prompt index (`app/data/index.json`), renders the library, and pulls prompt Markdown on demand.

## Runtime Components
- **Static UI**: `app/index.html`, `app/css/*`, `app/js/app.js`
- **Prompt Index**: `app/data/index.json`
- **Prompt Files**: `prompts/<CATEGORY>/*.md`

## Data Flow
```
[app/index.html]
        |
        v
[app/js/app.js] --fetch--> [app/data/index.json]
        |
        v
   [Library UI]
        |
        +--fetch on open--> [prompts/<CATEGORY>/<prompt>.md]
```

## UI Views
- **Library**: category-filtered list of prompts with search.
- **Editor**: in-browser editor for viewing/modifying prompt text.
- **Favorites**: placeholder for local favorites.
- **About**: static description.

## Storage & Overrides
Local edits are stored in `localStorage` under the key `pf_override:<path>`. This keeps the app offline-friendly without filesystem writes.

## Failure Modes & Mitigations
- **Missing prompt files**: surface as empty content. Ensure `app/data/index.json` paths remain accurate.
- **Network-only assets**: the RSI theme uses remote fonts/images. For strict offline use, mirror assets locally.
