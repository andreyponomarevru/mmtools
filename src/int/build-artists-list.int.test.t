import { describe, expect, it } from "@jest/globals";
import { buildArtistsList } from "../m3u-to-tracklist/m3u-to-tracklist";
import { clearDir } from "../test-helpers/helpers";
import { BUILD_DIR } from "../config/constants";

beforeAll(() => clearDir(BUILD_DIR));

describe("buildArtistsList", () => {
  it("returns comma-separated list of track artists if they are set in ID3 tags", async () => {
    const m3u = [
      "./test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac",
      "./test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3",
      "./test-data/music-lib/valid-tags/Those Things Deluxe (2007)/CD 2/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
      "./test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac",
    ];
    const artists = await buildArtistsList(m3u);

    expect(artists).toEqual([
      "Carlos Niño & Friends",
      "P. Real",
      "Miguel Migs",
    ]);
  });
});
