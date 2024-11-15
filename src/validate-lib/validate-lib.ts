import fs from "fs";
import { mmFacade } from "../music-metadata-facade";
import { traverseDirs, parseID3V2Array } from "../utils";
import { SUPPORTED_CODEC, REPORTS_DIR, REPORT_BAD_COVERS } from "../config";
import {
  checkCover,
  checkArtists,
  checkBPM,
  checkBitrate,
  checkGenres,
  checkTitle,
  checkYear,
} from "./validators";

let tracksTotal = 0;

export async function validateAudioFile(filePath: string) {
  const { meta, cover } = await mmFacade.parseFile(filePath);

  await checkCover(filePath, cover);
  await checkBPM(filePath, meta.bpm);
  await checkBitrate(filePath, meta.bitrate);
  await checkGenres(filePath, parseID3V2Array(meta.genre || []));
  await checkTitle(filePath, meta.title);
  await checkArtists(filePath, parseID3V2Array(meta.artists || []));
  await checkYear(filePath, meta.year);

  tracksTotal++;
}

export function onCtrlC() {
  fs.rmSync(REPORTS_DIR, { force: true, recursive: true });
  process.exit();
}

export async function init() {
  fs.rmSync(REPORTS_DIR, { force: true, recursive: true });
  await fs.promises.mkdir(REPORTS_DIR);

  await traverseDirs(
    "/mnt/CE64EB6A64EB53AD/music-lib/tracks",
    validateAudioFile
  );

  await fs.promises.appendFile(
    REPORT_BAD_COVERS,
    `Trackls Total: ${tracksTotal}`
  );

  console.log(
    `\nProcessed all ${tracksTotal} tracks (${SUPPORTED_CODEC.join(", ")})`
  );
}
