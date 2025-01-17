import type { IPicture } from "music-metadata";
import sizeof from "image-size";
import {
  COVER_MIN_SIZE,
  MIN_BITRATE,
  GENRES,
  REPORT_BAD_COVERS,
  REPORT_BAD_GENRES,
  REPORT_BAD_BPM,
  REPORT_LOW_BITRATE,
  REPORT_BAD_TITLE,
  REPORT_BAD_ARTISTS,
  REPORT_BAD_YEAR,
} from "../config/constants";

type ValidationResult = { logTo: string; errors: string[] };

export function checkCover(cover: IPicture | null): ValidationResult {
  const errors: string[] = [];

  if (cover === null) {
    errors.push("no cover");
    return { logTo: REPORT_BAD_COVERS, errors };
  }

  const { width = 0, height = 0 } = sizeof(cover.data);
  const isInvalidSize = width < COVER_MIN_SIZE && height < COVER_MIN_SIZE;

  if (isInvalidSize) {
    errors.push(`${width} x ${height}`);
  }

  return { logTo: REPORT_BAD_COVERS, errors };
}

export function checkGenres(genres: string[]): ValidationResult {
  const errors: string[] = [];

  if (genres.length === 0) errors.push("no genre :(");

  genres.forEach((genre) => {
    if (!GENRES.includes(genre)) errors.push(`${genre}`);
  });

  return { logTo: REPORT_BAD_GENRES, errors };
}

export function checkBPM(bpm?: number): ValidationResult {
  const errors: string[] = [];

  if (bpm === undefined || bpm < 0) errors.push("");
  return { logTo: REPORT_BAD_BPM, errors };
}

export function checkBitrate(bitrate?: number): ValidationResult {
  let errors: string[] = [];

  if (!bitrate || bitrate < MIN_BITRATE) {
    errors.push(`${(bitrate || 0) / 1000}kbps`);
  }
  return { logTo: REPORT_LOW_BITRATE, errors };
}

export function checkTitle(title?: string): ValidationResult {
  const errors: string[] = [];

  if (title === undefined || title.length === 0) errors.push("");
  return { logTo: REPORT_BAD_TITLE, errors };
}

export function checkArtists(artists: string[]): ValidationResult {
  const errors: string[] = [];

  if (artists.length === 0) errors.push("");
  return { logTo: REPORT_BAD_ARTISTS, errors };
}

export function checkYear(year?: number): ValidationResult {
  const errors: string[] = [];

  if (
    !year ||
    !Number.isInteger(year) ||
    year < 0 ||
    year > 2050 ||
    !Number.isFinite(year)
  ) {
    errors.push("");
  }
  return { logTo: REPORT_BAD_YEAR, errors };
}
