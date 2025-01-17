import fs from "fs";
import { clearDir, traverseDirs } from "../utils";
import { SUPPORTED_CODEC, BUILD_DIR } from "../config/constants";
import { validateAudioFile, tracksTotal } from "./validate-lib";

export async function init(libPath: string, shouldThrow = false) {
  clearDir(BUILD_DIR);
  const createNestedDirs = { recursive: true };
  await fs.promises.mkdir(BUILD_DIR, createNestedDirs);

  const callback = async (filePath: string) =>
    await validateAudioFile(filePath, shouldThrow);
  await traverseDirs(libPath, callback);
  console.log(
    `\nProcessed all ${tracksTotal} tracks (${SUPPORTED_CODEC.join(", ")})`
  );
}
