//
// Music Lib rules
//

import genres from "./genres.json";
export const GENRES = genres;

export const SUPPORTED_CODEC = ["flac", "mp3"];
export const COVER_MIN_SIZE = 599;
export const MIN_BITRATE = 320000;

export const LIB_PATH = "/mnt/CE64EB6A64EB53AD/music-lib/tracks";
export const BUILD_DIR = { production: "./build", test: "/tmp" };
export const REPORTS_DIR = `${BUILD_DIR[process.env.NODE_ENV]}/reports`;
export const REPORT_BAD_COVERS = `${REPORTS_DIR}/bad-covers.log`;
export const REPORT_BAD_BPM = `${REPORTS_DIR}/bad-bpm.log`;
export const REPORT_LOW_BITRATE = `${REPORTS_DIR}/bad-bitrate.log`;
export const REPORT_BAD_GENRES = `${REPORTS_DIR}/bad-genre.log`;
export const REPORT_BAD_TITLE = `${REPORTS_DIR}/bad-title.log`;
export const REPORT_BAD_ARTISTS = `${REPORTS_DIR}/bad-artist.log`;
export const REPORT_BAD_YEAR = `${REPORTS_DIR}/bad-year.log`;
export const EXTRACTED_COVERS_DIR = `${
  BUILD_DIR[process.env.NODE_ENV]
}/extracted-covers`;

export const TRACKLIST_OUTPUT_PATH = `${
  BUILD_DIR[process.env.NODE_ENV]
}/m3u_tracklist.txt`;
