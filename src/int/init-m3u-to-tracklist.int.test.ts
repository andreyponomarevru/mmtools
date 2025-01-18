import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { init } from "../m3u-to-tracklist/init";
import { BUILD_DIR, TRACKLIST_OUTPUT_PATH } from "../config/constants";
import { M3U_PATH } from "../config/constants";
import { clearDir, isPathExists } from "../test-helpers/helpers";
import * as utils from "../utils";

const EXPECTED_TRACKLIST_PATH = "./test-data/expected-tracklist.txt";

beforeAll(() => clearDir(BUILD_DIR));

describe("converts m3u into tracklist", () => {
  beforeEach(async () => {
    await clearDir(BUILD_DIR);

    // Mock to prevent tests from failing on CI server due to the different
    // file structure on the local machine and on CI server
    //
    // Usually .m3u contains absolute paths. Without mocking,
    // validateM3UfilePaths will compare absolute paths from m3u (e.g.
    // "file:///mnt/C4657E878E/music-lib/..." to themselves but parsed
    // ("/mnt/C4...") and  will fail 'cause these paths don't exist on CI
    // server. To avoid tying tests to the file system we mock the results of
    // validateM3UfilePaths and set paths *relative* to the current fs using
    // process.cwd(). Now theses paths exist/valid both locally and on CI server)
    jest
      .spyOn(utils, "validateM3UfilePaths")
      .mockResolvedValue([
        `${process.cwd()}/test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac`,
        `${process.cwd()}/test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3`,
        `${process.cwd()}/test-data/music-lib/valid-tags/Those Things Deluxe (2007)/CD 2/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac`,
        `${process.cwd()}/test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac`,
      ]);
  });

  it("throws on ID3v2 validation error if 'shouldThrow' arg is set to true", async () => {
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("MISSING ID3 TAGS. See logs in /build dir");
    });

    await expect(init(M3U_PATH, true)).rejects.toThrowError(
      "MISSING ID3 TAGS. See logs in /build dir"
    );
  });

  it("doesn't throw on ID3v2 validation error if 'shouldThrow' arg is set to false", async () => {
    await expect(init(M3U_PATH, false)).resolves.toBe(undefined);
  });

  it("doesn't throw on ID3v2 validation error if 'shouldThrow' arg is omitted", async () => {
    await expect(init(M3U_PATH)).resolves.toBe(undefined);
  });

  it("creates a .txt file containing properly formatted tracklist, given an .m3u file", async () => {
    await init(M3U_PATH);

    await expect(isPathExists(TRACKLIST_OUTPUT_PATH)).resolves.toBe(true);

    const tracklist = await fs.promises.readFile(TRACKLIST_OUTPUT_PATH, {
      encoding: "utf-8",
    });
    const expected = await fs.promises.readFile(EXPECTED_TRACKLIST_PATH, {
      encoding: "utf-8",
    });
    expect(tracklist).toBe(expected);
  });
});
