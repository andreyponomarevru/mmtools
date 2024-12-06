import fs from "fs";
import sizeof from "image-size";
import type { IPicture } from "music-metadata";
import {
  COVER_MIN_SIZE,
  REPORT_NO_BPM,
  REPORT_LOW_BITRATE,
  MIN_BITRATE,
  REPORT_BAD_ARTISTS,
  REPORT_BAD_GENRES,
  REPORT_BAD_TITLE,
  REPORT_BAD_YEAR,
  GENRES,
  REPORT_BAD_COVERS,
} from "../config";

export async function checkCover(filePath: string, cover: IPicture | null) {
  if (cover === null) {
    await fs.promises.appendFile(REPORT_BAD_COVERS, `${filePath} - no cover\n`);
    return;
  }

  const { width = 0, height = 0 } = sizeof(cover.data);
  const isInvalidSize = width < COVER_MIN_SIZE && height < COVER_MIN_SIZE;

  if (isInvalidSize) {
    await fs.promises.appendFile(
      REPORT_BAD_COVERS,
      `${filePath} - ${width} x ${height}\n`
    );
  }
}

export async function checkBPM(filePath: string, bpm?: number) {
  if (bpm === undefined || bpm < 0) {
    await fs.promises.appendFile(REPORT_NO_BPM, `${filePath}\n`);
  }
}

export async function checkBitrate(filePath: string, bitrate?: number) {
  if (!bitrate || bitrate < MIN_BITRATE) {
    await fs.promises.appendFile(
      REPORT_LOW_BITRATE,
      `${(bitrate || 0) / 1000}kbps - ${filePath}\n`
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
    !Number.isInteger(year) ||
    year < 0 ||
    year > 2050 ||
    !Number.isFinite(year)
  ) {
    await fs.promises.appendFile(REPORT_BAD_YEAR, `${filePath} - ${year}\n`);
  }
}
