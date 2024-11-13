import fs from "fs";
import * as mm from "music-metadata";
import { UtfString } from "utfstring";
import {
  validateM3UfilePaths,
  parseID3V2Array,
  processBrokenM3Upaths,
} from "../utils";
import { M3U_TRACKLIST } from "../config";
import { validateAudioFile } from "../validate-lib";

const m3uPathArg = process.argv[2];

async function buildTracklistLine(trackPath: string) {
  const { common } = await mm.parseFile(trackPath);

  const artists = new UtfString(
    parseID3V2Array(common.artists || []).join(", ")
  );
  const title = new UtfString(common.title);
  const year = isNaN(parseInt(common.originaldate || ""))
    ? common.originaldate
    : common.year || 0;

  const leftToRightMark = "\u200E";

  return `${artists} — ${title} (${leftToRightMark}${year})`;
}

async function m3uToTracklist(
  trackPaths: string[],
  buildLine: (path: string) => Promise<string>,
  writeToPath: string
) {
  const tracklistAsText: string[] = [];

  for (const trackPath of trackPaths) {
    tracklistAsText.push(await buildLine(trackPath));
  }

  const lines = tracklistAsText.join("\n");
  await fs.promises.appendFile(writeToPath, lines);
}

async function buildArtistsList(trackPaths: string[], writeTo: string) {
  const names = new Set<string>();

  for (const tPath of trackPaths) {
    const {
      common: { artists = [] },
    } = await mm.parseFile(tPath);

    const list = parseID3V2Array(artists);
    list.forEach((artist) => names.add(artist));
  }

  fs.promises.writeFile(writeTo, `${[...names].join(" - ")}\n\n`);
}

async function init() {
  const paths = await validateM3UfilePaths(m3uPathArg);

  await processBrokenM3Upaths(paths.broken);

  for (const path of paths.ok) await validateAudioFile(path);

  await buildArtistsList(paths.ok, M3U_TRACKLIST);
  await m3uToTracklist(paths.ok, buildTracklistLine, M3U_TRACKLIST);
}

init().catch(console.error);
