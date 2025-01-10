import path from "path";
import util from "util";
import fs from "fs";
import * as sizeof from "image-size";
import { IPicture } from "music-metadata";
import { describe, expect, it, jest } from "@jest/globals";
import {
  checkYear,
  checkArtists,
  checkBPM,
  checkBitrate,
  checkCover,
  checkGenres,
  checkTitle,
} from "./validators";
import { COVER_MIN_SIZE, GENRES } from "../config";

const filePath = "/path/to/file";

jest.mock("image-size");

describe("checkCover", () => {
  const picture = {
    format: "image/jpeg",
    data: new Uint8Array(),
  } as IPicture;

  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("appends error to file if cover is absent", async () => {
    await checkCover(filePath, null);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if cover width and height can't be determined", async () => {
    jest.spyOn(fs.promises, "appendFile").mockResolvedValueOnce();
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: undefined,
      height: undefined,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("doesn't append error to file if cover height and width are both greater than COVER_MIN_SIZE", async () => {
    const appendFileSpy = jest
      .spyOn(fs.promises, "appendFile")
      .mockResolvedValueOnce();
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: COVER_MIN_SIZE + 1,
      height: COVER_MIN_SIZE + 1,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileSpy.mock.calls.length).toBe(0);
  });

  it("doesn't append error to file if cover height is greater than COVER_MIN_SIZE", async () => {
    const appendFileSpy = jest
      .spyOn(fs.promises, "appendFile")
      .mockResolvedValueOnce();
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: 0,
      height: COVER_MIN_SIZE + 1,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileSpy.mock.calls.length).toBe(0);
  });

  it("doesn't append error to file if cover width is greater than COVER_MIN_SIZE", async () => {
    const appendFileSpy = jest
      .spyOn(fs.promises, "appendFile")
      .mockResolvedValueOnce();
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: COVER_MIN_SIZE + 1,
      height: 0,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileSpy.mock.calls.length).toBe(0);
  });

  it("doesn't append error to file if cover height and width are both equal to COVER_MIN_SIZE", async () => {
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: COVER_MIN_SIZE,
      height: COVER_MIN_SIZE,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("doesn't appends error to file if only cover height is less than COVER_MIN_SIZE", async () => {
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: COVER_MIN_SIZE,
      height: COVER_MIN_SIZE - 1,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("doesn't append error to file if only cover width is less than COVER_MIN_SIZE", async () => {
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: COVER_MIN_SIZE - 1,
      height: COVER_MIN_SIZE,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if cover width and cover height are both less than COVER_MIN_SIZE", async () => {
    jest.mocked(sizeof).default.mockReturnValueOnce({
      width: COVER_MIN_SIZE - 1,
      height: COVER_MIN_SIZE - 1,
    } as any);

    await checkCover(filePath, picture);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkBPM", () => {
  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("doesn't append an error if BPM is bigger than 0", () => {
    checkBPM(filePath, 88);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("doesn't append an error if BPM is 0", () => {
    checkBPM(filePath, 0);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if bpm is undefined", () => {
    checkBPM(filePath, undefined);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if bpm is less than 0", () => {
    checkBPM(filePath, -10);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkBitrate", () => {
  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("doesn't append an error if bitrate is valid", () => {
    checkBitrate(filePath, 320000);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if bitrate is 0", () => {
    checkBitrate(filePath, 0);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if bitrate is undefined", () => {
    checkBitrate(filePath, undefined);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if bitrate is less than MIN_BITRATE", () => {
    checkBitrate(filePath, -1);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkGenres", () => {
  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("doesn't append error to file if genre is valid", () => {
    checkGenres(filePath, GENRES);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file, if genre length is 0", () => {
    checkGenres(filePath, []);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file, if unknown genre (i.e. not listed in genres.json)", () => {
    checkGenres(filePath, ["Jogfdopjnjk"]);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkTitle", () => {
  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("doesn't append error to file if title is valid", () => {
    checkTitle(filePath, "Track title");

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if title length is 0", () => {
    checkTitle(filePath, "");

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if title is undefined", () => {
    checkTitle(filePath, undefined);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkArtists", () => {
  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("doesn't append error to file if artists length > 0", () => {
    checkArtists(filePath, ["one"]);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if artists length is 0", () => {
    checkArtists(filePath, []);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkYear", () => {
  let appendFileMock: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    appendFileMock = jest
      .spyOn(fs.promises, "appendFile")
      .mockImplementationOnce(() => Promise.resolve());
  });

  it("doesn't append error to file if the year is valid", () => {
    checkYear(filePath, 2024);

    expect(appendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if year is undefined", () => {
    checkYear(filePath, undefined);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is 0", () => {
    checkYear(filePath, 0);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is a negative number", () => {
    checkYear(filePath, -1);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is not an integer", () => {
    checkYear(filePath, 2024.5);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is bigger than 2050", () => {
    checkYear(filePath, 2051);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is -Infinity", () => {
    checkYear(filePath, -Infinity);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is +Infinity", () => {
    checkYear(filePath, Infinity);

    expect(appendFileMock.mock.calls.length).toBe(1);
  });
});
