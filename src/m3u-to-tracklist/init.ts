import fs from "fs";
import { validateM3UfilePaths, processBrokenM3Upaths } from "../utils";
import { BUILD_DIR, M3U_TRACKLIST } from "../config";
import { validateAudioFile } from "../validate-lib/validate-lib";
import {
  buildArtistsList,
  buildTracklistLine,
  m3uToTracklist,
} from "./m3u-to-tracklist";

export async function init(m3uFilePath: string) {
  const paths = await validateM3UfilePaths(m3uFilePath);

  await processBrokenM3Upaths(paths.broken);

  for (const path of paths.ok) await validateAudioFile(path);

  const artists = await buildArtistsList(paths.ok);
  await fs.promises.mkdir(BUILD_DIR[process.env.NODE_ENV], { recursive: true });
  await fs.promises.writeFile(M3U_TRACKLIST, `${[...artists].join(" - ")}\n\n`);

  const tracklist = await m3uToTracklist(paths.ok, buildTracklistLine);
  await fs.promises.appendFile(M3U_TRACKLIST, tracklist);
}
