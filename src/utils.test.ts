import path from "path";
import fs from "fs/promises";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";
import {
  parseID3V2Array,
  traverseDirs,
  extractFilePathsFromM3U,
  validateM3UfilePaths,
  processBrokenM3Upaths,
} from "./utils";

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
