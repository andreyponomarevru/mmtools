A bunch of tools for music library management, streamlining the creation of podcasts

# Features

The app provides four main features:

- **Library validator: `yarn run validatelib`** Given a path to your music library directory, the app analyzes and creates reports about all found inconsistencies, like invalid ID3v2 tags, invalid genres, too low bitrate, too small cover sizes, etc.

- **Cover builder: `yarn run buildcover`** Given a path to a m3u playlist, a path to a photo and any text string (usually the name of your podcast), the app creates a new cover based on the predefined SVG template (it merges multiple SVG/PNG/JPG files into a single cover).

- **Covers extractor: `yarn run extractcovers`** Given a path to a m3u file, the app extracts and saves to disk the cover of every song in a playlist.

- **Tracklist creator: `yarn run extracttracklist`** Given a path to a m3u playlist, the app returns a text version of the playlist based on a predefined template.

# Stack

- Node.js (TypeScript)
- Bash
- A few command-line tools:
  - ImageMagick (`sudo apt install imagemagick`)
  - Inkscape (`sudo apt install inkscape`)
- `jest` for testing

# Development notes

## Integration tests

If you need more tracks for integration testing, use `ffmpeg`: take any existing tracks and cut 1 second of that track using the command below. This gives you audio files containing all ID3 tags required for testing while keeping their size small, so they can be added to version control.

```shell
ffmpeg \
  -ss 60 \
  -to 61 \
  -i 06\ \
  -\ Miguel\ Migs\ -\ So\ Far\ \(Rasmus\ Faber’s\ Farplane\ radio\ edit\)\ \[16-44\].flac \
  file.flac`
```

- `-ss` — cut from (seconds)
- `-to` — cut to (seconds)

## Do not update `music-metadata` package

The author of `music-metadata` introduced some breaking changes concerned with ES/CommonJS modules interoperability, leading to `jest` being unable to run integration tests with `music-metadata` heigher than `7.14.0`. I've spent several days trying to fix the issue and had no luck, so stick to the old version of this package.

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
