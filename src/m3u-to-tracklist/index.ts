import fs from "fs";
import * as mm from "music-metadata";
import { UtfString } from "utfstring";
import {
  validateM3UfilePaths,
  parseID3V2Array,
  processBrokenM3Upaths,
} from "../utils";
import { M3U_TRACKLIST } from "../config";

const m3uPathArg = process.argv[2];

async function buildTracklistLine(trackPath: string) {
  const trackMeta = await mm.parseFile(trackPath);

  const artists = new UtfString(
    parseID3V2Array(trackMeta.common.artists || []).join(", ")
  );
  const title = new UtfString(trackMeta.common.title);
  const year = isNaN(parseInt(trackMeta.common.originaldate || ""))
    ? trackMeta.common.year
    : trackMeta.common.originaldate;

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
    const trackMeta = await mm.parseFile(tPath);

    const artists = parseID3V2Array(trackMeta.common.artists || []);
    artists.forEach((a) => names.add(a));
  }

  fs.promises.writeFile(writeTo, `${[...names].join(" - ")}\n\n`);
}

validateM3UfilePaths(m3uPathArg)
  .then(processBrokenM3Upaths)
  .then(async (trackPaths) => {
    await buildArtistsList(trackPaths, M3U_TRACKLIST);
    await m3uToTracklist(trackPaths, buildTracklistLine, M3U_TRACKLIST);
  });
