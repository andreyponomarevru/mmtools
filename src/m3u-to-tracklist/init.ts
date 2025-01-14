import fs from "fs";
import { validateM3UfilePaths, processBrokenM3Upaths } from "../utils";
import { BUILD_DIR, TRACKLIST_OUTPUT_PATH } from "../config/constants";
import { validateAudioFile } from "../validate-lib/validate-lib";
import {
  buildArtistsList,
  buildTracklistLine,
  m3uToTracklist,
} from "./m3u-to-tracklist";

export async function init(m3uFilePath: string, shouldThrow = false) {
  const paths = await validateM3UfilePaths(m3uFilePath);

  await processBrokenM3Upaths(paths.broken);

  for (const path of paths.ok) await validateAudioFile(path, shouldThrow);

  const artists = await buildArtistsList(paths.ok);
  const rmNestedDirs = { recursive: true };
  await fs.promises.mkdir(BUILD_DIR[process.env.NODE_ENV], rmNestedDirs);
  await fs.promises.writeFile(
    TRACKLIST_OUTPUT_PATH,
    `${[...artists].join(" - ")}\n\n`
  );

  const tracklist = await m3uToTracklist(paths.ok, buildTracklistLine);
  await fs.promises.appendFile(TRACKLIST_OUTPUT_PATH, tracklist);
}
