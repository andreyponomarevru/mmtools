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

      expect(result).toEqual(m3uWithAbsolutePaths.parsed);
    });

    test("when m3u contains file names with non-latin chars", () => {
      const m3uWithNonLatinChars = {
        m3u: `
          #EXTM3U
          #EXTINF:1,Sunju Hargun - ٹرانس
          file:///path/to/music-lib/-%20%2001%20%D9%B9%D8%B1%D8%A7%D9%86%D8%B3.aiff
          #EXTINF:1,Sandspider - 1.19
          file:///path/to/music-lib/02.%20Sandspider%20-%201.19.flac
          #EXTINF:1,Khun Fluff - วิญญาณ (Full Circle's Lost In Translation Remix)
          file:///path/to/music-lib/03%20%E0%B8%A7%E0%B8%B4%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%93%20(Full%20Circle's%20Lost%20In%20Translation%20Remix).aiff
          #EXTINF:1,Гости из будущего - Время Песок
          file:///path/to/music-lib/03.%20%D0%93%D0%BE%D1%81%D1%82%D0%B8%20%D0%98%D0%B7%20%D0%91%D1%83%D0%B4%D1%83%D1%89%D0%B5%D0%B3%D0%BE%20-%20%D0%92%D1%80%D0%B5%D0%BC%D1%8F%20%D0%9F%D0%B5%D1%81%D0%BE%D0%BA.flac
          #EXTINF:1,Nmesh - 心はシダであります
          file:///path/to/music-lib/Nmesh%20-%20%E3%83%AD%E3%82%B9%E3%83%88%E3%82%A8%E3%83%87%E3%83%B3%E3%81%B8%E3%81%AE%E3%83%91%E3%82%B9%20-%2006%20%E5%BF%83%E3%81%AF%E3%82%B7%E3%83%80%E3%81%A7%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99.flac
          #EXTINF:1,Carlos Niño & Friends - Woo, Acknowledgement
          file:///path/to/music-lib/Carlos%20Nino%20&%20Friends%20-%20Woo,%20Acknowledgement.flac`,
        parsed: [
          "/path/to/music-lib/-  01 ٹرانس.aiff",
          "/path/to/music-lib/02. Sandspider - 1.19.flac",
          "/path/to/music-lib/03 วิญญาณ (Full Circle's Lost In Translation Remix).aiff",
          "/path/to/music-lib/03. Гости Из Будущего - Время Песок.flac",
          "/path/to/music-lib/Nmesh - ロストエデンへのパス - 06 心はシダであります.flac",
          "/path/to/music-lib/Carlos Nino & Friends - Woo, Acknowledgement.flac",
        ],
      };

      const result = extractFilePathsFromM3U(m3uWithNonLatinChars.m3u);

      expect(result).toEqual(m3uWithNonLatinChars.parsed);
    });

    test("when m3u has been saved in VLC and contains relative file paths", () => {
      const result = extractFilePathsFromM3U(
        m3uWithRelativePathsSavedInVLC.m3u
      );

      expect(result).toEqual(m3uWithRelativePathsSavedInVLC.parsed);
    });

    test("when m3u has been saved in Quod Libet and contains relative file paths", () => {
      const m3uWithRelativePathsSavedInQuodLibet = {
        m3u: `
          #EXTM3U
          #EXTINF:1,Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit)
          ../music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac`,
        parsed: [
          "../music-lib/06 - Miguel Migs - So Far (Rasmus Faber’s Farplane radio edit) [16-44].flac",
        ],
      };

      const result = extractFilePathsFromM3U(
        m3uWithRelativePathsSavedInQuodLibet.m3u
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
