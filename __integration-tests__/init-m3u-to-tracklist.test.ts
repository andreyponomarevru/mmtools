import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { init } from "../src/m3u-to-tracklist/init";
import { M3U_TRACKLIST } from "../src/config";
import { isPathExists } from "../src/test-helpers/helpers";

describe("converts m3u into tracklist", () => {
  it("given an .m3u file, creates a .txt file containing data", async () => {
    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error();
    });
    await fs.promises.rm(M3U_TRACKLIST, { force: true, recursive: true });

    expect(await isPathExists(M3U_TRACKLIST)).toBe(false);

    await init("./__test-data__/m3u-playlists/absolute-paths-saved-in-vlc.m3u");

    expect(await isPathExists(M3U_TRACKLIST)).toBe(true);

    const tracklist = await fs.promises.readFile(M3U_TRACKLIST);
    expect(tracklist.length > 0).toBe(true);
  });

  it("given an .m3u file, creates a file containing properly formatted tracklist", async () => {
    jest.spyOn(process, "exit").mockImplementationOnce(() => {
      throw new Error();
    });
    await fs.promises.rm(M3U_TRACKLIST, { force: true, recursive: true });

    expect(await isPathExists(M3U_TRACKLIST)).toBe(false);

    await init("./__test-data__/m3u-playlists/absolute-paths-saved-in-vlc.m3u");

    const tracklist = await fs.promises.readFile(M3U_TRACKLIST);
    const convertedTracklist = `Carlos Niño & Friends - P. Real - Miguel Migs

Carlos Niño & Friends — Woo, Acknowledgement (‎2023)
P. Real —  (‎2021)
Miguel Migs — So Far (Rasmus Faber’s Farplane radio edit) (‎2007-03-20)
 — The Legend Of Haziz (‎2023)`;
    expect(tracklist.toString("utf-8")).toBe(convertedTracklist);
  });
});
