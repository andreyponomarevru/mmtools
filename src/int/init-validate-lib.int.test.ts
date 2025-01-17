import path from "path";
import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { init } from "../validate-lib/init";
import {
  REPORT_BAD_ARTISTS,
  REPORT_BAD_COVERS,
  REPORT_BAD_GENRES,
  REPORT_BAD_TITLE,
  REPORT_BAD_YEAR,
  REPORT_LOW_BITRATE,
  REPORT_BAD_BPM,
  BUILD_DIR,
} from "../config/constants";
import * as utils from "../utils";
import {
  isPathExists,
  PATH_TO_INVALID_TRACKS,
  PATH_TO_VALID_TRACKS,
  TEST_LIB_PATH,
} from "../test-helpers/helpers";
import { clearDir as clearDirHelper } from "../test-helpers/helpers";

beforeAll(() => clearDirHelper(BUILD_DIR));

describe("validates library", () => {
  it("clears BUILD_DIR before creating a new one", async () => {
    // NOTE I haven't been able to configure jest-extended to test the fact
    // that rm is called *before* mkdir. TS doesn't see jest-extended types
    // declaration file (d.ts)

    const rmSyncSpy = jest.spyOn(utils, "clearDir");

    await init(TEST_LIB_PATH);

    expect(rmSyncSpy).toHaveBeenCalledTimes(1);
    expect(rmSyncSpy).toHaveBeenCalledWith(BUILD_DIR);
  });

  it("creates .log file for each type of library constraint", async () => {
    await init(TEST_LIB_PATH);

    expect(await isPathExists(BUILD_DIR)).toBe(true);

    const reportsDir = await fs.promises.readdir(BUILD_DIR);
    expect(reportsDir.length).toBe(7);

    const fileNames = [
      REPORT_BAD_ARTISTS,
      REPORT_BAD_COVERS,
      REPORT_BAD_GENRES,
      REPORT_BAD_TITLE,
      REPORT_BAD_YEAR,
      REPORT_LOW_BITRATE,
      REPORT_BAD_BPM,
    ]
      .map((str) => path.basename(str))
      .sort();
    expect(reportsDir.sort()).toEqual(fileNames);
  });

  it("doesn't create .log files if there are no invalid ID3 tags", async () => {
    await init(PATH_TO_VALID_TRACKS);

    const reportsDir = await fs.promises.readdir(BUILD_DIR);
    expect(reportsDir.length).toBe(0);
  });

  describe("writes error to file", () => {
    it("if track has invalid cover", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_COVERS, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/03. Гости Из Будущего - Время Песок.flac - no cover\n"
      );
    });

    it("if track has invalid genre", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_GENRES, {
          encoding: "utf-8",
        })
      ).toBe(
        `test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3 - Invalid Genre\ntest-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac - Hurum\ntest-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac - Burum\n`
      );
    });

    it("if track has invalid title", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_TITLE, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3\n"
      );
    });

    it("if track has invalid BPM", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_BPM, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac\n"
      );
    });

    it("if track has invalid artists", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_ARTISTS, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac\n"
      );
    });

    it("if track has invalid year", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_YEAR, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/03. Гости Из Будущего - Время Песок.flac\n"
      );
    });

    it("if track has invalid bitrate", async () => {
      await init(PATH_TO_INVALID_TRACKS);

      console.log(REPORT_LOW_BITRATE);

      expect(
        await fs.promises.readFile(REPORT_LOW_BITRATE, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3 - 128kbps\n"
      );
    });
  });
});
