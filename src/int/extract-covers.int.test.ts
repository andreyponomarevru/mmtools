import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { BUILD_DIR, EXTRACTED_COVERS_DIR } from "../config/constants";
import { extractCovers } from "../extract-covers/extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/m3u-playlists";
import { clearDir } from "../test-helpers/helpers";
import { mmFacade } from "../music-metadata-facade";

beforeAll(() => clearDir(BUILD_DIR));

describe("extractCovers", () => {
  it("given an array of audio files paths, saves every file's cover to disk", async () => {
    const avoidErrIfDirNotExist = { force: true };
    const rmNestedDirs = { recursive: true };
    await fs.promises.rm(EXTRACTED_COVERS_DIR, {
      ...avoidErrIfDirNotExist,
      ...rmNestedDirs,
    });

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    const savedCovers = await fs.promises.readdir(EXTRACTED_COVERS_DIR);

    expect(savedCovers).toEqual([
      "1_carlos_nio__friends_-_woo_acknowledgement.jpg",
      "2_p_real_-_missing_id3v2_title_tag.jpg",
      "3_miguel_migs_-_so_far_rasmus_fabers_farplane_radio_edit.jpg",
      "4_missing_id3v2_artist_tag_-_the_legend_of_haziz.jpg",
    ]);
  });

  it("parses the track using its relative path", async () => {
    const parseFileSpy = jest.spyOn(mmFacade, "parseFile");

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    expect(parseFileSpy).toBeCalledTimes(4);

    const firstCallArg = parseFileSpy.mock.calls[0][0];
    expect(firstCallArg).toBe(
      "./test-data/music-lib/invalid-tags/Carlos Nino & Friends - Woo, Acknowledgement.flac"
    );

    const secondCallArg = parseFileSpy.mock.calls[1][0];
    expect(secondCallArg).toBe(
      "./test-data/music-lib/invalid-tags/11-p__real__albertas--dedicated_2_u-46dd7eff.mp3"
    );

    const thirdCallArg = parseFileSpy.mock.calls[2][0];
    expect(thirdCallArg).toBe(
      "./test-data/music-lib/valid-tags/Those Things Deluxe (2007)/CD 2/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac"
    );

    const fourthCallArg = parseFileSpy.mock.calls[3][0];
    expect(fourthCallArg).toBe(
      "./test-data/music-lib/invalid-tags/Various - 10/02. The Zenmenn - The Legend Of Haziz.flac"
    );
  });

  describe("throws error", () => {
    test("if cover is absent", async () => {
      jest.spyOn(mmFacade, "parseFile").mockResolvedValue({
        meta: {
          year: undefined,
          title: undefined,
          artists: undefined,
          album: undefined,
          genre: undefined,
          bpm: undefined,
          label: undefined,
          catalognumber: undefined,
          format: undefined,
          bitrate: undefined,
          originaldate: undefined,
        },
        cover: null,
      });

      await expect(
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR)
      ).rejects.toThrow("Track has no cover:");
    });
  });
});
