import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { init } from "../m3u-to-tracklist/init";
import { BUILD_DIR, TRACKLIST_OUTPUT_PATH } from "../config/constants";
import { M3U_PATH } from "../config/constants";
import { clearDir, isPathExists } from "../test-helpers/helpers";
import * as utils from "../utils";

// THIS FILE FAILS ALL TEST SUITES

const EXPECTED_TRACKLIST_PATH = "./test-data/expected-tracklist.txt";

beforeAll(() => clearDir(BUILD_DIR));

describe("converts m3u into tracklist", () => {
  beforeEach(async () => await clearDir(BUILD_DIR));

  it("throws an error on validation error if 'shouldThrow' arg is set to true", async () => {
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("MISSING ID3 TAGS. See logs in /build dir");
    });

    await expect(init(M3U_PATH, true)).rejects.toThrowError(
      "MISSING ID3 TAGS. See logs in /build dir"
    );
  });

  it.only("doesn't throw on validation error if 'shouldThrow' arg is set to false", async () => {
    jest
      .spyOn(utils, "validateM3UfilePaths")
      .mockResolvedValue([
        `${process.cwd()}/test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac`,
        `${process.cwd()}/test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3`,
        `${process.cwd()}/test-data/music-lib/valid-tags/Those Things Deluxe (2007)/CD 2/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac`,
        `${process.cwd()}/test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac`,
      ]);

    await expect(init(M3U_PATH, false)).resolves.toBe(undefined);
  });

  it("doesn't throw on validation error if 'shouldThrow' arg is omitted", async () => {
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
