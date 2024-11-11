//
// Music Lib rules
//

import genres from "./validate-lib/genres.json";

export const SUPPORTED_CODEC = ["flac", "mp3"];
export const COVER_MIN_SIZE = 599;
export const MIN_BITRATE = 320000;
export const GENRES = genres;

export const REPORTS_DIR = "./build/reports";

export const REPORT_BAD_COVERS = `${REPORTS_DIR}/small-covers.json`;
export const REPORT_NO_COVERS = `${REPORTS_DIR}/no-covers.log`;
export const REPORT_NO_BPM = `${REPORTS_DIR}/bad-bpm.log`;
export const REPORT_LOW_BITRATE = `${REPORTS_DIR}/bad-bitrate.log`;
export const REPORT_BAD_GENRES = `${REPORTS_DIR}/bad-genre.log`;
export const REPORT_BAD_TITLE = `${REPORTS_DIR}/bad-title.log`;
export const REPORT_BAD_ARTISTS = `${REPORTS_DIR}/bad-artist.log`;
export const REPORT_BAD_YEAR = `${REPORTS_DIR}/bad-year.log`;

export const EXTRACTED_COVERS_DIR = "./build/extracted-covers";

export const M3U_TRACKLIST = "./build/m3u_tracklist.txt";
