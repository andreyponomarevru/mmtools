import fs from "fs";
import { ICommonTagsResult, IFormat } from "music-metadata";
import * as sizeof from "image-size";
import { describe, expect, it, jest } from "@jest/globals";
import { extractCovers } from "./extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/playlists";
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
  it("throws error if cover is absent", async () => {
    const parsedTrack = {
      meta: {} as TracklistLineMeta,
      cover: null,
    };
    const parsedCover = {
      width: COVER_MIN_SIZE,
      height: COVER_MIN_SIZE,
      type: "jpg",
    };
    jest.mocked(mmFacade.parseFile).mockResolvedValue(parsedTrack as any);
    jest.mocked(sizeof.default).mockImplementationOnce(parsedCover as any);

    const result = () =>
      extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(result).rejects.toThrow("Track has no cover:");
  });

  it("throws error if cover width and height are both less than COVER_MIN_SIZE", async () => {
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

  it("throws error if cover size can't be determined", async () => {
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

  it("writes every track's cover from m3u playlist to disk if it exists and it's size is valid", async () => {
    const parsedTrack = {
      meta: {
        artists: ["Artist name 1", "Artist name 2"],
        title: "Song Title",
      } as TracklistLineMeta,
      cover: { format: "", data: Buffer.from([]) },
    };
    const parsedCover = {
      width: COVER_MIN_SIZE,
      height: COVER_MIN_SIZE,
      type: "jpg",
    };
    jest.mocked(mmFacade).parseFile.mockResolvedValue(parsedTrack as any);
    jest.mocked(sizeof).default.mockReturnValue(parsedCover as any);
    const writeFIleSpy = jest
      .spyOn(fs.promises, "writeFile")
      .mockImplementationOnce(() => Promise.resolve());

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(writeFIleSpy.mock.calls.length).toBe(
      m3uWithAbsolutePaths.parsed.length
    );
  });
});
