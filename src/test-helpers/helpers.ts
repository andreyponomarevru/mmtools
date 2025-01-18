import fs from "fs";
import path from "path";
import { BUILD_DIR } from "../config/constants";

export async function isPathExists(path: string) {
  return fs.promises.stat(path).then(
    () => true,
    () => false
  );
}

export function clearDir(dir: string) {
  const avoidErrIfDirNotExist = { force: true };
  const rmNestedDirs = { recursive: true };

  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir, { recursive: true }).forEach((f) => {
    const relativePath = path.join(BUILD_DIR, String(f));
    fs.rmSync(relativePath, {
      ...avoidErrIfDirNotExist,
      ...rmNestedDirs,
    });
  });
}
