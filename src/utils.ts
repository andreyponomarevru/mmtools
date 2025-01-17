import fs from "fs";
import path from "path";
import { BUILD_DIR, SUPPORTED_CODEC } from "./config/constants";

export function parseID3V2Array(arr: string[]) {
  return arr.length > 0
    ? Array.from(
        new Set(arr.filter((str) => str.trim()).map((str) => str.trim()))
      )
    : [];
}

export function isValidFileExtension(
  filePath: string,
  validExtensions: string[]
) {
  const extension = path.extname(filePath).slice(1).toLowerCase();

  return validExtensions.includes(extension);
}

export async function traverseDirs(
  dirpath: string,
  callback: (filePath: string) => void
) {
  const fileSystemNodes = await fs.promises.readdir(dirpath);

  for (const fileSystemNode of fileSystemNodes) {
    const nodeFullPath = path.join(dirpath, fileSystemNode);
    const nodeStats = await fs.promises.stat(nodeFullPath);

    if (nodeStats.isDirectory()) {
      await traverseDirs(nodeFullPath, callback);
    } else if (isValidFileExtension(nodeFullPath, SUPPORTED_CODEC)) {
      await callback(nodeFullPath);
    }
  }
}

//
// M3U utils
//

export function extractFilePathsFromM3U(m3u: string) {
  const m3uLines = m3u.split("\n");

  const filePaths: string[] = [];

  m3uLines.forEach((line, index) => {
    const lineWithoutFilepath = /#EXT/;
    if (lineWithoutFilepath.test(line) || line === "") return;

    const filePath = decodeURIComponent(line).replace("file://", "").trim();
    filePaths.push(filePath);
  });

  return filePaths;
}

export async function validateM3UfilePaths(m3uPath: string): Promise<string[]> {
  const m3u = await fs.promises.readFile(m3uPath, "utf-8");

  const trackFilePaths = extractFilePathsFromM3U(m3u);

  const brokenPaths: string[] = [];
  const validPaths: string[] = [];

  trackFilePaths.forEach((trackPath) => {
    fs.existsSync(trackPath)
      ? validPaths.push(trackPath)
      : brokenPaths.push(trackPath);
  });

  if (brokenPaths.length > 0) {
    const list = brokenPaths.join("\n");
    console.error(`The following M3U file paths are broken:\n\n${list}`);
    process.exit(1);
  }

  return validPaths;
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
