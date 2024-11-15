import fs from "fs";
import path from "path";
import { SUPPORTED_CODEC } from "./config";

export function parseID3V2Array(arr: string[]) {
  return arr.length > 0
    ? Array.from(
        new Set(arr.filter((str) => str.trim()).map((str) => str.trim()))
      )
    : [];
}

export function isValidFileExtension(filePath: string) {
  const extension = path.extname(filePath).slice(1).toLowerCase();

  return SUPPORTED_CODEC.includes(extension);
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
    } else if (isValidFileExtension(nodeFullPath)) {
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

  for (let i = 0; i < m3uLines.length; i++) {
    const str = m3uLines[i];

    if (/#EXT/.test(str) || str === "") continue;

    const filePath = decodeURIComponent(str).replace("file://", "").trim();
    filePaths.push(filePath);
  }

  return filePaths;
}

export async function validateM3UfilePaths(m3uPath: string) {
  const m3u = await fs.promises.readFile(m3uPath, "utf-8");

  const trackFilePaths = extractFilePathsFromM3U(m3u);

  const brokenPaths: string[] = [];
  const ok: string[] = [];

  for (const trackPath of trackFilePaths) {
    !fs.existsSync(trackPath)
      ? brokenPaths.push(trackPath)
      : ok.push(trackPath);
  }

  return { broken: brokenPaths, ok };
}

export function processBrokenM3Upaths(brokenFilePaths: string[]) {
  if (brokenFilePaths.length > 0) {
    const list = brokenFilePaths.join("\n");
    console.error(`The following M3U file paths are broken: \n\n${list}`);
    process.exit();
  }
}
