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
  REPORT_NO_BPM,
  REPORTS_DIR,
} from "../config";
import { isPathExists } from "../test-helpers/helpers";

const PATH_TO_INVALID_TRACKS = "./test-data/music-lib/invalid-tags";
const PATH_TO_VALID_TRACKS = "./test-data/music-lib/valid-tags";

describe("validates library", () => {
  it("creates .log file for each type of library constraint", async () => {
    await fs.promises.rm(REPORTS_DIR, { force: true, recursive: true });

    expect(await isPathExists(REPORTS_DIR)).toBe(false);

    await init("./test-data/music-lib");

    expect(await isPathExists(REPORTS_DIR)).toBe(true);

    const reportsDir = await fs.promises.readdir(REPORTS_DIR);
    expect(reportsDir.length).toBe(7);

    const fileNames = [
      REPORT_BAD_ARTISTS,
      REPORT_BAD_COVERS,
      REPORT_BAD_GENRES,
      REPORT_BAD_TITLE,
      REPORT_BAD_YEAR,
      REPORT_LOW_BITRATE,
      REPORT_NO_BPM,
    ]
      .map((str) => path.basename(str))
      .sort();
    expect(reportsDir.sort()).toEqual(fileNames);
  });

  it("doesn't create .log files if there are no invalid ID3 tags", async () => {
    await fs.promises.rm(REPORTS_DIR, { force: true, recursive: true });

    expect(await isPathExists(REPORTS_DIR)).toBe(false);

    await init(PATH_TO_VALID_TRACKS);

    const reportsDir = await fs.promises.readdir(REPORTS_DIR);
    expect(reportsDir.length).toBe(0);
  });

  describe(`writes error to ${REPORT_BAD_COVERS} if track has`, () => {
    beforeEach(async () => {
      await fs.promises.rm(REPORTS_DIR, { force: true, recursive: true });
    });

    it(`invalid cover`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_COVERS, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/03. Гости Из Будущего - Время Песок.flac - no cover\n"
      );
    });

    it(`invalid genre`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_GENRES, {
          encoding: "utf-8",
        })
      ).toBe(
        `test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3 - Invalid Genre\ntest-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac - Hurum\ntest-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac - Burum\n`
      );
    });

    it(`invalid title`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_TITLE, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3\n"
      );
    });

    it(`invalid BPM`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_NO_BPM, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac\n"
      );
    });

    it(`invalid artists`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_ARTISTS, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac\n"
      );
    });

    it(`invalid year`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_BAD_YEAR, { encoding: "utf-8" })
      ).toBe(
        "test-data/music-lib/invalid-tags/03. Гости Из Будущего - Время Песок.flac - undefined\n"
      );
    });

    it(`invalid bitrate`, async () => {
      expect(await isPathExists(REPORTS_DIR)).toBe(false);

      await init(PATH_TO_INVALID_TRACKS);

      expect(
        await fs.promises.readFile(REPORT_LOW_BITRATE, { encoding: "utf-8" })
      ).toBe(
        "128kbps - test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3\n"
      );
    });
  });
});
