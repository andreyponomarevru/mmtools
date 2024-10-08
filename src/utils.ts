import fs from "fs";
import path from "path";

export function parseID3V2Array(arr: string[]) {
  return arr.length > 0
    ? [...new Set(arr.filter((str) => str.trim()).map((str) => str.trim()))]
    : [];
}

export function getExtensionName(nodePath: string) {
  if (nodePath === "") throw new Error("Can't be an empty string");

  return path.extname(nodePath).slice(1).toLowerCase();
}

// TODO: refactor, removing the 'supported codec' variable, you should check this somewhere else ALso get rid of getExtensionName function. traverseDirs should only TRAVERSE DIR, it should not care about file tyoes, etc
export async function traverseDirs(
  supportedCodec: string[],
  dirpath: string,
  callback: (filePath: string) => void
) {
  const fileSystemNodes = await fs.promises.readdir(dirpath);

  for (const fileSystemNode of fileSystemNodes) {
    const nodeFullPath = path.join(dirpath, fileSystemNode);
    const nodeStats = await fs.promises.stat(nodeFullPath);

    if (nodeStats.isDirectory()) {
      await traverseDirs(supportedCodec, nodeFullPath, callback);
    } else if (supportedCodec.includes(getExtensionName(nodeFullPath))) {
      try {
        await callback(nodeFullPath);
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

export async function m3uToTracklist(
  trackPaths: string[],
  buildLine: (path: string) => Promise<string>,
  writeToPath: string
) {
  const tracklistAsText: string[] = [];

  for (const trackPath of trackPaths) {
    tracklistAsText.push(await buildLine(trackPath));
  }

  const lines = tracklistAsText.join("\n");
  await fs.promises.writeFile(writeToPath, lines);
}

export function handleBrokenM3Upaths(filePaths: {
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
