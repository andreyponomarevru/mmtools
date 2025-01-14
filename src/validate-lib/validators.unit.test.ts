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
import {
  COVER_MIN_SIZE,
  GENRES,
  REPORT_BAD_ARTISTS,
  REPORT_BAD_BPM,
  REPORT_BAD_COVERS,
  REPORT_BAD_GENRES,
  REPORT_BAD_TITLE,
  REPORT_BAD_YEAR,
  REPORT_LOW_BITRATE,
} from "../config/constants";

jest.mock("image-size");

describe("checkCover", () => {
  const picture = { format: "", data: new Uint8Array() } as IPicture;

  it("doesn't attempt to extract cover if it is absent", async () => {
    await checkCover(null);

    expect(jest.mocked(sizeof)).not.toBeCalled();
  });

  describe("returns error", () => {
    it("if there is no cover", async () => {
      const result = await checkCover(null);

      expect(result).toEqual({
        logTo: REPORT_BAD_COVERS,
        errors: ["no cover"],
      });
    });

    it("if cover width and cover height are both less than COVER_MIN_SIZE", async () => {
      const width = COVER_MIN_SIZE - 1;
      const height = COVER_MIN_SIZE - 1;
      jest.mocked(sizeof).default.mockReturnValueOnce({ width, height } as any);

      const result = await checkCover(picture);

      expect(result).toEqual({
        logTo: REPORT_BAD_COVERS,
        errors: [`${width} x ${height}`],
      });
    });
  });

  describe("doesn't return error", () => {
    const emptyErr = { logTo: REPORT_BAD_COVERS, errors: [] };

    it("if cover height and width are both greater than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE + 1,
        height: COVER_MIN_SIZE + 1,
      } as any);

      const result = await checkCover(picture);

      expect(result).toEqual(emptyErr);
    });

    it("if cover height is greater than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: 0,
        height: COVER_MIN_SIZE + 1,
      } as any);

      const result = await checkCover(picture);

      expect(result).toEqual(emptyErr);
    });

    it("if cover width is greater than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE + 1,
        height: 0,
      } as any);

      const result = await checkCover(picture);

      expect(result).toEqual(emptyErr);
    });

    it("if cover height and width are both equal to COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE,
        height: COVER_MIN_SIZE,
      } as any);

      const result = await checkCover(picture);

      expect(result).toEqual(emptyErr);
    });

    it("if only cover height is less than COVER_MIN_SIZE", async () => {
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width: COVER_MIN_SIZE,
        height: COVER_MIN_SIZE - 1,
      } as any);

      const result = await checkCover(picture);

      expect(result).toEqual(emptyErr);
    });

    it("if only cover width is less than COVER_MIN_SIZE", async () => {
      const width = COVER_MIN_SIZE - 1;
      const height = COVER_MIN_SIZE;
      jest.mocked(sizeof).default.mockReturnValueOnce({
        width,
        height,
      } as any);

      const result = await checkCover(picture);

      expect(result).toEqual({
        logTo: REPORT_BAD_COVERS,
        errors: [],
      });
    });
  });
});

describe("checkBPM", () => {
  const err = { logTo: REPORT_BAD_BPM, errors: [""] };
  const emptyErr = { logTo: REPORT_BAD_BPM, errors: [] };

  describe("doesn't return error", () => {
    it("if BPM is bigger than 0", () => {
      expect(checkBPM(88)).toEqual(emptyErr);
    });

    it("if BPM is 0", () => {
      expect(checkBPM(0)).toEqual(emptyErr);
    });
  });

  describe("appends an error to file", () => {
    it("if bpm is undefined", () => {
      expect(checkBPM(undefined)).toEqual(err);
    });

    it("if bpm is less than 0", () => {
      expect(checkBPM(-10)).toEqual(err);
    });
  });
});

describe("checkBitrate", () => {
  const emptyErr = { logTo: REPORT_LOW_BITRATE, errors: [] };

  it("doesn't return error if bitrate is valid", () => {
    expect(checkBitrate(320000)).toEqual(emptyErr);
  });

  it("returns error if bitrate is 0", () => {
    expect(checkBitrate(0)).toEqual({
      logTo: REPORT_LOW_BITRATE,
      errors: ["0kbps"],
    });
  });

  it("returns error if bitrate is undefined", () => {
    expect(checkBitrate(undefined)).toEqual({
      logTo: REPORT_LOW_BITRATE,
      errors: ["0kbps"],
    });
  });

  it("returns error if bitrate is less than MIN_BITRATE", () => {
    const bpm = -1;
    expect(checkBitrate(bpm)).toEqual({
      logTo: REPORT_LOW_BITRATE,
      errors: [`${bpm / 1000}kbps`],
    });
  });
});

describe("checkGenres", () => {
  it("doesn't return error if genre is valid", () => {
    expect(checkGenres(GENRES)).toEqual({
      logTo: REPORT_BAD_GENRES,
      errors: [],
    });
  });

  describe("returns error", () => {
    it("if genre length is 0", () => {
      expect(checkGenres([])).toEqual({
        logTo: REPORT_BAD_GENRES,
        errors: ["no genre :("],
      });
    });

    it("if unknown genre (i.e. not listed in genres.json)", () => {
      expect(checkGenres(["Jogfdopjnjk"])).toEqual({
        logTo: REPORT_BAD_GENRES,
        errors: ["Jogfdopjnjk"],
      });
    });
  });
});

describe("checkTitle", () => {
  const err = { logTo: REPORT_BAD_TITLE, errors: [""] };
  const emptyErr = { logTo: REPORT_BAD_TITLE, errors: [] };

  it("doesn't return error if title is valid", () => {
    expect(checkTitle("Track title")).toEqual(emptyErr);
  });

  it("retruns error if title length is 0", () => {
    expect(checkTitle("")).toEqual(err);
  });

  it("returns error if title is undefined", () => {
    expect(checkTitle(undefined)).toEqual(err);
  });
});

describe("checkArtists", () => {
  const err = { logTo: REPORT_BAD_ARTISTS, errors: [""] };
  const emptyErr = { logTo: REPORT_BAD_ARTISTS, errors: [] };

  it("doesn't return error if artists length > 0", () => {
    expect(checkArtists(["one"])).toEqual(emptyErr);
  });

  it("returns error if artists length is 0", () => {
    expect(checkArtists([])).toEqual(err);
  });
});

describe("checkYear", () => {
  const err = { logTo: REPORT_BAD_YEAR, errors: [""] };
  const emptyErr = { logTo: REPORT_BAD_YEAR, errors: [] };

  it("doesn't return error if the year is valid", () => {
    expect(checkYear(2024)).toEqual(emptyErr);
  });

  describe("returns error", () => {
    it.concurrent.each([
      [undefined, err],
      [0, err],
      [-1, err],
      [2024.5, err],
      [2051, err],
      [-Infinity, err],
      [Infinity, err],
    ])("if the year is %i)", async (arg, expected) => {
      expect(checkYear(arg)).toEqual(expected);
    });
  });
});
