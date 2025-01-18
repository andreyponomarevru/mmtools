import genres from "./genres.json";
export const GENRES = genres;
export const SUPPORTED_CODEC = ["flac", "mp3"];
export const COVER_MIN_SIZE = 599;
export const MIN_BITRATE = 320000;
export const NUMBER_OF_COVER_VERSIONS_TO_CREATE = 30;
export const LIB_PATH = "/mnt/CE64EB6A64EB53AD/music-lib/tracks";
const ROOT_BUILD_DIR = { production: "./build", test: "/tmp/mmtools" };

export const BUILD_DIR = ROOT_BUILD_DIR[process.env.NODE_ENV];

export const REPORT_BAD_COVERS = `${BUILD_DIR}/bad-covers.log`;
export const REPORT_BAD_BPM = `${BUILD_DIR}/bad-bpm.log`;
export const REPORT_LOW_BITRATE = `${BUILD_DIR}/bad-bitrate.log`;
export const REPORT_BAD_GENRES = `${BUILD_DIR}/bad-genre.log`;
export const REPORT_BAD_TITLE = `${BUILD_DIR}/bad-title.log`;
export const REPORT_BAD_ARTISTS = `${BUILD_DIR}/bad-artist.log`;
export const REPORT_BAD_YEAR = `${BUILD_DIR}/bad-year.log`;
export const EXTRACTED_COVERS_DIR = `${BUILD_DIR}/extracted-covers`;
export const TRACKLIST_OUTPUT_PATH = `${BUILD_DIR}/m3u_tracklist.txt`;

export const BUILD_COVER_SCRIPT_PATH = "./src/build-cover/build";

//
// Constants for testing
//

export const TEST_LIB_PATH = "./test-data/music-lib";
export const PATH_TO_INVALID_TRACKS = `${TEST_LIB_PATH}/invalid-tags`;
export const PATH_TO_VALID_TRACKS = `${TEST_LIB_PATH}/valid-tags`;
export const M3U_PATH =
  "./test-data/m3u-playlists/absolute-paths-saved-in-vlc.m3u";
