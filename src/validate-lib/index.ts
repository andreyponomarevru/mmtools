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

export async function validateAudioFile(filePath: string) {
  const { common, format } = await mm.parseFile(filePath, { duration: true });
  const cover = mm.selectCover(common.picture);

  await checkCover(filePath, cover);
  await checkBPM(filePath, common.bpm);
  await checkBitrate(filePath, format.bitrate);
  await checkGenres(filePath, parseID3V2Array(common.genre || []));
  await checkTitle(filePath, common.title);
  await checkArtists(filePath, parseID3V2Array(common.artists || []));
  await checkYear(filePath, common.year);

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

async function init() {
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

init().catch(console.error);
