import fs from "fs";
import * as sizeof from "image-size";
import { describe, expect, it, jest } from "@jest/globals";
import { extractCovers } from "./extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/m3u-playlists";
import { COVER_MIN_SIZE, EXTRACTED_COVERS_DIR } from "../config";
import { mmFacade } from "../music-metadata-facade";
import { TracklistLineMeta } from "../m3u-to-tracklist/m3u-to-tracklist";

jest.mock("../music-metadata-facade");
jest.mock("image-size");
jest.mock("fs", () => {
  // requireActual is used to restore the original writeFileSync function because it is used in test-helpers/playlists/index.ts and we don't want to mock it in that file
  const originalModule = jest.requireActual<typeof import("fs")>("fs");
  return { ...originalModule, writeFileSync: jest.fn() };
});

describe("extractCovers", () => {
  const parsedCover = {
    width: COVER_MIN_SIZE,
    height: COVER_MIN_SIZE,
    type: "jpg",
  };

  describe("throws error", () => {
    it("if cover is absent", async () => {
      const parsedTrack = {
        meta: {} as TracklistLineMeta,
        cover: null,
      };

      jest.mocked(mmFacade.parseFile).mockResolvedValue(parsedTrack as any);
      jest.mocked(sizeof.default).mockImplementationOnce(parsedCover as any);

      const result = () =>
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

      await expect(result).rejects.toThrow("Track has no cover:");
    });

    it("if cover width and height are both less than COVER_MIN_SIZE", async () => {
      const parsedTrack = {
        meta: {} as TracklistLineMeta,
        cover: { format: "", data: Buffer.from([]) },
      };
      const parsedCover = {
        width: COVER_MIN_SIZE - 1,
        height: COVER_MIN_SIZE - 1,
        type: "jpg",
      };
      jest.mocked(mmFacade).parseFile.mockResolvedValue(parsedTrack as any);
      jest.mocked(sizeof).default.mockReturnValue(parsedCover as any);

      const result = () =>
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

      await expect(result).rejects.toThrow("The cover is too small:");
    });

    it("if cover size can't be determined", async () => {
      const parsedTrack = {
        meta: {} as TracklistLineMeta,
        cover: { format: "", data: Buffer.from([]) },
      };
      const parsedCover = {
        width: undefined,
        height: undefined,
        type: undefined,
      };
      jest.mocked(mmFacade).parseFile.mockResolvedValue(parsedTrack as any);
      jest.mocked(sizeof).default.mockReturnValue(parsedCover as any);

      const result = () =>
        extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

      await expect(result).rejects.toThrow("Can't read image dimensions");
    });
  });

  it("strips non-safe chars from file name", async () => {
    const nonSafeChars = "()`~!@#$%^&*-+=|\\{}[]:;\"'<>,.?/_";
    const parsedTrack = {
      meta: {
        artists: [`The Future So${nonSafeChars}und Of London`],
        title: `Papua New Guinea (Remix Test${nonSafeChars}test)`,
      } as TracklistLineMeta,
      cover: { format: "", data: Buffer.from([]) },
    };
    jest.mocked(mmFacade).parseFile.mockResolvedValue(parsedTrack as any);
    jest.mocked(sizeof).default.mockReturnValue(parsedCover as any);
    const writeFileSpy = jest
      .spyOn(fs.promises, "writeFile")
      .mockImplementationOnce(() => Promise.resolve());

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(writeFileSpy.mock.calls[0][0]).toBe(
      `${EXTRACTED_COVERS_DIR}/1 The Future So-und Of London - Papua New Guinea Remix Test-test.${parsedCover.type}`
    );
  });
});
