import fs from "fs";

export const m3uWithAbsolutePaths = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/absolute-paths-saved-in-vlc.m3u"
    )
    .toString(),
  parsed: [
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Carlos Nino & Friends - Woo, Acknowledgement.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/02. The Zenmenn - The Legend Of Haziz.flac",
  ],
};

export const m3uWithNonLatinChars = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/non-latin-chars-saved-in-vlc.m3u"
    )
    .toString(),
  parsed: [
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/-  01 ٹرانس.aiff",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/02. Sandspider - 1.19.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/03 วิญญาณ (Full Circle's Lost In Translation Remix).aiff",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/03. Гости Из Будущего - Время Песок.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Nmesh - ロストエデンへのパス - 06 心はシダであります.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Carlos Nino & Friends - Woo, Acknowledgement.flac",
  ],
};

export const m3uWithRelativePathsSavedInVLC = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/relative-paths-saved-in-vlc.m3u"
    )
    .toString(),
  parsed: [
    "music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
  ],
};

export const m3uWithRelativePathsSavedInQuodLibet = {
  m3u: fs
    .readFileSync(
      "./src/test-helpers/playlists/relative-paths-saved-in-quod-libet.m3u"
    )
    .toString(),
  parsed: [
    "../music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
  ],
};
