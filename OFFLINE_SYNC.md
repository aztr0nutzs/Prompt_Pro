# Offline Sync

## Goals
- Allow full prompt browsing and editing with no network.
- Enable safe sync when connectivity is available.
- Preserve local edits and reconcile conflicts cleanly.

## Data Model
- **Local Source of Truth**: `prompts/` and browser `localStorage` overrides.
- **Sync Metadata**: per-prompt version, checksum, and last-modified timestamps.

## Sync Algorithm (High-Level)
1) **Scan Local**: compute checksums for prompt files and overrides.
2) **Fetch Remote Index**: compare versions and hashes.
3) **Classify**: unchanged, local-only, remote-only, conflict.
4) **Resolve**:
   - Unchanged: no-op.
   - Local-only: upload if allowed.
   - Remote-only: download.
   - Conflict: prompt user or apply merge rules.

## Conflict Resolution
- Default: prefer local edits, but store remote as a sidecar file.
- Optional: three-way merge if base revision exists.

## Offline UX
- Show last sync time and pending changes.
- Provide explicit “Sync Now” control when online.
- Offer export of prompt packs as zip/JSON for manual transfer.
