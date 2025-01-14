import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { init } from "../m3u-to-tracklist/init";
import { TRACKLIST_OUTPUT_PATH } from "../config/constants";
import { isPathExists } from "../test-helpers/helpers";

const EXPECTED_TRACKLIST_PATH = "./test-data/expected-tracklist.txt";
const M3U_PATH = "./test-data/m3u-playlists/absolute-paths-saved-in-vlc.m3u";

async function cleanupDir() {
  const rmNestedDirs = { recursive: true };
  const avoidErrIfDirNotExist = { force: true };
  await fs.promises.rm(TRACKLIST_OUTPUT_PATH, {
    ...rmNestedDirs,
    ...avoidErrIfDirNotExist,
  });
}

describe("converts m3u into tracklist", () => {
  beforeEach(async () => await cleanupDir());

  it("throws an error on validation error if 'shouldThrow' arg is set to true", async () => {
    await expect(init(M3U_PATH, true)).rejects.toThrowError(
      "MISSING ID3 TAGS. See logs in /build dir"
    );
  });

  it("doesn't throw on validation error if 'shouldThrow' arg is set to false", async () => {
    await expect(init(M3U_PATH, false)).resolves.toBe(undefined);
  });

  it("doesn't throw on validation error if 'shouldThrow' arg is omitted", async () => {
    await expect(init(M3U_PATH)).resolves.toBe(undefined);
  });

  it("given an .m3u file, creates a .txt file containing data", async () => {
    await init(M3U_PATH);

    await expect(isPathExists(TRACKLIST_OUTPUT_PATH)).resolves.toBe(true);
    const tracklist = await fs.promises.readFile(TRACKLIST_OUTPUT_PATH);
    expect(tracklist.length > 0).toBe(true);
  });

  it("given an .m3u file, creates a file containing properly formatted tracklist", async () => {
    await init(M3U_PATH);

    const tracklist = await fs.promises.readFile(TRACKLIST_OUTPUT_PATH, {
      encoding: "utf-8",
    });
    const expected = await fs.promises.readFile(EXPECTED_TRACKLIST_PATH, {
      encoding: "utf-8",
    });
    expect(tracklist).toBe(expected);
  });
});
