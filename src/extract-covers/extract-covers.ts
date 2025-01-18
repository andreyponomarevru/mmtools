import fs from "fs";
import path from "path";
import * as sizeof from "image-size";
import { mmFacade } from "../music-metadata-facade";
import { COVER_MIN_SIZE } from "../config/constants";

export const nonSafeCharsRegex = /[^0-9a-z\- ]/gi;

export async function extractCovers(trackPaths: string[], saveTo: string) {
  for (const index of trackPaths.keys()) {
    const tPath = "./" + path.relative(process.cwd(), trackPaths[index]);
    // We need to strip from the tPath the part "/mnt/C986556/js"
    console.log(`process.cwd: ${process.cwd()}`);
    const { meta, cover } = await mmFacade.parseFile(tPath);

    if (cover === null) {
      throw new Error(`Track has no cover: ${tPath}`);
    }

    const { width, height, type: imgType = "" } = sizeof.default(cover.data);
    if (!width || !height) {
      throw new Error("Can't read image dimensions");
    } else if (width < COVER_MIN_SIZE && height < COVER_MIN_SIZE) {
      throw new Error(
        `The cover is too small: ${width}x${height}. Min size (width or height) should be ${COVER_MIN_SIZE})`
      );
    }

    const trackNumber = index + 1;
    const artists =
      meta.artists && meta.artists.length > 0
        ? meta.artists.join(", ").replace(nonSafeCharsRegex, "")
        : "Missing ID3v2 Artist Tag";
    const title =
      meta.title?.replace(nonSafeCharsRegex, "") || "Missing ID3v2 Title Tag";
    const filename = `${trackNumber} ${artists} - ${title}.${imgType}`
      .toLowerCase()
      .replace(/ /g, "_");

    const avoidErrIfDirExists = { recursive: true };
    await fs.promises.mkdir(saveTo, avoidErrIfDirExists);
    await fs.promises.writeFile(`${saveTo}/${filename}`, cover.data);
  }
}
