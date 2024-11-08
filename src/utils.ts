import fs from "fs";
import path from "path";

export function parseID3V2Array(arr: string[]) {
  return arr.length > 0
    ? Array.from(
        new Set(arr.filter((str) => str.trim()).map((str) => str.trim()))
      )
    : [];
}

export async function traverseDirs(dirpath: string, callbacks: Function[]) {
  const fileSystemNodes = await fs.promises.readdir(dirpath);

  for (const fileSystemNode of fileSystemNodes) {
    const nodeFullPath = path.join(dirpath, fileSystemNode);
    const nodeStats = await fs.promises.stat(nodeFullPath);

    if (nodeStats.isDirectory()) {
      await traverseDirs(nodeFullPath, callbacks);
    } else {
      try {
        for (const cb of callbacks) await cb(nodeFullPath);
      } catch (err) {
        throw err;
      }
    }
  }
}

// m3u utils

export function extractFilePathsFromM3U(m3u: string) {
  const m3uLines = m3u.split("\n");

  const filePaths: string[] = [];

  for (let i = 0; i < m3uLines.length; i++) {
    const str = m3uLines[i];

    if (/#EXT/.test(str) || str === "") continue;

    const filePath = decodeURIComponent(str).replace("file://", "");
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

export function processBrokenM3Upaths(filePaths: {
  broken: string[];
  ok: string[];
}) {
  if (filePaths.broken.length > 0) {
    const list = filePaths.broken.join("\n");
    console.error(`The following M3U file paths are broken: \n\n${list}`);
    process.exit();
  } else {
    return filePaths.ok;
  }
}
