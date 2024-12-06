import { describe, expect, it } from "@jest/globals";
import { buildArtistsList } from "../src/m3u-to-tracklist/m3u-to-tracklist";
import { m3uWithAbsolutePaths } from "../src/test-helpers/m3u-playlists";

describe("buildArtistsList", () => {
  it("returns comma-separated list of track artists if they are set in ID3 tags", async () => {
    const m3u = [
      "./__test-data__/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac",
      "./__test-data__/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3",
      "./__test-data__/music-lib/valid-tags/Those Things Deluxe (2007)/CD 2/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
      "./__test-data__/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac",
    ];
    const artists = await buildArtistsList(m3u);

    expect(artists).toEqual([
      "Carlos Niño & Friends",
      "P. Real",
      "Miguel Migs",
    ]);
  });
});
