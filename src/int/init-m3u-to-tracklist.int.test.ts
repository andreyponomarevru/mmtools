import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { init } from "../m3u-to-tracklist/init";
import { M3U_TRACKLIST } from "../config/constants";
import { isPathExists } from "../test-helpers/helpers";

describe("converts m3u into tracklist", () => {
  it("given an .m3u file, creates a .txt file containing data", async () => {
    await fs.promises.rm(M3U_TRACKLIST, { force: true, recursive: true });

    await init("./test-data/m3u-playlists/absolute-paths-saved-in-vlc.m3u");

    expect(await isPathExists(M3U_TRACKLIST)).toBe(true);

    const tracklist = await fs.promises.readFile(M3U_TRACKLIST);
    expect(tracklist.length > 0).toBe(true);
  });

  it("given an .m3u file, creates a file containing properly formatted tracklist", async () => {
    await fs.promises.rm(M3U_TRACKLIST, { force: true, recursive: true });

    await init("./test-data/m3u-playlists/absolute-paths-saved-in-vlc.m3u");

    const tracklist = await fs.promises.readFile(M3U_TRACKLIST);
    const convertedTracklist = `Carlos Niño & Friends - P. Real - Miguel Migs

Carlos Niño & Friends — Woo, Acknowledgement (‎2023)
P. Real —  (‎2021)
Miguel Migs — So Far (Rasmus Faber’s Farplane radio edit) (‎2007-03-20)
 — The Legend Of Haziz (‎2023)`;
    expect(tracklist.toString("utf-8")).toBe(convertedTracklist);
  });
});
