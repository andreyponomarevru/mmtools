import path from "path";
import util from "util";
import fs from "fs";
import { describe, expect, it, jest, beforeAll, afterAll } from "@jest/globals";

describe("checkCover", () => {
  describe("returns cover details", () => {
    it.todo("if cover width or height can't be determined");

    it.todo("if cover width or height is less than COVER_MIN_SIZE");

    it.todo("if track has no cover");

    it.todo("if cover is ok");
  });

  describe("if track has no cover", () => {
    it.todo("writes an error to file");

    it.todo("returns width and height set to 'undefined'");
  });
});

describe("checkBPM", () => {
  describe("append error to file if", () => {
    it.todo("if bpm is undefined");

    it.todo("if bpm is less than or equal to 0");

    it.todo("if bpm is not a number");
  });
});

describe("checkBitrate", () => {
  describe("append error to file if", () => {
    it.todo("if bitrate is 0");

    it.todo("if bitrate is undefined");

    it.todo("if bitrate is less than MIN_BITRATE");
  });
});

describe("checkGenres", () => {
  describe("append error to file if", () => {
    it.todo("if genre length is 0");

    it.todo("if unknown genre (i.e. not listed in genres.json)");
  });
});

describe("checkTitle", () => {
  describe("append error to file if", () => {
    it.todo("if title length is 0");

    it.todo("if title is undefined");
  });
});

describe("checkArtists", () => {
  describe("append error to file if", () => {
    it.todo("if artists length is 0");
  });
});

describe("checkYear", () => {
  describe("append error to file if", () => {
    it.todo("if yearn is undefined");

    it.todo("if year is 0");

    it.todo("if year is a negative number");

    it.todo("if year is not an integer");

    it.todo("if year is bigger than 2050");

    it.todo("if year is +-Infinity");
  });
});
