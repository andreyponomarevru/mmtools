import fs from "fs";
import { traverseDirs } from "../utils";
import { SUPPORTED_CODEC, REPORTS_DIR } from "../config/constants";
import { validateAudioFile, tracksTotal } from "./validate-lib";

export async function init(libPath: string) {
  fs.rmSync(REPORTS_DIR, { force: true, recursive: true });
  await fs.promises.mkdir(REPORTS_DIR, { recursive: true });

  await traverseDirs(libPath, validateAudioFile);

  console.log(
    `\nProcessed all ${tracksTotal} tracks (${SUPPORTED_CODEC.join(", ")})`
  );
}
