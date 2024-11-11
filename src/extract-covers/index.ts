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

    if (!cover) {
      throw new Error(`Track has no cover: ${tPath}`);
    }

    const dimensions = sizeof(cover.data);
    if (!dimensions.width || !dimensions.height) {
      throw new Error("Can't read image dimensions");
    } else if (
      dimensions.width < COVER_MIN_SIZE &&
      dimensions.height < COVER_MIN_SIZE
    ) {
      throw new Error(
        `The cover is too small: ${dimensions.width}x${dimensions.height}. Min size (width or height) should be ${COVER_MIN_SIZE})`
      );
    }

    const filePath = `${saveTo}/${index + 1} ${meta.common.artists?.join(
      ", "
    )} - ${meta.common.title}.${dimensions.type}`;
    fs.writeFileSync(filePath, cover.data);
  }
}

fs.rmSync(EXTRACTED_COVERS_DIR, { recursive: true, force: true });

fs.promises
  .mkdir(EXTRACTED_COVERS_DIR)
  .then((r) => validateM3UfilePaths(m3uPathArg))
  .then(processBrokenM3Upaths)
  .then((r) => extractCovers(r, EXTRACTED_COVERS_DIR));
