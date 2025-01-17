import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { BUILD_DIR, EXTRACTED_COVERS_DIR } from "../config/constants";
import { extractCovers } from "../extract-covers/extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/m3u-playlists";
import { clearDir } from "../test-helpers/helpers";

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
      "2_p_real_-_undefined.jpg",
      "3_miguel_migs_-_so_far_rasmus_fabers_farplane_radio_edit.jpg",
      "4_undefined_-_the_legend_of_haziz.jpg",
    ]);
  });
});
