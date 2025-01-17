import fs from "fs";
import { clearDir, validateM3UfilePaths } from "../utils";
import { extractCovers } from "./extract-covers";
import { BUILD_DIR, EXTRACTED_COVERS_DIR } from "../config/constants";

export async function init(m3uFilePath: string) {
  const rmNestedDirs = { recursive: true };
  clearDir(BUILD_DIR);
  await fs.promises.mkdir(EXTRACTED_COVERS_DIR, { ...rmNestedDirs });
  const paths = await validateM3UfilePaths(m3uFilePath);
  await extractCovers(paths, EXTRACTED_COVERS_DIR);
}
