import fs from "fs";
import sizeof from "image-size";
import { mmFacade } from "../music-metadata-facade";
import { parseFile } from "../../node_modules/music-metadata";
import { processBrokenM3Upaths, validateM3UfilePaths } from "../utils";
import { COVER_MIN_SIZE } from "../config";

const EXTRACTED_COVERS_DIR = "./build/extracted-covers";

export async function extractCovers(trackPaths: string[], saveTo: string) {
  for (const index of trackPaths.keys()) {
    const tPath = trackPaths[index];

    const { meta, cover } = await mmFacade.parseFile(tPath);

    if (cover === null) {
      throw new Error(`Track has no cover: ${tPath}`);
    }

    const { width, height, type: imgType = "" } = sizeof(cover.data);
    if (!width || !height) {
      throw new Error("Can't read image dimensions");
    } else if (width < COVER_MIN_SIZE && height < COVER_MIN_SIZE) {
      throw new Error(
        `The cover is too small: ${width}x${height}. Min size (width or height) should be ${COVER_MIN_SIZE})`
      );
    }

    await fs.promises.writeFile(
      `${saveTo}/${index + 1} ${meta.artists?.join(", ")} - ${
        meta.title
      }.${imgType}`,
      cover.data
    );
  }
}

export async function init(m3uFilePath: string) {
  await fs.promises.rm(EXTRACTED_COVERS_DIR, { recursive: true, force: true });
  await fs.promises.mkdir(EXTRACTED_COVERS_DIR);
  const paths = await validateM3UfilePaths(m3uFilePath);
  await processBrokenM3Upaths(paths.broken);
  await extractCovers(paths.ok, EXTRACTED_COVERS_DIR);
}
