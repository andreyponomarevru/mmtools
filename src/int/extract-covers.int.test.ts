import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { EXTRACTED_COVERS_DIR } from "../config";
import { extractCovers } from "../extract-covers/extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/m3u-playlists";

describe("extractCovers", () => {
  it("given an array of audio files paths, saves every file's cover to disk", async () => {
    await fs.promises.rm(EXTRACTED_COVERS_DIR, { recursive: true });

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    const savedCovers = await fs.promises.readdir(EXTRACTED_COVERS_DIR);

    expect(savedCovers).toEqual([
      "1 carlos nio  friends - woo acknowledgement.jpg",
      "2 p real - undefined.jpg",
      "3 miguel migs - so far rasmus fabers farplane radio edit.jpg",
      "4 undefined - the legend of haziz.jpg",
    ]);
  });
});
