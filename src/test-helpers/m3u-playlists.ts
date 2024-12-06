import fs from "fs";

export const m3uWithAbsolutePaths = {
  m3u: `
    #EXTM3U
    #EXTM3U
    #EXTINF:1,Carlos Niño & Friends - Woo, Acknowledgement
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Carlos%20Nino%20&%20Friends%20-%20Woo,%20Acknowledgement.flac
    #EXTINF:2,P. Real - Dedicated 2 U
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3
    #EXTINF:1,Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit)
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/06%20-%20Miguel%20Migs%20-%20So%20Far%20(Rasmus%20Faber%E2%80%99s%20Farplane%20radio%20edit)%20%5B16-44%5D.flac
    #EXTINF:1,The Zenmenn - The Legend Of Haziz
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/02.%20The%20Zenmenn%20-%20The%20Legend%20Of%20Haziz.flac`,
  parsed: [
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Carlos Nino & Friends - Woo, Acknowledgement.flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
    "/mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/02. The Zenmenn - The Legend Of Haziz.flac",
  ],
};

export const m3uWithNonLatinChars = {
  m3u: `
    #EXTM3U
    #EXTINF:1,Sunju Hargun - ٹرانس
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/-%20%2001%20%D9%B9%D8%B1%D8%A7%D9%86%D8%B3.aiff
    #EXTINF:1,Sandspider - 1.19
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/02.%20Sandspider%20-%201.19.flac
    #EXTINF:1,Khun Fluff - วิญญาณ (Full Circle's Lost In Translation Remix)
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/03%20%E0%B8%A7%E0%B8%B4%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%93%20(Full%20Circle's%20Lost%20In%20Translation%20Remix).aiff
    #EXTINF:1,Гости из будущего - Время Песок
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/03.%20%D0%93%D0%BE%D1%81%D1%82%D0%B8%20%D0%98%D0%B7%20%D0%91%D1%83%D0%B4%D1%83%D1%89%D0%B5%D0%B3%D0%BE%20-%20%D0%92%D1%80%D0%B5%D0%BC%D1%8F%20%D0%9F%D0%B5%D1%81%D0%BE%D0%BA.flac
    #EXTINF:1,Nmesh - 心はシダであります
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Nmesh%20-%20%E3%83%AD%E3%82%B9%E3%83%88%E3%82%A8%E3%83%87%E3%83%B3%E3%81%B8%E3%81%AE%E3%83%91%E3%82%B9%20-%2006%20%E5%BF%83%E3%81%AF%E3%82%B7%E3%83%80%E3%81%A7%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99.flac
    #EXTINF:1,Carlos Niño & Friends - Woo, Acknowledgement
    file:///mnt/CE64EB6A64EB53AD/music-lib/js/src/test-helpers/music-lib/Carlos%20Nino%20&%20Friends%20-%20Woo,%20Acknowledgement.flac`,
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
  m3u: `
    #EXTM3U
    #EXTINF:1,Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit)
    music-lib/06%20-%20Miguel%20Migs%20-%20So%20Far%20%28Rasmus%20Faber%E2%80%99s%20Farplane%20radio%20edit%29%20%5B16-44%5D.flac`,
  parsed: [
    "music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
  ],
};

export const m3uWithRelativePathsSavedInQuodLibet = {
  m3u: `
    #EXTM3U
    #EXTINF:1,Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit)
    ../music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac`,
  parsed: [
    "../music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
  ],
};
