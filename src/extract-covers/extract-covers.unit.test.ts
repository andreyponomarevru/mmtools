import fs from "fs";
import path from "path";
import sizeof from "image-size";
import { describe, expect, it, jest } from "@jest/globals";
import { extractCovers } from "./extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/m3u-playlists";
import { COVER_MIN_SIZE, EXTRACTED_COVERS_DIR } from "../config/constants";
import { mmFacade } from "../music-metadata-facade";

jest.mock("../music-metadata-facade");
jest.mock("image-size");
jest.mock("fs", () => ({
  promises: { mkdir: jest.fn(), writeFile: jest.fn() },
}));
jest.mock("path");
jest.mock("process");

describe("extractCovers", () => {
  const measuredCover = {
    width: COVER_MIN_SIZE,
    height: COVER_MIN_SIZE,
    type: "jpg",
  };
  const emptyMetadata = {
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
  };
  const parsedCover = { format: "", data: Buffer.from([]) };

  describe("throws error", () => {
    test("if cover width and height are both less than COVER_MIN_SIZE", async () => {
      jest.mocked(mmFacade).parseFile.mockResolvedValue({
        meta: { ...emptyMetadata },
        cover: { ...parsedCover },
      });
      jest.mocked(sizeof).mockReturnValue({
        width: COVER_MIN_SIZE - 1,
        height: COVER_MIN_SIZE - 1,
        type: "jpg",
      } as any);

      await expect(
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR)
      ).rejects.toThrow("The cover is too small:");
    });

    test("if cover size can't be determined", async () => {
      jest.mocked(mmFacade.parseFile).mockResolvedValue({
        meta: { ...emptyMetadata },
        cover: { ...parsedCover },
      });
      jest.mocked(sizeof).mockReturnValue({
        width: undefined,
        height: undefined,
        type: undefined,
      } as any);

      await expect(
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR)
      ).rejects.toThrow("Can't read image dimensions");
    });
  });

  it("strips non-safe chars from file name if they are present", async () => {
    const nonSafeChars = "()`~!@#$%^&*-+=|\\{}[]:;\"'<>,.?/_";

    jest.mocked(mmFacade.parseFile).mockResolvedValue({
      meta: {
        year: undefined,
        title: `Papua New Guinea (Remix Test${nonSafeChars}test)`,
        artists: [`The ${nonSafeChars}Future So${nonSafeChars}und Of London`],
        album: undefined,
        genre: undefined,
        bpm: undefined,
        label: undefined,
        catalognumber: undefined,
        format: undefined,
        bitrate: undefined,
        originaldate: undefined,
      },
      cover: { ...parsedCover },
    });
    jest.mocked(sizeof).mockReturnValue(measuredCover as any);
    const writeFileSpy = jest.mocked(fs.promises.writeFile);

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(writeFileSpy.mock.calls[0][0]).toBe(
      `${EXTRACTED_COVERS_DIR}/1_the_-future_so-und_of_london_-_papua_new_guinea_remix_test-test.${measuredCover.type}`
    );
  });
});
