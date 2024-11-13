import fs from "fs";
import sizeof from "image-size";
import * as mm from "music-metadata";
import { processBrokenM3Upaths } from "../utils";
import { COVER_MIN_SIZE } from "../config";
import { validateM3UfilePaths } from "../utils";

const EXTRACTED_COVERS_DIR = "./build/extracted-covers";

const m3uPathArg = process.argv[2];

export async function extractCovers(trackPaths: string[], saveTo: string) {
  for (const index of trackPaths.keys()) {
    const tPath = trackPaths[index];
    const meta = await mm.parseFile(tPath);

    const cover = await mm.selectCover(meta.common.picture);

    if (cover === null) {
      throw new Error(`Track has no cover: ${tPath}`);
    }

    const { width, height, type: imgType } = sizeof(cover.data);
    if (!width || !height) {
      throw new Error("Can't read image dimensions");
    } else if (width < COVER_MIN_SIZE && height < COVER_MIN_SIZE) {
      throw new Error(
        `The cover is too small: ${width}x${height}. Min size (width or height) should be ${COVER_MIN_SIZE})`
      );
    }

    fs.writeFileSync(
      `${saveTo}/${index + 1} ${meta.common.artists?.join(", ")} - ${
        meta.common.title
      }.${imgType}`,
      cover.data
    );
  }
}

async function init() {
  fs.rmSync(EXTRACTED_COVERS_DIR, { recursive: true, force: true });

  await fs.promises.mkdir(EXTRACTED_COVERS_DIR);
  const paths = await validateM3UfilePaths(m3uPathArg);
  await processBrokenM3Upaths(paths.broken);
  await extractCovers(paths.ok, EXTRACTED_COVERS_DIR);
}

init().catch(console.error);
