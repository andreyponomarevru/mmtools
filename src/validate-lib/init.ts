import fs from "fs";
import { traverseDirs } from "../utils";
import { SUPPORTED_CODEC, REPORTS_DIR } from "../config/constants";
import { validateAudioFile, tracksTotal } from "./validate-lib";

export async function init(libPath: string, shouldThrow = false) {
  const avoidErrIfDirNotExist = { force: true };
  const rmNestedDirs = { recursive: true };
  await fs.promises.rm(REPORTS_DIR, {
    ...avoidErrIfDirNotExist,
    ...rmNestedDirs,
  });
  await fs.promises.mkdir(REPORTS_DIR, rmNestedDirs);

  const callback = async (filePath: string) =>
    await validateAudioFile(filePath, shouldThrow);
  await traverseDirs(libPath, callback);

  console.log(
    `\nProcessed all ${tracksTotal} tracks (${SUPPORTED_CODEC.join(", ")})`
  );
}
