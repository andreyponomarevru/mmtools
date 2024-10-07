A bunch of tools for audio files / music lib management, streamlining the creation of podcasts (generating covers, tracklists, reporting on inconsistencies in music lib, etc.)

**Stack:** 

* Node.js (TypeScript)
* Bash
* A bunch of command-line tools: 
  * ImageMagick
  * Inkscape
  * `operon` music tagger from Quod Libet package




# Features

The app consists of the three main tools:

* **Cover Builder Pipeline**
  * Extracts covers from every track in M3U playlist, resizes them to the same size and saves to disk
  * Creates new covers composed of different SVG/PNG/JPG files.
* **Lib Integrity Reporter**
  * Logs all inconsistencies in the lib, creating reports on different aspects of library e.g. cover sizes, file types, bitrates, validates genres to match the list of allowed onces.
* **Playlist Creator**
  * Given an m3u playlist returns the raw text version of the playlist (built from ID3V2 tags)
