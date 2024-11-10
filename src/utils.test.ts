import path from "path";
import util from "util";
import fs from "fs";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import {
  parseID3V2Array,
  traverseDirs,
  extractFilePathsFromM3U,
  validateM3UfilePaths,
  processBrokenM3Upaths,
  isValidFileExtension,
} from "./utils";
import {
  m3uWithAbsolutePaths,
  m3uWithNonLatinChars,
  m3uWithRelativePathsSavedInQuodLibet,
  m3uWithRelativePathsSavedInVLC,
} from "./test-helpers/playlists";

jest.mock("./validate-lib/config", () => {
  const originalModule = jest.requireActual<
    typeof import("./validate-lib/config")
  >("./validate-lib/config");

  return {
    ...originalModule,
    SUPPORTED_CODEC: ["aiff", "mp3"],
  };
});

describe("parseID3V2Array", () => {
  it("returns an array parsed", () => {
    const genres = ["Ambient", "Psychedelic Rock", "Jungle"];
    const result = parseID3V2Array(genres);

    expect(result).toEqual(genres);
  });

  describe("returns an array which", () => {
    it("is empty if empty array is passed", () => {
      const result = parseID3V2Array([]);

      expect(result).toEqual([]);
    });

    it("contains only unique items, if an array containing duplicates is passed", () => {
      const result = parseID3V2Array([
        "Ambient",
        "Downtempo",
        "Rock",
        "Downtempo",
        "Rock",
      ]);

      expect(result).toEqual(["Ambient", "Downtempo", "Rock"]);
    });

    it("doesn't contain an empty string items", () => {
      const result = parseID3V2Array([" ", "House", "   ", "Pop", "    "]);

      expect(result).toEqual(["House", "Pop"]);
    });

    it("contains all items trimmed, if there are blank spaces around string", () => {
      const result = parseID3V2Array(["   Ambient", "Rock  ", "   House    "]);

      expect(result).toEqual(["Ambient", "Rock", "House"]);
    });
  });
});

describe("isValidFileExtension", () => {
  it("returns 'true' if the file extension is valid", () => {
    jest.spyOn(path, "extname").mockReturnValue(".aiff");

    // TODO mock SUPPORTED_CODEC

    const result = isValidFileExtension("/path/to/file/here.aiff");

    expect(result).toBe(true);
  });

  it("returns 'false' if the file extension is invalid", () => {
    jest.spyOn(path, "extname").mockReturnValue(".ogg");

    const result = isValidFileExtension("/path/to/here.ogg");

    expect(result).toBe(false);
  });
});

describe("extractFilePathsFromM3U", () => {
  describe("extracts file paths from m3u", () => {
    it("when m3u contains absolute file paths", () => {
      const result = extractFilePathsFromM3U(m3uWithAbsolutePaths.m3u);

      expect(result.length).toBe(12);
      expect(result).toEqual(m3uWithAbsolutePaths.parsed);
    });

    it("when m3u contains file names with non-latin chars", () => {
      const result = extractFilePathsFromM3U(m3uWithNonLatinChars.m3u);

      expect(result.length).toBe(12);
      expect(result).toEqual(m3uWithNonLatinChars.parsed);
    });

    it("when m3u has been saved in VLC and contains relative file paths", () => {
      const result = extractFilePathsFromM3U(
        m3uWithRelativePathsSavedInVLC.m3u
      );

      expect(result.length).toBe(3);
      expect(result).toEqual(m3uWithRelativePathsSavedInVLC.parsed);
    });

    it("when m3u has been saved in Quod Libet and contains relative file paths", () => {
      const result = extractFilePathsFromM3U(
        m3uWithRelativePathsSavedInQuodLibet.m3u
      );

      expect(result.length).toBe(4);
      expect(result).toEqual(m3uWithRelativePathsSavedInQuodLibet.parsed);
    });
  });
});

describe("validateM3UfilePaths", () => {
  it("if file(s) exist, returns file paths as valid", async () => {
    jest
      .spyOn(fs.promises, "readFile")
      .mockResolvedValue(m3uWithAbsolutePaths.m3u);
    jest.spyOn(fs, "existsSync").mockReturnValue(true);

    const result = await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

    expect(result).toEqual({ broken: [], ok: m3uWithAbsolutePaths.parsed });
  });

  it("if file(s) don't exist, returns file paths as broken", async () => {
    jest
      .spyOn(fs.promises, "readFile")
      .mockResolvedValue(m3uWithAbsolutePaths.m3u);
    jest.spyOn(fs, "existsSync").mockReturnValue(false);

    const result = await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

    expect(result).toEqual({ broken: m3uWithAbsolutePaths.parsed, ok: [] });
  });
});

describe("processBrokenM3Upaths", () => {
  it("if there are broken paths found, exits process", () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((number) => {
        throw new Error("process.exit: " + number);
      });

    expect(() => {
      processBrokenM3Upaths({ broken: ["/a/b/c", "/d/e/f"], ok: ["/g/h"] });
    }).toThrow();
    expect(mockExit.mock.calls.length).toBe(1);
  });

  it("if there are no broken paths found, returns valid paths as array", () => {
    jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error();
    });
    const validPaths = ["/a/b/c", "/d/e/f", "/g/h/i"];

    const result = processBrokenM3Upaths({ broken: [], ok: validPaths });

    expect(result).toEqual(validPaths);
  });
});
