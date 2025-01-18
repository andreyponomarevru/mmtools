import fs from "fs";
import { validateM3UfilePaths } from "../utils";
import { BUILD_DIR, TRACKLIST_OUTPUT_PATH } from "../config/constants";
import { validateID3v2Tags } from "../validate-lib/validate-lib";
import {
  buildArtistsList,
  buildTracklistLine,
  m3uToTracklist,
} from "./m3u-to-tracklist";

export async function init(m3uFilePath: string, shouldThrow = false) {
  const paths = await validateM3UfilePaths(m3uFilePath);

  for (const path of paths) await validateID3v2Tags(path, shouldThrow);

  const artists = await buildArtistsList(paths);
  const rmNestedDirs = { recursive: true };
  await fs.promises.mkdir(BUILD_DIR, rmNestedDirs);
  await fs.promises.writeFile(
    TRACKLIST_OUTPUT_PATH,
    `${[...artists].join(" - ")}\n\n`
  );

  const tracklist = await m3uToTracklist(paths, buildTracklistLine);
  await fs.promises.appendFile(TRACKLIST_OUTPUT_PATH, tracklist);
}
