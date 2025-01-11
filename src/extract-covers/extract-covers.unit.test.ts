import fs from "fs";
import * as sizeof from "image-size";
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

describe("extractCovers", () => {
  const measuredCover = {
    width: COVER_MIN_SIZE,
    height: COVER_MIN_SIZE,
    type: "jpg",
  };
  const parsedTrack: Awaited<ReturnType<typeof mmFacade.parseFile>> = {
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
  };
  const parsedCover = { format: "", data: Buffer.from([]) };

  describe("throws error", () => {
    test("if cover is absent", async () => {
      jest.mocked(mmFacade.parseFile).mockResolvedValue(parsedTrack);
      jest.mocked(sizeof.default).mockImplementationOnce(parsedCover as any);

      const result = () =>
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

      await expect(result).rejects.toThrow("Track has no cover:");
    });

    test("if cover width and height are both less than COVER_MIN_SIZE", async () => {
      jest.mocked(mmFacade).parseFile.mockResolvedValue({
        ...parsedTrack,
        cover: { ...parsedCover },
      });
      jest.mocked(sizeof).default.mockReturnValue({
        width: COVER_MIN_SIZE - 1,
        height: COVER_MIN_SIZE - 1,
        type: "jpg",
      } as any);

      const result = () =>
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

      await expect(result).rejects.toThrow("The cover is too small:");
    });

    test("if cover size can't be determined", async () => {
      jest.mocked(mmFacade.parseFile).mockResolvedValue({
        ...parsedTrack,
        cover: { ...parsedCover },
      });
      jest.mocked(sizeof.default).mockReturnValue({
        width: undefined,
        height: undefined,
        type: undefined,
      } as any);

      const result = () =>
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

      await expect(result).rejects.toThrow("Can't read image dimensions");
    });
  });

  it("strips non-safe chars from file name if they are present", async () => {
    const nonSafeChars = "()`~!@#$%^&*-+=|\\{}[]:;\"'<>,.?/_";

    jest.mocked(mmFacade.parseFile).mockResolvedValue({
      meta: {
        ...parsedTrack.meta,
        artists: [`The ${nonSafeChars}Future So${nonSafeChars}und Of London`],
        title: `Papua New Guinea (Remix Test${nonSafeChars}test)`,
      },
      cover: { ...parsedCover },
    });
    jest.mocked(sizeof).default.mockReturnValue(measuredCover as any);
    const writeFileSpy = jest.mocked(fs.promises.writeFile);

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(writeFileSpy.mock.calls[0][0]).toBe(
      `${EXTRACTED_COVERS_DIR}/1 the -future so-und of london - papua new guinea remix test-test.${measuredCover.type}`
    );
  });
});
