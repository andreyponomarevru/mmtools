import fs from "fs";
import { mmFacade } from "../music-metadata-facade";
import { parseID3V2Array } from "../utils";
import { REPORTS_DIR } from "../config/constants";
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

export async function validateAudioFile(
  filePath: string,
  shouldThrow = false
): Promise<undefined | void> {
  const { meta, cover } = await mmFacade.parseFile(filePath);

  const validationResults = [
    checkCover(cover),
    checkBPM(meta.bpm),
    checkBitrate(meta.bitrate),
    checkGenres(parseID3V2Array(meta.genre || [])),
    checkTitle(meta.title),
    checkArtists(parseID3V2Array(meta.artists || [])),
    checkYear(meta.year),
  ];

  const validationErrors = validationResults.filter(
    (r) => r.errors.length !== 0
  );

  if (shouldThrow && validationErrors.length > 0) {
    throw new Error(`MISSING ID3 TAGS. See logs in /build dir\n`);
  }

  for (const { errors, logTo } of validationErrors) {
    for (const err of errors) {
      await fs.promises.appendFile(
        logTo,
        `${filePath}${err.length > 0 ? ` - ${err}` : err}\n`
      );
    }
  }

  tracksTotal++;
}

export function onCtrlC() {
  const avoidErrIfDirNotExist = { force: true };
  const rmNestedDirs = { recursive: true };
  fs.rmSync(REPORTS_DIR, { ...avoidErrIfDirNotExist, ...rmNestedDirs });
  process.exit();
}
