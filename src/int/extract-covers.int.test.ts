import fs from "fs";
import { describe, expect, it } from "@jest/globals";
import { EXTRACTED_COVERS_DIR } from "../config";
import { extractCovers } from "../extract-covers/extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/m3u-playlists";

describe("extractCovers", () => {
  it("writes every track's cover from m3u playlist to disk", async () => {
    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    const savedCovers = await fs.promises.readdir(EXTRACTED_COVERS_DIR);
    //expect(savedCovers.length).toBe(4);
    console.log("-------------------------------", savedCovers);

    /*expect(savedCovers).toEqual(`${EXTRACTED_COVERS_DIR}/1 ${parsedTrack.meta.artists?.join(" ")} - ${
          parsedTrack.meta.title
        }.jpg`,
        */
    /*
        `${EXTRACTED_COVERS_DIR}/2 ${parsedTrack.meta.artists?.join(" ")} - ${
          parsedTrack.meta.title
        }.jpg`,
        `${EXTRACTED_COVERS_DIR}/3 ${parsedTrack.meta.artists?.join(" ")} - ${
          parsedTrack.meta.title
        }.jpg`,
              `${EXTRACTED_COVERS_DIR}/4 ${parsedTrack.meta.artists?.join(" ")} - ${
          parsedTrack.meta.title
        }.jpg`*/
  });
});
