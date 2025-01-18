export const m3uWithAbsolutePaths = {
  // We need to use process.cwd() instead of hard-coded paths to be able to run
  // tests on CI server, otherwise they fail 'cause the CI server has no "/mnt/.."
  m3u: `
    #EXTM3U
    #EXTM3U
    #EXTINF:1,Carlos Niño & Friends - Woo, Acknowledgement
    file://${process.cwd()}/test-data/music-lib/invalid-tags/Carlos%20Nino%20&%20Friends%20-%20Woo,%20Acknowledgement.flac
    #EXTINF:2,P. Real - Dedicated 2 U
    file://${process.cwd()}/test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3
    #EXTINF:1,Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit)
    file://${process.cwd()}/test-data/music-lib/valid-tags/Those%20Things%20Deluxe%20%282007%29/CD%202/06%20-%20Miguel%20Migs%20-%20So%20Far%20%28Rasmus%20Faber%E2%80%99s%20Farplane%20radio%20edit%29%20%5B16-44%5D.flac
    #EXTINF:1,The Zenmenn - The Legend Of Haziz
    file://${process.cwd()}/test-data/music-lib/invalid-tags/Various%20-%2010/02.%20The%20Zenmenn%20-%20The%20Legend%20Of%20Haziz.flac`,
  parsed: [
    `${process.cwd()}/test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac`,
    `${process.cwd()}/test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3`,
    `${process.cwd()}/test-data/music-lib/valid-tags/Those Things Deluxe (2007)/CD 2/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac`,
    `${process.cwd()}/test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac`,
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
