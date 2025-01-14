import fs from "fs";
import { processBrokenM3Upaths, validateM3UfilePaths } from "../utils";
import { extractCovers } from "./extract-covers";

const EXTRACTED_COVERS_DIR = "./build/extracted-covers";

export async function init(m3uFilePath: string) {
  const avoidErrIfDirNotExist = { force: true };
  const rmNestedDirs = { recursive: true };
  await fs.promises.rm(EXTRACTED_COVERS_DIR, {
    ...avoidErrIfDirNotExist,
    ...rmNestedDirs,
  });
  await fs.promises.mkdir(EXTRACTED_COVERS_DIR, { ...rmNestedDirs });
  const paths = await validateM3UfilePaths(m3uFilePath);
  await processBrokenM3Upaths(paths.broken);
  await extractCovers(paths.ok, EXTRACTED_COVERS_DIR);
}
