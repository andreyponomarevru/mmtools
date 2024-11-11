import fs from "fs";
import sizeof from "image-size";
import * as mm from "music-metadata";
import {
  REPORT_NO_COVERS,
  COVER_MIN_SIZE,
  REPORT_NO_BPM,
  REPORT_LOW_BITRATE,
  MIN_BITRATE,
  REPORT_BAD_ARTISTS,
  REPORT_BAD_GENRES,
  REPORT_BAD_TITLE,
  REPORT_BAD_YEAR,
  GENRES,
} from "../config";

export async function checkCover(filePath: string, picture?: mm.IPicture[]) {
  const cover = await mm.selectCover(picture);

  if (cover === null) {
    await fs.promises.appendFile(REPORT_NO_COVERS, `${filePath}\n`);
    return {
      isValid: false,
      result: { path: filePath, w: undefined, Headers: undefined },
    };
  }

  const dimensions = sizeof(cover.data);
  const isUnknownSize = !dimensions.width || !dimensions.height;

  const isInvalidSize =
    (dimensions.width || 0) < COVER_MIN_SIZE &&
    (dimensions.height || 0) < COVER_MIN_SIZE;

  return {
    isValid: !(isUnknownSize || isInvalidSize),
    result: { path: filePath, w: dimensions.width, h: dimensions.height },
  };
}

export async function checkBPM(filePath: string, bpm?: number) {
  if (bpm === undefined || bpm <= 0 || isNaN(bpm)) {
    await fs.promises.appendFile(REPORT_NO_BPM, `${filePath}\n`);
  }
}

export async function checkBitrate(filePath: string, bitrate?: number) {
  if (bitrate && bitrate < MIN_BITRATE) {
    await fs.promises.appendFile(
      REPORT_LOW_BITRATE,
      `${bitrate / 1000}kbps - ${filePath}\n`
    );
  }
}

export async function checkGenres(filePath: string, genres: string[]) {
  if (genres.length === 0) {
    await fs.promises.appendFile(
      REPORT_BAD_GENRES,
      `${filePath} - no genre :(\n`
    );
  }

  for (const genre of genres) {
    if (!GENRES.includes(genre)) {
      await fs.promises.appendFile(
        REPORT_BAD_GENRES,
        `${filePath} - ${genre}\n`
      );
    }
  }
}

export async function checkTitle(filePath: string, title?: string) {
  if (title === undefined || title.length === 0) {
    await fs.promises.appendFile(REPORT_BAD_TITLE, `${filePath}\n`);
  }
}

export async function checkArtists(filePath: string, artists: string[]) {
  if (artists.length === 0) {
    await fs.promises.appendFile(REPORT_BAD_ARTISTS, `${filePath}\n`);
  }
}

export async function checkYear(filePath: string, year?: number) {
  if (
    !year ||
    year < 0 ||
    !Number.isInteger(year) ||
    year > 2050 ||
    Number.isFinite(year)
  ) {
    await fs.promises.appendFile(REPORT_BAD_YEAR, `${filePath}\n - ${year}`);
  }
}
