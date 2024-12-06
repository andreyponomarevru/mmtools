A bunch of tools for audio files / music lib management, streamlining the creation of podcasts (generating covers, tracklists, reporting on inconsistencies in music library, etc.)

**Stack:**

- Node.js (TypeScript)
- Bash
- A bunch of command-line tools:
  - ImageMagick (`sudo apt install imagemagick`)
  - Inkscape (`sudo apt install inkscape`)
  - `operon` music tagger from Quod Libet music player package (`sudo apt install quodlibet`)

# Features

The app consists of the three main tools:

- **Cover Builder Pipeline**
  - Extracts covers from every track in M3U playlist, resizes them to the same size and saves to disk
  - Creates new covers composed of different SVG/PNG/JPG files.
- **Lib Integrity Reporter**
  - Logs all inconsistencies in the lib, creating reports on different aspects of library e.g. cover sizes, file types, bitrates, validates genres to match the list of allowed onces.
- **Playlist Creator**
  - Given an m3u playlist returns the raw text version of the playlist (built from ID3V2 tags)

# Testing

To create more tracks used as test data use `ffmpeg`: take any existing tracks and cut 1 second of that track using the command below. This gives you audio files containing all ID3 tags required for testing while keeping their size small, so they can be added to version control.

```
ffmpeg \
  -ss 60 \
  -to 61 \
  -i 06\ \
  -\ Miguel\ Migs\ -\ So\ Far\ \(Rasmus\ Faber’s\ Farplane\ radio\ edit\)\ \[16-44\].flac \
  file.flac`
```

- `-ss` — cut from (seconds)
- `-to` — cut to (seconds)

# Development notes

## `music-metadata` issues and bugs

**DO NOT UPDATE `music-metadata` PACKAGE.** The author of `music-metadata` introduced some breaking changes concerned with ES/CommonJS modules format that lead to `jest` being unable to run integration tests with `music-metadata` heigher than `7.14.0`. I've spent several days trying to fix the issue and had no luck, so stick to the old version of this package.

Also, this part of `tsconfig.json`:

```json
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs"
    }
  },
```

is _required_ to run `music-metadata`, otherwise it breaks.

The best solution is to move to ESM-first testing framework (Node.js native test runner, Vitest, or node-tap)
