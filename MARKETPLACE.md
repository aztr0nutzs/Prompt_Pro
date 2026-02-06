# Marketplace

## Purpose
The Marketplace enables community sharing and optional monetization of prompt packs while preserving offline access for locally installed content.

## Core Concepts
- **Listings**: Each listing is a prompt pack with metadata (title, description, category coverage, version, license).
- **Bundles**: Curated collections of prompts grouped by domain or workflow.
- **Ratings & Reviews**: Structured feedback (clarity, usefulness, safety).
- **Licensing**: Support for permissive, proprietary, and custom licenses.

## Proposed Flow
1) Creator publishes a prompt pack with metadata and version notes.
2) Marketplace validates structure and policy compliance.
3) Users download packs, which install into `prompts/` and update `app/data/index.json`.
4) Updates are pulled as deltas when online.

## Moderation & Safety
- Automated scans for sensitive content.
- Manual review for high-risk categories.
- Clear provenance and ownership metadata.

## Revenue (Optional)
- Fixed-price or subscription access.
- Revenue split between platform and creator.
- Refund handling for broken or misleading packs.

## Compatibility
- Backwards-compatible prompt format.
- Versioned index entries to prevent breaking local installs.
