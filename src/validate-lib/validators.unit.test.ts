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
import { COVER_MIN_SIZE, GENRES } from "../config/constants";

const filePath = "/path/to/file";

jest.mock("fs", () => ({ promises: { appendFile: jest.fn() } }));
const fsAppendFileMock = jest.mocked(fs.promises.appendFile);
jest.mock("image-size");

describe("checkCover", () => {
  const picture = { format: "image/jpeg", data: new Uint8Array() } as IPicture;

  it("doesn't attempt to extract cover if it is absent", async () => {
    await checkCover(filePath, null);

    expect(jest.mocked(sizeof)).not.toBeCalled();
  });

  describe("appends an error to file", () => {
    it("if cover is absent", async () => {
      await checkCover(filePath, null);

      expect(fsAppendFileMock.mock.calls.length).toBe(1);
    });

    it("if cover width and cover height are both less than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE - 1,
        height: COVER_MIN_SIZE - 1,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(1);
    });
  });

  describe("doesn't append an error to file", () => {
    it("if cover height and width are both greater than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE + 1,
        height: COVER_MIN_SIZE + 1,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });

    it("if cover height is greater than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: 0,
        height: COVER_MIN_SIZE + 1,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });

    it("if cover width is greater than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE + 1,
        height: 0,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });

    it("if cover height and width are both equal to COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE,
        height: COVER_MIN_SIZE,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });

    it("if only cover height is less than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE,
        height: COVER_MIN_SIZE - 1,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });

    it("if only cover width is less than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE - 1,
        height: COVER_MIN_SIZE,
      } as any);

      await checkCover(filePath, picture);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });
  });
});

describe("checkBPM", () => {
  describe("doesn't append an error to file", () => {
    it("if BPM is bigger than 0", () => {
      checkBPM(filePath, 88);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });

    it("if BPM is 0", () => {
      checkBPM(filePath, 0);

      expect(fsAppendFileMock.mock.calls.length).toBe(0);
    });
  });

  describe("appends an error to file", () => {
    it("if bpm is undefined", () => {
      checkBPM(filePath, undefined);

      expect(fsAppendFileMock.mock.calls.length).toBe(1);
    });

    it("if bpm is less than 0", () => {
      checkBPM(filePath, -10);

      expect(fsAppendFileMock.mock.calls.length).toBe(1);
    });
  });
});

describe("checkBitrate", () => {
  it("doesn't append an error if bitrate is valid", () => {
    checkBitrate(filePath, 320000);

    expect(fsAppendFileMock.mock.calls.length).toBe(0);
  });

  it("appends an error to file if bitrate is 0", () => {
    checkBitrate(filePath, 0);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends an error to file if bitrate is undefined", () => {
    checkBitrate(filePath, undefined);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends an error to file if bitrate is less than MIN_BITRATE", () => {
    checkBitrate(filePath, -1);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkGenres", () => {
  it("doesn't append an error to file if genre is valid", () => {
    checkGenres(filePath, GENRES);

    expect(fsAppendFileMock.mock.calls.length).toBe(0);
  });

  describe("appends an error to file", () => {
    it("if genre length is 0", () => {
      checkGenres(filePath, []);

      expect(fsAppendFileMock.mock.calls.length).toBe(1);
    });

    it("if unknown genre (i.e. not listed in genres.json)", () => {
      checkGenres(filePath, ["Jogfdopjnjk"]);

      expect(fsAppendFileMock.mock.calls.length).toBe(1);
    });
  });
});

describe("checkTitle", () => {
  it("doesn't append error to file if title is valid", () => {
    checkTitle(filePath, "Track title");

    expect(fsAppendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if title length is 0", () => {
    checkTitle(filePath, "");

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if title is undefined", () => {
    checkTitle(filePath, undefined);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkArtists", () => {
  it("doesn't append error to file if artists length > 0", () => {
    checkArtists(filePath, ["one"]);

    expect(fsAppendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if artists length is 0", () => {
    checkArtists(filePath, []);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });
});

describe("checkYear", () => {
  it("doesn't append error to file if the year is valid", () => {
    checkYear(filePath, 2024);

    expect(fsAppendFileMock.mock.calls.length).toBe(0);
  });

  it("appends error to file if year is undefined", () => {
    checkYear(filePath, undefined);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is 0", () => {
    checkYear(filePath, 0);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is a negative number", () => {
    checkYear(filePath, -1);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is not an integer", () => {
    checkYear(filePath, 2024.5);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is bigger than 2050", () => {
    checkYear(filePath, 2051);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is -Infinity", () => {
    checkYear(filePath, -Infinity);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });

  it("appends error to file if year is +Infinity", () => {
    checkYear(filePath, Infinity);

    expect(fsAppendFileMock.mock.calls.length).toBe(1);
  });
});
