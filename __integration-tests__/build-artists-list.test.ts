import path from "path";
import util from "util";
import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { buildArtistsList } from "../src/m3u-to-tracklist/m3u-to-tracklist";
import { m3uWithAbsolutePaths } from "../src/test-helpers/m3u-playlists";

describe("buildArtistsList", () => {
  it("given a list of track paths, returns comma-separated list of track artists", async () => {
    const artists = await buildArtistsList(m3uWithAbsolutePaths.parsed);

    expect(artists).toEqual([
      "Carlos Niño & Friends",
      "P. Real",
      "Miguel Migs",
      "The Zenmenn",
    ]);
  });
});
