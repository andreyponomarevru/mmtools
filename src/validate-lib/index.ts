import fs from "fs";
import * as mm from "music-metadata";
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
const coversStats: {
  [key: string]: { path: string; w?: number; h?: number }[];
} = {};

async function processAudioFile(filePath: string) {
  const trackMetadata = await mm.parseFile(filePath, { duration: true });

  const checkedCoverResult = await checkCover(
    filePath,
    trackMetadata.common.picture
  );
  if (!checkedCoverResult.isValid) {
    const coverSize = `${checkedCoverResult.result.w} x ${checkedCoverResult.result.h}`;
    if (!Array.isArray(coversStats[coverSize])) {
      coversStats[coverSize] = [];
    }
    coversStats[coverSize].push(checkedCoverResult.result);
  }

  await checkBPM(filePath, trackMetadata.common.bpm);
  await checkBitrate(filePath, trackMetadata.format.bitrate);
  await checkGenres(
    filePath,
    parseID3V2Array(trackMetadata.common.genre || [])
  );
  await checkTitle(filePath, trackMetadata.common.title);
  await checkArtists(
    filePath,
    parseID3V2Array(trackMetadata.common.artists || [])
  );
  await checkYear(filePath, trackMetadata.common.year);

  tracksTotal++;
}

function onCtrlC() {
  fs.rmSync(REPORTS_DIR, { force: true, recursive: true });
  process.exit();
}

//
// Init
//

// Clean up and exit on Ctrl+C
process.on("SIGINT", onCtrlC);

fs.rmSync(REPORTS_DIR, { force: true, recursive: true });

fs.promises
  .mkdir(REPORTS_DIR)
  .then(() => {
    return traverseDirs(
      "/mnt/CE64EB6A64EB53AD/music-lib/tracks",
      processAudioFile
    );
  })
  .then(async () => {
    const stats = `${JSON.stringify({ tracksTotal, coversStats }, null, 4)}`;
    await fs.promises.appendFile(REPORT_BAD_COVERS, stats);

    console.log(
      `\nProcessed all ${SUPPORTED_CODEC.join(", ")} tracks (${tracksTotal})`
    );
  });
