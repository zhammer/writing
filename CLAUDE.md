# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A SvelteKit-based personal writing website that displays creative writing pieces in various formats (scripts, prose, poetry, book playlists). Content is stored as YAML and TXT files in the `pieces/` directory and rendered through dynamic routing.

## Development Commands

- `yarn dev` - Start development server (Vite)
- `yarn build` - Build for production
- `yarn validate` - Run svelte-check for type checking
- `yarn new "Title"` - Create a new piece from template (see scripts/newPiece.js)
- `yarn netlify` - Run Netlify dev server locally

## Architecture

### Content Management System

The core architecture treats writing pieces as files in a hierarchical directory structure:

- **pieces/** - Root content directory containing all writing pieces
  - Individual pieces: `.yml` or `.txt` files
  - Directories: Organize pieces into collections (e.g., `fragments/`, `haiku/`, `bookplaylists/`)
  - `__meta__.yml` - Optional metadata file in directories (provides description, title)

### Piece Types

Defined in `src/routes/_pieces.ts`:

1. **WritingPiece** (default) - Structured writing with scenes and sections
   - Scenes contain sections with types: Action, Character, Dialogue, SceneHeading, Text, TextCenter, Title, Subtitle, Parenthetical, Image
   - `.yml` format: Explicitly defines scenes array with typed sections
   - `.txt` format: Contains frontmatter in ` ```piece ``` ` block, rest is plain text rendered as single scene

2. **BookPlaylist** - Links books with Spotify playlists
   - Requires: `pieceType: BookPlaylist`, `isbn`, `playlist` URL, book metadata
   - Rendered via `src/plugins/BookPlaylist.svelte`

### Tokenization System

`src/tokenizer.ts` parses text content to support:
- Inline functions: `{{functionName "arg1" "arg2"}}` syntax
- Italic text: `*text*` becomes `<i>text</i>`
- Function tokens track occurrence count for footnote-style references

### Routing

SvelteKit dynamic routing via `src/routes/[...slug]/`:
- Catches all paths and maps to pieces directory structure
- `loadDirectory()` in `_pieces.ts` builds tree from filesystem
- `find(directory, slug[])` traverses tree to locate piece or directory
- Directory views show list of children; pieces render based on type

### Key Components

- `src/components/WritingPiece.svelte` - Renders WritingPiece type
- `src/components/Scene.svelte` - Renders individual scenes
- `src/components/Directory.svelte` - Shows directory listings
- `src/components/SongPlayer/` - Audio player for pieces with song metadata
- `src/plugins/BookPlaylist.svelte` - Custom renderer for BookPlaylist type

### Build & Deployment

- Adapter: `@sveltejs/adapter-netlify`
- Node version: 16.16.0 (Volta)
- Static site generation via Vite
