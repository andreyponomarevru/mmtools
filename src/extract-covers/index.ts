import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import util from "util";
import { Jimp } from "jimp";
import { UtfString } from "utfstring";
import sizeof from "image-size";
import * as mm from "music-metadata";
import {
  traverseDirs,
  getExtensionName,
  parseID3V2Array,
  extractFilePathsFromM3U,
  handleBrokenM3Upaths,
} from "../utils";
import { SUPPORTED_CODEC, COVER_MIN_SIZE } from "../check-lib/config";
import { validateM3UfilePaths } from "../utils";

const EXTRACTED_COVERS_PATH = "./build/extracted-covers";

const m3uPath = process.argv[2];

//TODO : create a single function running all validation similar to entire database validatons but only for m3u tracks

async function extractCovers(trackPaths: string[]) {
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

    if (!fs.existsSync(EXTRACTED_COVERS_PATH)) {
      fs.mkdirSync(EXTRACTED_COVERS_PATH);
    }
    const filePath = `${EXTRACTED_COVERS_PATH}/${
      index + 1
    } ${meta.common.artists?.join(", ")} - ${meta.common.title}.${
      dimensions.type
    }`;
    fs.writeFileSync(filePath, cover.data);
  }
}

validateM3UfilePaths(m3uPath).then(handleBrokenM3Upaths).then(extractCovers);
