import path from "path";
import fs from "fs/promises";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import {
  parseID3V2Array,
  traverseDirs,
  extractFilePathsFromM3U,
  validateM3UfilePaths,
  processBrokenM3Upaths,
  isValidFileExtension,
} from "./utils";

jest.mock("./validate-lib/config", () => {
  return { SUPPORTED_CODEC: ["aiff", "mp3"] };
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

    const result = isValidFileExtension("/path/to/file/here.aiff");

    expect(result).toBe(true);
  });

  it("returns 'false' if the file extension is invalid", () => {
    jest.spyOn(path, "extname").mockReturnValue(".ogg");

    const result = isValidFileExtension("/path/to/here.ogg");

    expect(result).toBe(false);
  });
});
