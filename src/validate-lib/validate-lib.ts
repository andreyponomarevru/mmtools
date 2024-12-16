import fs from "fs";
import { mmFacade } from "../music-metadata-facade";
import { parseID3V2Array } from "../utils";
import { REPORTS_DIR } from "../config";
import {
  checkCover,
  checkArtists,
  checkBPM,
  checkBitrate,
  checkGenres,
  checkTitle,
  checkYear,
} from "./validators";

export let tracksTotal = 0;

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
