import path from "path";
import fs from "fs";
import { describe, expect, jest } from "@jest/globals";
import {
  parseID3V2Array,
  extractFilePathsFromM3U,
  validateM3UfilePaths,
} from "./utils";
import {
  m3uWithAbsolutePaths,
  m3uWithNonLatinChars,
  m3uWithRelativePathsSavedInQuodLibet,
  m3uWithRelativePathsSavedInVLC,
} from "./test-helpers/m3u-playlists";
import { isValidFileExtension } from "./utils";
describe("parseID3V2Array", () => {
  test("given an array of valid string items, returns an array as is", () => {
    const genres = ["Ambient", "Psychedelic Rock", "Jungle"];
    const result = parseID3V2Array(genres);

    expect(result).toEqual(genres);
  });

  test("given an empty array, returns an empty array", () => {
    const result = parseID3V2Array([]);

    expect(result).toEqual([]);
  });

  test("given an array containing duplicates, returns only unique items", () => {
    const result = parseID3V2Array([
      "Ambient",
      "Downtempo",
      "Rock",
      "Downtempo",
      "Rock",
    ]);

    expect(result).toEqual(["Ambient", "Downtempo", "Rock"]);
  });

  test("given an array containing empty string items, filters them out", () => {
    const result = parseID3V2Array([" ", "House", "   ", "Pop", "    "]);

    expect(result).toEqual(["House", "Pop"]);
  });

  test("given an array containing strings with blank spaces around them, returns all items trimmed", () => {
    const result = parseID3V2Array(["   Ambient", "Rock  ", "   House    "]);

    expect(result).toEqual(["Ambient", "Rock", "House"]);
  });
});

describe("isValidFileExtension", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("given a file path with a valid file extension but capitalizied, returns true", () => {
    const ext = "aiff";
    jest.spyOn(path, "extname").mockReturnValue(`.${ext.toUpperCase()}`);

    const result = isValidFileExtension(`/path/to/file/here.${ext}`, [
      ext,
      "mp3",
    ]);

    expect(result).toBe(true);
  });

  test("given a file path with a valid file extension, returns true", () => {
    const ext = "aiff";
    jest.spyOn(path, "extname").mockReturnValue(`.${ext}`);

    const result = isValidFileExtension(`/path/to/file/here.${ext}`, [
      ext,
      "mp3",
    ]);

    expect(result).toBe(true);
  });

  test("given a file path with an invalid file extension, returns false", () => {
    jest.spyOn(path, "extname").mockReturnValue(".ogg");

    const result = isValidFileExtension("/path/to/here.ogg", ["aiff", "mp3"]);

    expect(result).toBe(false);
  });
});

describe("extractFilePathsFromM3U", () => {
  describe("successfully extracts file paths from m3u", () => {
    test("when m3u contains absolute file paths", () => {
      const result = extractFilePathsFromM3U(m3uWithAbsolutePaths.m3u);

      expect(result.length).toBe(m3uWithAbsolutePaths.parsed.length);
      expect(result).toEqual(m3uWithAbsolutePaths.parsed);
    });

    test("when m3u contains file names with non-latin chars", () => {
      const result = extractFilePathsFromM3U(m3uWithNonLatinChars.m3u);

      expect(result.length).toBe(m3uWithNonLatinChars.parsed.length);
      expect(result).toEqual(m3uWithNonLatinChars.parsed);
    });

    test("when m3u has been saved in VLC and contains relative file paths", () => {
      const result = extractFilePathsFromM3U(
        m3uWithRelativePathsSavedInVLC.m3u
      );

      expect(result.length).toBe(m3uWithRelativePathsSavedInVLC.parsed.length);
      expect(result).toEqual(m3uWithRelativePathsSavedInVLC.parsed);
    });

    test("when m3u has been saved in Quod Libet and contains relative file paths", () => {
      const result = extractFilePathsFromM3U(
        m3uWithRelativePathsSavedInQuodLibet.m3u
      );

      expect(result.length).toBe(
        m3uWithRelativePathsSavedInQuodLibet.parsed.length
      );
      expect(result).toEqual(m3uWithRelativePathsSavedInQuodLibet.parsed);
    });
  });
});

describe("validateM3UfilePaths", () => {
  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementationOnce(jest.fn() as any);
    jest.spyOn(console, "error").mockImplementationOnce(jest.fn());
    jest
      .spyOn(fs.promises, "readFile")
      .mockResolvedValue(m3uWithAbsolutePaths.m3u);
  });

  describe("if all paths in m3u exist", () => {
    beforeEach(() => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
    });

    test("returns an array of parsed paths", async () => {
      const result = await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

      expect(result).toEqual(m3uWithAbsolutePaths.parsed);
    });

    it("doesn't exit process", async () => {
      await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

      expect(jest.mocked(process.exit)).toHaveBeenCalledTimes(0);
    });

    it("doesn't print error", async () => {
      await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

      expect(jest.mocked(console.error)).toHaveBeenCalledTimes(0);
    });
  });

  describe("if m3u contains broken paths", () => {
    beforeEach(() => {
      jest.spyOn(fs, "existsSync").mockReturnValue(false);
    });

    test("prints them", async () => {
      await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

      expect(jest.mocked(console.error)).toBeCalledTimes(1);
      expect(jest.mocked(console.error)).toHaveBeenCalledWith(
        `The following M3U file paths are broken:\n\n${m3uWithAbsolutePaths.parsed.join(
          "\n"
        )}`
      );
    });

    test("exits process with error code", async () => {
      await validateM3UfilePaths(m3uWithAbsolutePaths.m3u);

      expect(jest.mocked(process.exit)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1);
    });
  });
});
