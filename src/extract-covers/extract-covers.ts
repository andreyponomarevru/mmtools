import fs from "fs";
import sizeof from "image-size";
import { mmFacade } from "../music-metadata-facade";
import { COVER_MIN_SIZE } from "../config/constants";

export const nonSafeCharsRegex = /[^0-9a-z\- ]/gi;

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

    const trackNumber = index + 1;
    const artists = meta.artists?.join(", ").replace(nonSafeCharsRegex, "");
    const title = meta.title?.replace(nonSafeCharsRegex, "");
    const filename =
      `${trackNumber} ${artists} - ${title}.${imgType}`.toLowerCase();

    // "{ recursive: true}" is required to avoid an error if dir exists
    await fs.promises.mkdir(saveTo, { recursive: true });
    await fs.promises.writeFile(`${saveTo}/${filename}`, cover.data);
  }
}
