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
} from "./config";

export const coversStats: {
  [key: string]: { path: string; w: number; h: number }[];
} = {};

export async function checkCover(filePath: string, picture?: mm.IPicture[]) {
  const cover = await mm.selectCover(picture);

  if (cover === null) {
    await fs.promises.appendFile(REPORT_NO_COVERS, `${filePath}\n`);
    return;
  }

  const dimensions = sizeof(cover.data);
  if (!dimensions.width || !dimensions.height) {
    throw new Error("Can't read image dimensions.");
  }

  if (dimensions.width < COVER_MIN_SIZE && dimensions.height < COVER_MIN_SIZE) {
    const coverSize = `${dimensions.width} x ${dimensions.height}`;

    if (!Array.isArray(coversStats[coverSize])) {
      coversStats[coverSize] = [];
    }

    coversStats[coverSize].push({
      path: filePath,
      w: dimensions.width,
      h: dimensions.height,
    });
  }
}

export async function checkBPM(filePath: string, bpm?: number) {
  if ((bpm && bpm < 0) || bpm === undefined || isNaN(bpm)) {
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
  if (!title) {
    await fs.promises.appendFile(REPORT_BAD_TITLE, `${filePath}\n`);
  }
}

export async function checkArtists(filePath: string, artists: string[]) {
  if (artists.length === 0) {
    await fs.promises.appendFile(REPORT_BAD_ARTISTS, `${filePath}\n`);
  }
}

export async function checkYear(filePath: string, year?: number) {
  if (!year || year < 0 || !Number.isInteger) {
    await fs.promises.appendFile(REPORT_BAD_YEAR, `${filePath}\n - ${year}`);
  }
}
