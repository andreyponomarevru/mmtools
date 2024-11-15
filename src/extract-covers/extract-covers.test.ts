import path from "path";
import util from "util";
import fs, { writeFileSync } from "fs";
import { ICommonTagsResult, IFormat } from "music-metadata";
import * as sizeof from "image-size";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import { extractCovers } from "./extract-covers";
import { m3uWithAbsolutePaths } from "../test-helpers/playlists";
import { COVER_MIN_SIZE, EXTRACTED_COVERS_DIR } from "../config";
import { mmFacade } from "../music-metadata-facade";
import { processBrokenM3Upaths, validateM3UfilePaths } from "../utils";

jest.mock("../utils", () => {
  const originalModule =
    jest.requireActual<typeof import("../utils")>("../utils");
  return {
    ...originalModule,
    processBrokenM3Upaths: jest.fn(),
    validateM3UfilePaths: jest.fn(),
  };
});
jest.mock("../music-metadata-facade");
jest.mock("image-size");
jest.mock("fs", () => {
  const originalModule = jest.requireActual<typeof import("fs")>("fs");
  return { ...originalModule, writeFileSync: jest.fn() };
});

describe("init", () => {});

describe("extractCovers", () => {
  it("throws error if cover is absent", async () => {
    jest.mocked(mmFacade).parseFile.mockResolvedValue({
      meta: {} as ICommonTagsResult & IFormat,
      cover: null,
    });
    jest.mocked(sizeof).default.mockImplementation(
      () =>
        ({
          width: COVER_MIN_SIZE,
          height: COVER_MIN_SIZE,
          type: "jpg",
        } as any)
    );

    const result = () =>
      extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(result).rejects.toThrow("Track has no cover:");
  });

  it("throws error if cover width and height are both less than COVER_MIN_SIZE", async () => {
    jest.mocked(mmFacade).parseFile.mockResolvedValue({
      meta: {} as ICommonTagsResult & IFormat,
      cover: { format: "", data: Buffer.from([]) },
    });
    jest.mocked(sizeof).default.mockImplementation(
      () =>
        ({
          width: COVER_MIN_SIZE - 1,
          height: COVER_MIN_SIZE - 1,
          type: "jpg",
        } as any)
    );

    const result = () =>
      extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(result).rejects.toThrow("The cover is too small:");
  });

  it("throws error if cover size can't be determined", async () => {
    jest.mocked(mmFacade).parseFile.mockResolvedValue({
      meta: {} as ICommonTagsResult & IFormat,
      cover: { format: "", data: Buffer.from([]) },
    });
    jest.mocked(sizeof).default.mockImplementation(
      () =>
        ({
          width: undefined,
          height: undefined,
          type: undefined,
        } as any)
    );

    const result = () =>
      extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(result).rejects.toThrow("Can't read image dimensions");
  });

  it("writes every cover from m3u playlist to disk if it exists and it's size is valid", async () => {
    jest.mocked(mmFacade).parseFile.mockResolvedValue({
      meta: {
        artists: ["Artist name 1", "Artist name 2"],
        title: "Song Title",
      } as ICommonTagsResult & IFormat,
      cover: { format: "", data: Buffer.from([]) },
    });
    jest.mocked(sizeof).default.mockReturnValue({
      width: COVER_MIN_SIZE,
      height: COVER_MIN_SIZE,
      type: "jpg",
    } as any);
    const writeFIleSpy = jest
      .spyOn(fs.promises, "writeFile")
      .mockImplementation(() => Promise.resolve());

    await extractCovers(m3uWithAbsolutePaths.parsed, EXTRACTED_COVERS_DIR);

    await expect(writeFIleSpy.mock.calls.length).toBe(
      m3uWithAbsolutePaths.parsed.length
    );
  });
});
